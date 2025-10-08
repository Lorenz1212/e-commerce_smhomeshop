<?php

namespace App\Services\Customer;

use Illuminate\Support\Facades\Auth;
use App\Helpers\Api\GoogleNLPService;
use App\Models\Cart;
use App\Models\CartAddon;
use App\Models\Feedback;
use App\Models\FeedbackSource;
use App\Models\OnlineOrder;
use App\Models\ProductAddon;
use App\Traits\Encryption;
use Carbon\Carbon;

class OrderService
{
    use Encryption; 

    public function getCartList(){

        $user_id = Auth::guard('customer')->user()->id;

        $carts = Cart::where('customer_id', $user_id)->where('status',c('CART_PENDING'))->get();

        $data = [];

        foreach($carts as $cart){
            $data[] = [
                'id' => $cart->id_encrypted,
                'product_id' => $cart->product->id_encrypted,
                'product_name' => $cart->product->name,
                'image_url' => $cart->product->primary_image?->image_cover,
                'selling_price' => $cart->variant ? ($cart->variant->selling_price ?? $cart->product->selling_price) : $cart->product->selling_price,
                'quantity' => $cart->quantity,
                'variant'      => $cart->variant ? [
                    'id'           => $cart->variant->id_encrypted,
                    'name'         => $cart->variant->variant_name,
                    'selling_price'=> $cart->variant->selling_price
                ] : null,
                'addons' => $cart->cart_addons->map(function ($cart_addons) {
                    return [
                        'id' => $cart_addons->addon_id,
                        'name' => $cart_addons->addon->name,
                        'price' => $cart_addons->subtotal,
                        'is_freebie' => $cart_addons->is_freebie
                    ];
                }),
                
            ];
        }

        return $data;
    }

    public function getCartCount(){

        $user_id = Auth::guard('customer')->user()->id;

        return Cart::where('customer_id', $user_id)->where('status',c('CART_PENDING'))->count();
    }

    public function cartStore($request){
   
        $user = Auth::guard('customer')->user();

        $addonIdsFromRequest = collect($request->addons ?? [])
            ->map(function ($addon) {
                return $this->decrypt_string($addon['addon_id']); 
            })
            ->sort()
            ->values()
            ->toArray();
     
        $addonSignature = md5(json_encode($addonIdsFromRequest)); 

        
        $cart = Cart::where('customer_id', $user->id)
            ->where('product_id', $request->product_id)
            ->where('variant_id', $request->variant_id)
            ->where('status', c('CART_PENDING'))
            ->where('addon_signature', $addonSignature)
            ->first();

        if ($cart) {
            $cart->quantity += $request->quantity;
            $cart->save();
        } else {
            $cart = Cart::create([
                'customer_id' => $user->id,
                'product_id' => $request->product_id,
                'variant_id' => $request->variant_id,
                'quantity' => $request->quantity,
                'status' => c('CART_PENDING'),
                'addon_signature' => $addonSignature,
            ]);
        }

        // Update addons
        CartAddon::where('cart_id', $cart->id)
            ->whereNotIn('addon_id', $addonIdsFromRequest)
            ->delete();

        foreach ($addonIdsFromRequest as $product_addon_id) {
            $product_addon = ProductAddon::find($product_addon_id);

            if ($product_addon) {
                CartAddon::updateOrCreate(
                    [
                        'cart_id' => $cart->id,
                        'addon_id' => $product_addon->addon_id,
                    ],
                    [
                        'unit_price' => ($product_addon->addon->is_freebies=='N')? $product_addon->custom_price:0,
                        'subtotal'   => ($product_addon->addon->is_freebies=='N')?($product_addon->custom_price*$request->quantity):0,
                        'is_freebie' => $product_addon->addon->is_freebies
                    ]
                );
            }
        }

        return Cart::where('customer_id', $user->id)->where('status', 'PENDING')->count();
    }

    public function cartUpdate($request){

        $cart = Cart::find($request->cart_id);

        if ($cart) {
            $cart->quantity = $request->quantity;
            $cart->save();
        } else {
            return null; // or throw exception kung invalid cart_id
        }

        return $cart->product->name;
    }

    public function cartDelete($cart_id){
        Cart::find($cart_id)->delete();
        CartAddon::where('cart_id',$cart_id)->delete();
        return true;
    }

    public function getOrderList() {
        $userId = Auth::guard('customer')->id();
        $orders = OnlineOrder::where('customer_id', $userId)
            ->with(['items.addons'])
            ->orderBy('created_at','DESC')
            ->get();

        $data = [];

        foreach ($orders as $order) {
            $feedback = Feedback::where('order_no',$order->order_no)->first();

            $items = $order->items->map(function ($item) {
                $addonsTotal = $item->addons->sum('subtotal');
                return [
                    'name'          => $item->product->name,
                    'quantity'      => $item->quantity,
                    'unit_price'    => $item->unit_price,
                    'subtotal'      => $item->subtotal,
                    'addons_count'  => $item->addons->count(),
                    'addons_total'  => $addonsTotal
                ];
            });

            $orderTotal = $items->sum(function ($item) {
                return $item['subtotal'] + $item['addons_total'];
            });

            $data[] = [
                'id'           => $order->id_encrypted,
                'order_no'     => $order->order_no,
                'order_date'   => Carbon::parse($order->order_date)->format('F d, Y'),
                'total_amount' => $orderTotal, // kasama na addons
                'status'       => $order->status,
                'items'        => $items,
                'feedback_given'=> $feedback->rating??null
            ];
        }

        return $data;
    }

    public function orderCheckout($request){
        
        $userId = Auth::guard('customer')->user()->id;

        $carts = Cart::with(['product', 'cart_addons'])
                    ->where('customer_id', $userId)
                    ->where('status', c('CART_PENDING'))
                    ->get();

        if ($carts->isEmpty()) {
            return null;
        }

        $order = OnlineOrder::create([
            'customer_id'    => $userId,
            'store_id'       => 1,
            'order_date'     => now()->toDateString(),
            'payment_method' => 'CASH',
            'request_type'   => $request->type,
            'status'         => c('ORDER_PENDING'),
            'total_amount'   => 0
        ]);

        $totalAmount = 0;

        foreach ($carts as $cart) {
            // Create order item
            $subtotal = $cart->product->selling_price * $cart->quantity;
            $orderItem = $order->items()->create([
                'product_id' => $cart->product_id,
                'quantity'   => $cart->quantity,
                'unit_price' => $cart->product->selling_price,
                'subtotal'   => $subtotal
            ]);
            
            $totalAmount += $subtotal;

            // Create addons linked to this order item
            foreach ($cart->cart_addons as $addon) {
                $order->addons()->create([
                    'order_item_id' => $orderItem->id,
                    'addon_id'      => $addon->addon_id,
                    'product_id'    => $cart->product_id,
                    'unit_price'    => $addon->unit_price,
                    'subtotal'      => $addon->subtotal,
                    'is_freebie'    => $addon->is_freebie
                ]);
                $totalAmount += $addon->subtotal;
            }
        }

        $vat_amount = $totalAmount * (c('VAT_RATE') / (1 + c('VAT_RATE')));

        $order->update([
            'total_amount' => $totalAmount,
            'tax_amount'   => $vat_amount,
            'subtotal'     => $totalAmount
        ]);

        Cart::whereIn('id', $carts->pluck('id'))->update(['status' => c('CART_COMPLETED')]);

        return $order->order_no;
    }

    public function getOrderQueue(){

        $userId = Auth::guard('customer')->id();

        $orders = OnlineOrder::whereIn('status', ['PAID','READY'])->where('customer_id', $userId)
        ->select(
            'id',
            'order_no',
            'queue_number',
            'status',
            'request_type'
        )->get();

        return $orders;
    }

    public function orderFeedback($request,$order_id){

        $nlp = (new GoogleNLPService);

        $nlpResult = $nlp->analyzeSentiment($request->comment);

        $order = OnlineOrder::where('id', $order_id)->first();

        Feedback::create([
            'source_id' => FeedbackSource::firstOrCreate(['name' => 'MOBILE APP'])->id,
            'order_no'  => $order->order_no,
            'rating'    =>$request->rating,
            'comment'   => $request->comment,
            'sentiment' => $nlpResult['sentiment'],
            'confidence_score' => $nlpResult['score'],
            'author_name' => $order->customer->full_name,
            'date_posted' => Carbon::now(),
            'handle_by'=>$order->id,
            'status' => c('FEEDBACK_NEW')
        ]);


        return true;
    }
}
