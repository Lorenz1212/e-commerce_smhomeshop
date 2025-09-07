<?php

namespace App\Events;

use App\Models\OnlineOrder;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OrderReady
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $orderId;
    public $queueNumber;
    public $orderNo;
    public $message;
    /**
     * Create a new event instance.
     */
    public function __construct(OnlineOrder $order)
    {
        $this->orderId = $order->id;
        $this->queueNumber = $order->queue_number;
        $this->orderNo = $order->order_no;
        $this->message = "Your order is ready! Queue No: {$order->queue_number}";
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        // Return an array of channels
        return [ new PrivateChannel("order_ready.{$this->orderNo}") ];
    }

    public function broadcastAs()
    {
        return 'order-ready';
    }
}
