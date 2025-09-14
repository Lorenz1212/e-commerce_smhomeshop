<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Product extends BaseModel
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'sku', 'name', 'description','category_id', 'brand_id', 'quantity_on_hand', 'reorder_point', 'supplier_id', 'cost_price', 'selling_price'
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

    public function category()
    {
        return $this->belongsTo(ProductCategory::class);
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }
    
    public function primaryImage()
    {
        return $this->hasOne(ProductImage::class)->where('is_primary', 1);
    }

    public function addons()
    {
        return $this->belongsToMany(Addon::class)->withPivot('custom_price')->withTimestamps();
    }

    public function product_addons()
    {
        return $this->hasMany(ProductAddon::class);
    }

    public function product_addon()
    {
        return $this->belongsTo(ProductAddon::class);
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function brand()
    {
        return $this->belongsTo(ProductBrand::class);
    }
}
