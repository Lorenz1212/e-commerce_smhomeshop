<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class OnlineOrderItem extends BaseModel
{
    use HasFactory;

    protected $fillable = [
        'order_id', 
        'product_id', 
        'variant_id', 
        'product_name', 
        'sku', 

        'quantity', 
        'unit_price', 
        'subtotal',
        'discount_amount',
        'tax_amount',

        'status',
        'fulfilled_at',
        'returned_at',
        'attributes'
    ];

    public function idEncrypted() : Attribute
    {
        return Attribute::make(
            set: fn () => $this->decrypt_string($this->id),
            get: fn () => $this->encrypt_string($this->id)
        );
    }

    public function product() {
        return $this->belongsTo(Product::class,'product_id','id');
    }

    public function attachments() {
        return $this->hasMany(OnlineOrderAttachment::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function customer() {
        return $this->belongsTo(Customer::class);
    }

    public function addons()
    {
        return $this->hasMany(OnlineOrderAddon::class, 'order_item_id', 'id');
    }
}
