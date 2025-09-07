<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CartAddon extends BaseModel
{
    use HasFactory;

    protected $fillable = [
        'cart_id', 'addon_id', 'unit_price', 'subtotal'
    ];

     protected $appends = [
        'id_encrypted',
        'row_number',
        'created_at_format',
        'stock_status'
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

    public function cart()
    {
        return $this->belongsTo(Cart::class);
    }

    public function addon()
    {
        return $this->belongsTo(Addon::class);
    }
}
