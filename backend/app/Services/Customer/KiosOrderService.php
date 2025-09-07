<?php

namespace App\Services\Customer;

use App\Models\Product;
use App\Helpers\DTServerSide;
use App\Models\Order;
use App\Models\OrderItem;

class KiosOrderService
{
    public function createOrder(array $data)
    {
        $order = Order::create([
            'user_id' => $data['user_id'],
            'total_amount' => 0,
            'payment_method' => $data['payment_method'],
            'status' => 'PENDING',
        ]);

        $total = 0;

        foreach ($data['items'] as $item) {
            $product = Product::findOrFail($item['product_id']);

            // Example stock check
            if ($product->stock_quantity < $item['quantity']) {
                throw new \Exception("Not enough stock for {$product->name}");
            }

            $product->stock_quantity -= $item['quantity'];
            $product->save();

            $orderItem = new OrderItem([
                'product_id' => $product->id,
                'quantity' => $item['quantity'],
                'unit_price' => $product->price,
            ]);

            $order->items()->save($orderItem);

            $total += $product->price * $item['quantity'];
        }

        $order->total_amount = $total;

        $order->save();

        return true;
    }
}
