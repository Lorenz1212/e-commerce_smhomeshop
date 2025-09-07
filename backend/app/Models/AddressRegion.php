<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AddressRegion extends Model
{
    use HasFactory;

    const CODE_COLUMN = 'region_code';

    protected $table = 'philippine_regions';

    protected $primaryKey = 'id';
    
    protected $visible = [
        'id', 
        'created_at',
        'updated_at'
    ];
}
