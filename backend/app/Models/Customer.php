<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class Customer extends BaseModel
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'fname',
        'lname',
        'mname',
        'suffix',
        'gender',
        'birth_date',
        'age',
        'phone',
        'loyalty_points',
        'is_active',
        'is_block',
        'image',
    ];

     protected $hidden = [
        'id',
        'fname',
        'lname',
        'mname',
        'suffix',
        'birth_date',
        'age',
        'gender',
        'image',
        'is_active',
        'is_block',
        'loyalty_points',
        'created_at',
        'updated_at',
        'deleted_at'
    ];


    protected $appends = [
        'id_encrypted',
        'full_name',
        'gender_text_format',
        'birth_date_format',
        'image_cover'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->customer_no = self::generateNumber();
        });
    }

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

    protected function fullName(): Attribute
    {
        return Attribute::make(
            get: function () {
                $fname = $this->fname;
                $mname = $this->mname;
                $lname = $this->lname;
                $suffix=$this->suffix;

                $minitial = $mname ? strtoupper($mname[0]) . '.' : '';
                
                return  ($fname? ucfirst($fname):'') . ' ' . $minitial . ' '. ($lname? ucfirst($lname):'') .' '. ($suffix ? ucfirst($suffix):'');
            }
        );
    }

    protected function genderTextFormat(): Attribute
    {
        return Attribute::make(
            get: function () {
                return c('GENDER_TEXT_FORMAT')[$this->gender];
            }
        );
    }

    protected function birthDateFormat(): Attribute
    {
        return Attribute::make(
            get: function () {
                return $this->birth_date ? Carbon::parse($this->birth_date)->format('F d, Y') : NULL;
            }
        );
    }

    protected function imageCover(): Attribute
    {
        return Attribute::make(
            get: function () {
                $path = 'images/customer/'.$this->image;
                if ($this->image && Storage::disk('public')->exists($path)) {
                    // Get the full URL to the image file
                    return url(Storage::url('images/customer/'.$this->image));
                }
                // Default image based on gender
                $default = c('AVATAR_DEFAULT')[$this->gender];
                
                // Return the full URL to the default image
                return url(Storage::url('images/'.$default));
                           
            }
        );
    }

    public function customer_account()
    {
        return $this->belongsTo(CustomerAccount::class,'id','customer_id');
    }
}
