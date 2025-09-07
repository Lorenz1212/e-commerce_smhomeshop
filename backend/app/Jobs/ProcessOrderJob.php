<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

use App\Notifications\OrderConfirmed;
use App\Models\Order;

class ProcessOrderJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $order;
    /**
     * Create a new job instance.
     */
    public function __construct(Order $order)
    {
         $this->order = $order;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // ✅ Do heavy stuff here:
        // - Generate PDF Invoice
        // - Email customer
        $this->order->user->notify(new OrderConfirmed($this->order));
        Mail::to($this->order->user->email)->send(new OrderConfirmationMail($this->order));
    }
}
