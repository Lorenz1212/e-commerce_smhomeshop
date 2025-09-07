<?php

namespace App\Models;

use App\Notifications\UserCreatedNotification;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use App\Traits\Encryption;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use Ramsey\Uuid\Uuid;
use ProtoneMedia\LaravelVerifyNewEmail\MustVerifyNewEmail;
use Devaslanphp\FilamentAvatar\Core\HasAvatarUrl;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Hash;

class User extends Authenticatable
{
    use HasRoles, HasApiTokens, HasFactory, Notifiable, MustVerifyNewEmail, SoftDeletes, HasAvatarUrl, SoftDeletes, Encryption;
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'email',
        'password',
        'creation_token',
        'email_verified_at',
    ];

    protected $appends = [
        'id_encrypted'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'id',
        'user_id',
        'password',
        'remember_token',
        'email_verified_at',
        'created_at',
        'creation_token',
        'deleted_at',
        'is_blocked',
        'updated_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public static function boot()
    {
        parent::boot();

        static::creating(function (User $item) {
            $item->password = Hash::make(uniqid());
            $item->creation_token = Uuid::uuid4()->toString();
        });
    }

    public function idEncrypted() : Attribute
    {
        return Attribute::make(
            set: fn () => $this->decrypt_string($this->id),
            get: fn () => $this->encrypt_string($this->id)
        );
    }

    public function user_info() {
        return $this->hasOne(UserPersonalInfo::class,'id','user_id');
    }

}
