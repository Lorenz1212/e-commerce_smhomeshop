<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Rubix\ML\Online;

class OrderPreparing
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $orderId;
    public $queueNumber;
    public $orderNo;
    public $message;
    /**
     * Create a new event instance.
     */
    public function __construct(Online $order)
    {
       $this->orderId = $order->id;
       $this->queueNumber = $order->queue_number;
       $this->orderNo = $order->order_no;
       $this->message = "Your order is for preparing! Queue No: {$order->queue_number}";
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [ new PrivateChannel("order_preparing.{$this->orderNo}") ];
    }

    public function broadcastAs()
    {
        return 'order-preparing';
    }
}
