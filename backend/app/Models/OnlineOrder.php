<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Events\OrderReady;

class OnlineOrder extends BaseModel
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'order_no', 
        'queue_number', 
        'customer_id', 
        'store_id', 
        'order_date',
        'scheduled_time',
        'status',
        'payment_status',
        'payment_method',
        'total_amount',
        'subtotal',
        'tax_amount',
        'discount_amount',
        'delivery_address',
        'special_instructions',
        'request_type',
    ];

    protected $hidden = [
        'id',
        'customer_id',
        'delivery_address',
        'order_date',
        'payment_status',
        'scheduled_time',
        'special_instructions',
        'store_id',
        'status',
        'created_at',
        'deleted_at',
        'updated_at',
    ];

     protected $appends = [
        'id_encrypted',
        'row_number',
        'order_date_format',
        'customer_name',
        'status_format'
    ];

    public static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->order_no = self::generateOrderNumber();
        });

        static::updated(function ($order) {
            if ($order->isDirty('status')) {
                if($order->status === c('ORDER_PAID')){
                    $exists = QueueOrder::where('queue_no', $order->queue_number)->exists();

                    if (!$exists) {

                        $queueNo = self::generateQueueNumber();
                        $order->queue_number = $queueNo;
                        $order->saveQuietly(); 

                        QueueOrder::create([
                            'queue_no' => $queueNo,
                            'order_status' => c('QUEUE_ONLINE'),
                        ]);
                        
                        broadcast(new OrderReady($order));
                    }
                }
                if($order->status === c('ORDER_READY')){
                    broadcast(new OrderReady($order));
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
                return $this->order_date ? Carbon::parse($this->order_date)->format('F d, Y') : NULL;
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

    public function customerName(): Attribute 
    {
        return Attribute::make(
            get: fn () => $this->customer?->full_name
        );
    }

    public function customer() {
        return $this->belongsTo(Customer::class,'customer_id','id');
    }

    public function items() {
        return $this->hasMany(OnlineOrderItem::class,'order_id');
    }

    public function attachments() {
        return $this->hasMany(OnlineOrderAttachment::class);
    }

    public function queue() {
        return $this->belongsTo(QueueOrder::class);
    }
    
    public function addons()
    {
        return $this->hasMany(OnlineOrderAddon::class, 'order_id', 'id');
    }

}
