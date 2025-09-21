<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductVariant extends BaseModel
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'product_id', 'sku', 'variant_name',
        'quantity_on_hand', 'reorder_point',
        'cost_price', 'selling_price', 'attributes'
    ];

     protected $appends = [
        'id_encrypted',
        'row_number',
        'created_at_format',
        'stock_status'
    ];

    protected $casts = [
        'attributes' => 'array', // JSON cast to array
        'is_active' => 'boolean',
    ];

     protected $hidden = [
        'id',
        'product_id',
        'status',
        'created_at',
        'deleted_at',
        'updated_at',
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

    protected function StockStatus(): Attribute
    {
        return Attribute::make(
            get: function () {
                if ($this->quantity_on_hand <= 0) {
                    return [
                        'title' => 'Out of Stock',
                        'color' => 'danger'
                    ];
                } elseif ($this->quantity_on_hand <= $this->reorder_point) {
                    return [
                        'title' => 'Low Stock',
                        'color' => 'warning'
                    ];
                } else {
                    return [
                        'title' => 'In Stock',
                        'color' => 'success'
                    ];
                }
            }
        );
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function images()
    {
        return $this->hasMany(ProductVariantImage::class,'variant_id','id');
    }

    public function image()
    {
        return $this->hasOne(ProductVariantImage::class,'variant_id','id');
    }
}
