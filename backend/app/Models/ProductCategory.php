<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class ProductCategory extends BaseModel
{
    use HasFactory, SoftDeletes;
    
    protected $fillable = [
        'name'
    ];

    protected $hidden = [
        'created_at',
        'updated_at',   
        'deleted_at'
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

    public function images()
    {
        return $this->hasMany(ProductCategoryImage::class,'category_id','id');
    }
}
