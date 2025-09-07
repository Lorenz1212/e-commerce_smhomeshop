<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PosTransactionItem extends BaseModel
{
    use HasFactory;
    
    protected $fillable = [
        'pos_transaction_id', 
        'product_id', 
        'quantity', 
        'unit_price',
        'subtotal'
    ];

    public function product() {
        return $this->belongsTo(Product::class,'product_id','id');
    }

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function addons()
    {
        return $this->hasMany(PosTransactionAddon::class, 'pos_transaction_item_id', 'id');
    }
}
