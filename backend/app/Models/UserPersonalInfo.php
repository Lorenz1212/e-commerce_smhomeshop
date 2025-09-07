<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Facades\Storage;
use App\Traits\Encryption;
use Carbon\Carbon;

class UserPersonalInfo extends BaseModel
{
    use HasFactory, Encryption, SoftDeletes;

    protected $fillable = [
        'fname',
        'lname',
        'mname',
        'suffix',
        'gender',
        'contact_no',
        'birthdate',
        'age',
        'address',
        'image',
    ];

    protected $hidden = [
        'id',
        'fname',
        'lname',
        'mname',
        'suffix',
        'birthdate',
        'age',
        'gender',
        'barangay',
        'province',
        'region',
        'city',
        'image',
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    protected $appends = [
        'id_encrypted',
        'full_name',
        'gender_text_format',
        'birth_date_format',
        'image_cover',
        'row_number'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->account_no = self::generateNumber();
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
                
                return  ($fname? ucfirst($fname):'') . ' ' . $minitial . ' '. ($lname? ucfirst($lname):'').' '. ($suffix ? ucfirst($suffix):'');
            }
        );
    }

    protected function genderTextFormat(): Attribute
    {
        return Attribute::make(
            get: function () {
                return $this->gender && isset(c('GENDER_TEXT_FORMAT')[$this->gender])
                    ? c('GENDER_TEXT_FORMAT')[$this->gender]
                    : null;
            }
        );
    }

    protected function birthDateFormat(): Attribute
    {
        return Attribute::make(
            get: function () {
                return $this->birthdate ? Carbon::parse($this->birthdate)->format('F d, Y') : NULL;
            }
        );
    }

    protected function imageCover(): Attribute
    {
        return Attribute::make(
            get: function () {
                $path = 'images/profiles/'.$this->image;
                if ($this->image && Storage::disk('public')->exists($path)) {
                    // Get the full URL to the image file
                    return url(Storage::url('images/profiles/'.$this->image));
                }
                // Default image based on gender
                $default = c('AVATAR_DEFAULT')[$this->gender];
                
                // Return the full URL to the default image
                return url(Storage::url('images/'.$default));
                           
            }
        );
    }

    public function user()
    {
        return $this->belongsTo(User::class,'id','user_id');
    }
}
