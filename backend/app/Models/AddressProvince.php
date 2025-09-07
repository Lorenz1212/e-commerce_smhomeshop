<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AddressProvince extends Model
{
    use HasFactory;

    const CODE_COLUMN = 'province_code';

    protected $table = 'philippine_provinces';

    protected $primaryKey = 'id';
    
    protected $visible = [
        'id', 
        'created_at',
        'updated_at'
    ];
}
