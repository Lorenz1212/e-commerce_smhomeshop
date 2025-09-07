<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderCounter extends BaseModel
{
    use HasFactory;

    protected $fillable = [
        'last_order_no'
    ];
}
