<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Storage;

class ProductVariantImage extends BaseModel
{
    use HasFactory;

    protected $fillable = [
        'variant_id', 'filename', 'is_primary'
    ];

     protected $appends = [
        'id_encrypted',
        'row_number',
        'created_at_format',
        'stock_status',
        'image_cover'
    ];

    protected $casts = [
        'attributes' => 'array', // JSON cast to array
        'is_active' => 'boolean',
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

    public function variant()
    {
        return $this->belongsTo(ProductVariant::class, 'variant_id');
    }

    protected function imageCover(): Attribute
    {
        return Attribute::make(
            get: function () {
                $path = 'images/products/'.$this->filename;
                if ($this->filename && Storage::disk('public')->exists($path)) {
                    // Get the full URL to the image file
                    return url(Storage::url('images/variants/'.$this->filename));
                }

                // Return the full URL to the default image
                return url(Storage::url('images/variants/default.jpg'));
                           
            }
        );
    }
}
