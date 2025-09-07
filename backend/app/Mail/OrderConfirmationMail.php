<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Order;

class OrderConfirmationMail  extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public $order;

    public function __construct(Order $order)
    {
       $this->order = $order;
    }

    /**
     * Get the message envelope.
     */
    public function build()
    {
        return $this->subject('Order Confirmation')
            ->view('emails.order_confirmation')
            ->with(['order' => $this->order]);
    }
   
}