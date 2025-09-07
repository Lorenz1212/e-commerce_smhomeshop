<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OnlineOrderAttachment extends BaseModel
{
    use HasFactory;

    protected $fillable = ['order_id', 'file_path', 'uploaded_by'];

    public function order() {
        return $this->belongsTo(OnlineOrder::class);
    }
}
