<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Storage;

class Cart extends BaseModel
{
    use HasFactory;

    protected $fillable = [
        'customer_id', 'product_id', 'quantity', 'status'
    ];

     protected $appends = [
        'id_encrypted',
        'row_number',
        'created_at_format'
    ];

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

    protected function CreatedAtFormat(): Attribute
    {
        return Attribute::make(
            get: function () {
                return $this->created_at ? Carbon::parse($this->created_at)->format('F d, Y h:i A') : NULL;
            }
        );
    }

    public function addons()
    {
        return $this->belongsToMany(Addon::class, 'cart_addons')->withPivot('price');
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function cart_addons()
    {
        return $this->hasMany(CartAddon::class);
    }
}
