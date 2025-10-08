<?php

namespace App\Models;

use App\Helpers\AddressHelper;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class CustomerAddress extends BaseModel
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'customer_id',
        'company_name',
        'address',
        'brgy_code',
        'city_code',
        'province_code',
        'region_code',
        'postal_code',
        'default_flag',
    ];

    protected $hidden = [
        'id'
    ];

    protected $appends = [
        'row_number',
        'id_encrypted',
        'full_address'
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

    protected function fullAddress(): Attribute
    {
        return Attribute::make(
            get: function () {
                if (!$this->region_code || !$this->province_code || !$this->city_code || !$this->brgy_code) {
                    return 'Incomplete Address'; // Prevent errors if IDs are missing
                }
    
                $dataArrray = [
                    'region' => $this->region_code,
                    'province' => $this->province_code,
                    'city' => $this->city_code,
                    'brgy' => $this->brgy_code
                ];

                return (new AddressHelper)->getFullAddress($this->address,$dataArrray);
            }
        );
    }
}
