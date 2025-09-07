<?php
namespace App\Services\Admin\Transactions;

use App\Helpers\DTServerSide;
use App\Models\OnlineOrder;

class OnlineOrderService
{
    public function getOrderList($request)
    {
        $data = OnlineOrder::with('customer');

        $normalFields = ['order_no', 'order_date', 'request_type', 'total_amount', 'customer.full_name']; 
        
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
        $order = OnlineOrder::with(['items.addons'])->findOrFail($orderId);

        return [
            'order_no' => $order->order_no,
            'queue_number' => $order->queue_number,
            'order_date' => $order->order_date_format,
            'scheduled_time' => $order->scheduled_time,
            'request_type' => $order->request_type,
            'payment_status' => $order->payment_status,
            'payment_method' => $order->payment_method,
            'subtotal' => ($order->subtotal-$order->tax_amount),
            'total_amount' => $order->total_amount,
            'tax_amount' => $order->tax_amount,
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
