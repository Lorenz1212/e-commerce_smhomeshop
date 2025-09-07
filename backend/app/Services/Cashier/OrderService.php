<?php

namespace App\Services\Cashier;

use App\Models\InventoryMovement;
use App\Models\Product;
use App\Models\OnlineOrder;
use App\Models\OnlineOrderAddon;
use App\Models\OnlineOrderItem;
use App\Models\PosTransaction;
use App\Models\PosTransactionItem;
use App\Models\PosTransactionAddon;
use App\Models\ProductCategory;
use App\Traits\Encryption;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class OrderService
{
    use Encryption;

    public function getCategoryList($request)
    {
        $data = ProductCategory::get()->map(function ($query) {
            $query->image_cover = $query->images->first()?->image_cover;
            return $query;
        });

        $result = [];

        foreach ($data as $item) {
            $result[] = [
                'id_encrypted'      => $item->id_encrypted,
                'name'              => $item->name,
                'image_cover'       => $item->image_cover,
            ];
        }

        return $result;
    }

    public function getProductList($category_id)
    {
        $products = Product::with(['images', 'product_addons'])->where('category_id',$category_id)->get();

        $result = [];

        foreach ($products as $product) {
            $result[] = [
                'id_encrypted'      => $product->id_encrypted,
                'sku'               => $product->sku,
                'name'              => $product->name,
                'quantity_on_hand'  => $product->quantity_on_hand,
                'reorder_point'     => $product->reorder_point,
                'selling_price'     => $product->selling_price,
                'stock_status'      => $product->stock_status,
                'image_cover'       => $product->images->first()?->image_cover,
                'addons' => $product->product_addons->map(function ($product_addon) {
                 return [
                    'id' => $product_addon->addon->id,
                    'name' => $product_addon->addon->name,
                    'price' => $product_addon->custom_price
                ];
            })
            ];
        }

        return $result;
    }

    public function getOnlineOrderList()
    {
        $orders = OnlineOrder::where('status', c('ORDER_PENDING'))
            ->with(['items.addons.addon', 'items.product'])
            ->orderBy('created_at', 'DESC')
            ->get();

        $data = [];

        foreach ($orders as $order) {
            $items = $order->items->map(function ($item) {
                // Sum of the product's addons
                $addonsTotal = $item->addons->sum(fn($addon) => (float) $addon->subtotal);

                // Combine product subtotal + addons subtotal
                $totalWithAddons = (float) $item->subtotal + $addonsTotal;

                // Include addon details inside the item
                $addons = $item->addons->map(fn($addon) => [
                    'id' => $addon->addon->id,
                    'name' => $addon->addon->name,
                    'unit_price' => $addon->unit_price,
                    'subtotal' => $addon->subtotal,
                    'price' => (float) $addon->unit_price,
                ]);

                return [
                    'order_item_id'=>$item->id_encrypted,
                    'id_encrypted' => $item->product->id_encrypted,
                    'image_cover'=> $item->product->images->first()?->image_cover??null,
                    'name' => $item->product->name,
                    'quantity' => $item->quantity,
                    'unit_price' => (float) $item->unit_price,
                    'subtotal' => (float) $item->subtotal,
                    'addons_count' => $item->addons->count(),
                    'addons_total' => $addonsTotal,
                    'total_with_addons' => $totalWithAddons,
                    'addons' => $addons,
                ];
            });

            $orderTotal = $items->sum(fn($item) => $item['total_with_addons']);

            $data[] = [
                'id' => $order->id_encrypted,
                'order_no' => $order->order_no,
                'order_date' => Carbon::parse($order->order_date)->format('F d, Y'),
                'total_amount' => $orderTotal,
                'status' => $order->status,
                'items' => $items,
            ];
        }

        return $data;
    }

    public function getOnlineOrdersItem($order_id)
    {
        $data = OnlineOrderItem::where('order_id',$order_id)->get();

        return $data;
    }

    public function processOrder($request,$order_id)
    {
        $order_no = null;

        if ($order_id) {
            $order_no = $this->process_online_order($request,$order_id);
        } else {
            $order_no = $this->process_pos_order($request);
        }

        return $order_no;
    }

    public function process_online_order($request,$order_id)
    {
        $order = OnlineOrder::findOrFail($order_id);

        $order_no = $order->order_no;

        $submittedItemIds = [];

        foreach ($request->products as $product) {
            $product_id = $this->decrypt_string($product['product_id']);
            $order_item_id = !empty($product['order_item_id']) ? $this->decrypt_string($product['order_item_id']) : null;

            // Find existing item if exists
            $orderItem = $order_item_id ? OnlineOrderItem::find($order_item_id) : null;

            // Calculate stock difference
            $oldQty = $orderItem ? $orderItem->quantity : 0;
            $newQty = $product['quantity'];
            $diffQty = $newQty - $oldQty;

            // Update or create order item
            $orderItem = OnlineOrderItem::updateOrCreate(
                [
                    'id' => $order_item_id,
                    'order_id' => $order_id,
                    'product_id' => $product_id,
                ],
                [
                    'quantity' => $newQty,
                    'unit_price' => $product['unit_price'],
                    'subtotal' => ($product['unit_price']*$newQty),
                ]
            );

            $submittedItemIds[] = $orderItem->id;

            // Adjust stock properly
            $prod = Product::find($product_id);
            if ($prod) {
                $prod->quantity_on_hand -= $diffQty;
                if ($prod->quantity_on_hand < 0) {
                    throw new \Exception("Not enough stock for product {$prod->name}");
                }
                $prod->save();

                InventoryMovement::create([
                    'product_id'=>$prod->id,
                    'supplier_id'=>$prod->supplier_id,
                    'quantity' => $newQty,
                    'movement_type'=>'OUT'
                ]);
            }

            // --- Handle Addons ---
            $submittedAddonIds = [];

            if (!empty($product['addons'])) {
                foreach ($product['addons'] as $addon) {
                   $addonId = $addon['addon_id'];

                   OnlineOrderAddon::updateOrCreate(
                        [
                            'order_id' => $order_id,
                            'order_item_id' => $orderItem->id,
                            'product_id' => $product_id,
                            'addon_id' => $addonId,
                        ],
                        [
                            'unit_price' => $addon['unit_price'],
                            'subtotal' => ($addon['unit_price']*$newQty),
                        ]
                    );

                    $submittedAddonIds[] = $addonId;
                }
            }

            // Delete addons removed by cashier
            OnlineOrderAddon::where('order_item_id', $orderItem->id)
                ->whereNotIn('addon_id', $submittedAddonIds)
                ->delete();
        }

        // 3. Calculate totals including addons
        $subtotal_items  = OnlineOrderItem::where('order_id', $order_id)->sum('subtotal');
        $subtotal_addons = OnlineOrderAddon::where('order_id', $order_id)->sum('subtotal');
        $total_amount    = ($subtotal_items + $subtotal_addons);
        
        $vat_amount = $total_amount * (c('VAT_RATE') / (1 + c('VAT_RATE')));
        // Update order totals
        $order->update([
            'subtotal'     => $total_amount,
            'tax_amount'   => $vat_amount,
            'total_amount' => $total_amount,
            'status'       => c('ORDER_PAID'),
        ]);

        // Delete order items removed by cashier
        OnlineOrderItem::where('order_id', $order_id)
        ->whereNotIn('id', $submittedItemIds)
        ->each(function ($item) {
            // Return stock for removed items
            $prod = Product::find($item->product_id);
            if ($prod) {
                $prod->quantity_on_hand += $item->quantity;
                $prod->save();
                InventoryMovement::create([
                    'product_id'=>$prod->id,
                    'supplier_id'=>$prod->supplier_id,
                    'quantity' => $item->quantity,
                    'movement_type'=>'IN'
                ]);
            }
            $item->delete();
        });

        return $order_no;
    }

    public function process_pos_order($request)
    {
            // 1. Create POS transaction
            $transaction = PosTransaction::create([
                'order_no' => $request->order_no ?? $this->generateOrderNo(),
                'store_id' => $request->store_id ?? 1,
                'kiosk_id' => $request->kiosk_id ?? 1,
                'transaction_datetime' => now(),
                'status' => c('POS_PAID'),
            ]);

            $order_id = $transaction->id;

            // 2. Process each product in the order
            if (!empty($request->products)) {
                foreach ($request->products as $product) {
                    $product_id = $this->decrypt_string($product['product_id']);
                    $quantity   = $product['quantity'];

                    // Create transaction item
                    $item = PosTransactionItem::create([
                        'pos_transaction_id' => $order_id,
                        'product_id'         => $product_id,
                        'quantity'           => $quantity,
                        'unit_price'         => $product['unit_price'],
                        'subtotal'           => $product['subtotal'],
                    ]);

                    // Deduct stock for the product
                    $prod = Product::find($product_id);
                    if ($prod) {
                        $prod->quantity_on_hand -= $quantity;
                        $prod->save();
                        InventoryMovement::create([
                            'product_id'=>$prod->id,
                            'supplier_id'=>$prod->supplier_id,
                            'quantity' => $quantity,
                            'movement_type'=>'OUT'
                        ]);
                    }

                    // Process addons for this product
                    if (!empty($product['addons'])) {
                        foreach ($product['addons'] as $addon) {
                            PosTransactionAddon::create([
                                'pos_transaction_id' => $order_id,
                                'transaction_item_id'=> $item->id,
                                'addon_id'           => $addon['addon_id'],
                                'unit_price'         => $addon['unit_price'],
                                'subtotal'           => $addon['subtotal'],
                            ]);
                        }
                    }
                }
            }

            // 3. Calculate totals including addons
            $subtotal_items  = PosTransactionItem::where('pos_transaction_id', $order_id)->sum('subtotal');
            $subtotal_addons = PosTransactionAddon::where('pos_transaction_id', $order_id)->sum('subtotal');
            $subtotal        = $subtotal_items + $subtotal_addons;

            // Calculate VAT (example: VAT_RATE = 0.12)
            $vat_amount = $subtotal * (c('VAT_RATE') / (1 + c('VAT_RATE')));

            // 4. Update transaction totals
            $transaction->update([
                'subtotal'        => $subtotal,
                'tax_amount'      => $vat_amount ?? 0,
                'discount_amount' => 0,
                'total_amount'    => $subtotal,
            ]);

            return $transaction->order_no;
    }

    public function generateOrderNo()
    {
        return DB::transaction(function () {
            $counter = DB::table('order_counters')->lockForUpdate()->first();

            // If no counter exists yet
            if (!$counter) {
                DB::table('order_counters')->insert(['last_order_no' => 1]);
                $sequence = 1;
            } else {
                $sequence = $counter->last_order_no + 1;
                DB::table('order_counters')->update(['last_order_no' => $sequence]);
            }

            $year = now()->format('y'); // e.g. 25 for 2025
            $month = now()->format('m'); // e.g. 03 for March

            return $year . $month . str_pad($sequence, 5, '0', STR_PAD_LEFT); // e.g. 250300001
        });
    }

    public function QueueOrder(){
         // Kunin lahat ng orders galing online_orders
        $onlineOrders = OnlineOrder::whereIn('status', ['PAID', 'READY'])
            ->select(
                'id',
                'order_no',
                'queue_number',
                'status',
                'request_type'
            )
            ->get();

        // Kunin lahat ng orders galing pos_transactions
        $posOrders = PosTransaction::whereIn('status', ['PAID', 'READY'])
            ->select(
                'id',
                'order_no',
                'queue_number',
                'status',
                'request_type'
             )
            ->get();

        // Gawing iisang collection na plain array values
        $merged = collect()
            ->concat(
                $onlineOrders->map(fn($order) => [
                    'id' => $order->id_encrypted,
                    'order_no' => $order->order_no,
                    'queue_number' => $order->queue_number,
                    'status'=>$order->status,
                    'request_type'=>$order->request_type,
                    'source' => 'ONLINE',
                ])
            )
            ->concat(
                $posOrders->map(fn($order) => [
                    'id' => $order->id_encrypted,
                    'order_no' => $order->order_no,
                    'queue_number' => $order->queue_number,
                    'status'=>$order->status,
                    'request_type'=>$order->request_type,
                    'source' => 'POS',
                ])
            );

        // Bilangin
        $preparingCount = $merged->where('status', 'PAID')->values();
        $readyCount     = $merged->where('status', 'READY')->values();

        return [
            'preparing' => $preparingCount,
            'ready'     => $readyCount
        ];
    }

    public function QueueOrderCount()
    {
        // Kunin lahat ng orders galing online_orders
        $onlineOrders = OnlineOrder::whereIn('status', ['PAID', 'READY'])
            ->select('id', 'status')
            ->get();

        // Kunin lahat ng orders galing pos_transactions
        $posOrders = PosTransaction::whereIn('status', ['PAID', 'READY'])
            ->select('id', 'status')
            ->get();

        // Gawing iisang collection na plain array values
        $merged = collect()
            ->concat(
                $onlineOrders->map(fn($order) => [
                    'id'     => $order->id,
                    'status' => $order->status,
                    'source' => 'ONLINE',
                ])
            )
            ->concat(
                $posOrders->map(fn($order) => [
                    'id'     => $order->id,
                    'status' => $order->status,
                    'source' => 'POS',
                ])
            );

        // Bilangin
        $preparingCount = $merged->where('status', 'PAID')->count();
        $readyCount     = $merged->where('status', 'READY')->count();

        return [
            'preparing' => $preparingCount,
            'ready'     => $readyCount
        ];
    }

    public function updateQueueOrder($data,$id){

         $model = ($data['source'] ?? 'ONLINE') === 'POS'
            ? PosTransaction::findOrFail($id)
            : OnlineOrder::findOrFail($id);

        if ($data['status'] === 'READY' && $model->status !== 'PAID') {
             throw new \Exception("Only PAID orders can move to READY");
        }

        if ($data['status'] === 'SERVED' && $model->status !== 'READY') {
            throw new \Exception("Only READY orders can move to SERVED");
        }

        $model->status = $data['status'];
        $model->save();

        return true;
    }
}
