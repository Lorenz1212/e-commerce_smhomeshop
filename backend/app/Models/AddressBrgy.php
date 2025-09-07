<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AddressBrgy extends Model
{
    use HasFactory;

    const CODE_COLUMN = 'barangay_code';

    protected $table = 'philippine_barangays';

    protected $primaryKey = 'id';
    
    protected $visible = [
        'id', 
        'created_at',
        'updated_at'
    ];
}
