<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PosTransactionAddon extends BaseModel
{
    use HasFactory;

    protected $fillable = [
        'pos_transaction_id', 'pos_transaction_item_id', 'addon_id', 'unit_price', 'subtotal'
    ];

    public function addon() {
        return $this->belongsTo(Addon::class);
    }

    public function order() {
        return $this->belongsTo(PosTransaction::class,'pos_transaction_id','id');
    }

    public function orderItem()
    {
        return $this->belongsTo(PosTransactionItem::class, 'pos_transaction_item_id', 'id');
    }
}
