<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Feedback extends BaseModel
{
    use HasFactory, SoftDeletes;

    protected $table = 'feedbacks';

    protected $fillable = [
        'source_id',
        'external_id',
        'order_no',
        'rating',
        'author_name',
        'comment',
        'date_posted',
        'sentiment',
        'confidence_score',
        'keywords',
        'status',
        'handled_by',
    ];

    protected $casts = [
        'keywords' => 'array',
        'date_posted' => 'datetime',
    ];

    protected $appends = [
        'id_encrypted',
        'row_number',
        'date_posted_format',
        'sentiment_format',
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

    protected function datePostedFormat(): Attribute
    {
        return Attribute::make(
            get: function () {
                return $this->date_posted ? Carbon::parse($this->date_posted)->format('F d, Y') : NULL;
            }
        );
    }

    protected function sentimentFormat(): Attribute
    {
        return Attribute::make(
            get: function () {
                switch($this->sentiment){
                    case 'POSITIVE':
                        return [
                            'title' => 'Positive',
                            'color' => 'success'
                        ];
                    break;
                    case 'NEGATIVE':
                        return [
                            'title' => 'Negative',
                            'color' => 'danger'
                        ];
                    break;
                    case 'NEUTRAL':
                        return [
                            'title' => 'Neutral',
                            'color' => 'info'
                        ];
                    break;
                }
            }
        );
    }

    public function source()
    {
        return $this->belongsTo(FeedbackSource::class, 'source_id');
    }

    public function handler()
    {
        return $this->belongsTo(User::class, 'handled_by');
    }
}
