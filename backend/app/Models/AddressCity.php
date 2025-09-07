<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AddressCity extends Model
{
    use HasFactory;

    const CODE_COLUMN = 'city_municipality_code';

    protected $table = 'philippine_cities';

    protected $primaryKey = 'id';
    
    protected $visible = [
        'id', 
        'created_at',
        'updated_at'
    ];
}
