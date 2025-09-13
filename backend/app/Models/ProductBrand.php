<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class ProductBrand extends BaseModel
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
         'name', 'image'
    ];

    protected $hidden = [
        'id',
        'image',
        'created_at',
        'updated_at',
        'deleted_at'
    ];

     protected $appends = [
        'id_encrypted',
        'row_number',
        'created_at_format',
        'image_cover'
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

    protected function imageCover(): Attribute
    {
        return Attribute::make(
            get: function () {
                $path = 'images/brands/'.$this->image;
                if ($this->filename && Storage::disk('public')->exists($path)) {
                    // Get the full URL to the image file
                    return url(Storage::url('images/brands/'.$this->image));
                }

                // Return the full URL to the default image
                return url(Storage::url('images/brands/default.jpg'));
            }
        );
    }
}
