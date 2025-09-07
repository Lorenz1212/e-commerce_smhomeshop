<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class OnlineOrderAddon extends BaseModel
{
    use HasFactory;

    protected $fillable = [
        'order_id', 'order_item_id', 'addon_id', 'unit_price', 'subtotal', 'product_id'
    ];

    public function idEncrypted() : Attribute
    {
        return Attribute::make(
            set: fn () => $this->decrypt_string($this->id),
            get: fn () => $this->encrypt_string($this->id)
        );
    }

    public function addon() {
        return $this->belongsTo(Addon::class,'addon_id','id');
    }

    public function order() {
        return $this->belongsTo(OnlineOrder::class,'order_id','id');
    }

    public function orderItem()
    {
        return $this->belongsTo(OnlineOrderItem::class, 'order_item_id', 'id');
    }
}
