<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class FeedbackSource extends BaseModel
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['name', 'url'];

    public function feedbacks()
    {
        return $this->hasMany(Feedback::class, 'source_id');
    }
}