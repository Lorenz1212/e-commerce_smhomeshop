<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Storage;

class QueueOrder extends BaseModel
{
    use HasFactory;

    protected $fillable = [
        'queue_no', 'order_status'
    ];

    protected $hidden = [
        'id'
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
}
