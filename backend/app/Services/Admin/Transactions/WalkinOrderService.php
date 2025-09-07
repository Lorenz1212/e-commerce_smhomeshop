<?php
namespace App\Services\Admin\Transactions;

use App\Helpers\DTServerSide;
use App\Models\PosTransaction;

class WalkinOrderService
{
    public function getOrderList($request)
    {
        $data = PosTransaction::query();

        $normalFields = ['order_no', 'order_date', 'request_type', 'total_amount']; 
        
        $sortableColumns = [
            'row_number'    => 'row_number',
            'id'            => 'id',
            'created_at'    => 'created_at',
            'order_date'    => 'order_date',
            'request_type'  => 'request_type',
            'total_amount'  => 'total_amount',
        ];

        return (new DTServerSide($request, $data, $normalFields, $sortableColumns))->renderTable();
    }

    public function getOrderDetails($orderId)
    {
        $order = PosTransaction::with(['items.addons'])->findOrFail($orderId);

        return [
            'order_no' => $order->order_no,
            'queue_number' => $order->queue_number,
            'order_date' => $order->order_date_format,
            'status' => $order->status,
            'payment_status' => $order->payment_status,
            'payment_method' => $order->payment_method,
            'subtotal' => ($order->subtotal-$order->tax_amount),
            'tax_amount' => $order->tax_amount,
            'discount_amount' => $order->discount_amount,
            'total_amount' => $order->total_amount,
            'request_type' => $order->request_type,
            'status_format' => $order->status_format,
            'products' => $order->items->map(function($item) {
                return [
                    'name' => $item->product->name,
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price,
                    'subtotal' => $item->subtotal,
                    'addons' => $item->addons->map(function($addon) {
                        return [
                            'name' => $addon->addon->name,
                            'unit_price' => $addon->unit_price,
                            'subtotal' => $addon->subtotal,
                        ];
                    })
                ];
            })
        ];
    }
}
