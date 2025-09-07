<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Casts\Attribute;

class PosTransaction extends BaseModel
{
    use HasFactory;

    protected $fillable = [
        'order_no', 
        'queue_number', 
        'store_id', 
        'kiosk_id',
        'transaction_datetime',
        'subtotal',
        'tax_amount',
        'discount_amount',
        'total_amount',
        'payment_status',
        'payment_method',
        'order_source',
        'status',
    ];

      protected $hidden = [
        'id',
        'kiosk_id',
        'customer_id',  
        'transaction_datetime',
        'payment_status',
        'payment_method',
        'status',
        'created_at',
        'deleted_at',
        'updated_at',
    ];

     protected $appends = [
        'id_encrypted',
        'row_number',
        'order_date_format',
        'status_format'
    ];

    public static function boot()
    {
        parent::boot();

        static::updated(function ($order) {
            if ($order->status === c('POS_READY')) {
                // Only if this order just changed to READY
                $exists = QueueOrder::where('queue_no', $order->queue_number)->exists();

                if (!$exists) {
                    // Generate queue number if not yet assigned
                    $queueNo = self::generateQueueNumber(); // You can customize this
                    $order->queue_number = $queueNo;
                    $order->saveQuietly(); // Avoid infinite loop of updated()

                    QueueOrder::create([
                        'queue_no' => $queueNo,
                        'order_status' => c('QUEUE_DIRECT'),
                    ]);
                }
            }
        });
    }

        protected function rowNumber(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->attributes['row_number'] ?? null
        );
    }

    public function idEncrypted() : Attribute
    {
        return Attribute::make(
            set: fn () => $this->decrypt_string($this->id),
            get: fn () => $this->encrypt_string($this->id)
        );
    }

    protected function orderDateFormat(): Attribute
    {
        return Attribute::make(
            get: function () {
                return $this->transaction_datetime ? Carbon::parse($this->transaction_datetime)->format('F d, Y') : NULL;
            }
        );
    }

    protected function statusFormat(): Attribute
    {
        return Attribute::make(
            get: function () {
                switch($this->status){
                    case 'PENDING':
                        return [
                            'title' => 'Pending',
                            'color' => 'warning'
                        ];
                    break;
                    case 'IN_PROGRESS':
                        return [
                            'title' => 'In Progress',
                            'color' => 'primary'
                        ];
                    break;
                    case 'PAID':
                        return [
                            'title' => 'Preparing',
                            'color' => 'info'
                        ];
                    break;
                    case 'READY':
                        return [
                            'title' => 'Ready to Serve',
                            'color' => 'secondary'
                        ];
                    break;
                    case 'SERVED':
                        return [
                            'title' => 'Served',
                            'color' => 'success'
                        ];
                    break;
                    case 'CANCELLED':
                        return [
                            'title' => 'Cancelled',
                            'color' => 'danger'
                        ];
                    break;
                }
            }
        );
    }

    public function items() {
        return $this->hasMany(PosTransactionItem::class,'pos_transaction_id');
    }

    public function addons()
    {
        return $this->hasMany(PosTransactionAddon::class, 'pos_transaction_id', 'id');
    }
}
