<?php

namespace App\Models;

use App\Notifications\CustomerCreatedNotification;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use ProtoneMedia\LaravelVerifyNewEmail\MustVerifyNewEmail;
use Devaslanphp\FilamentAvatar\Core\HasAvatarUrl;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;


class CustomerAccount extends Authenticatable
{
    use HasRoles, HasApiTokens, HasFactory, Notifiable, MustVerifyNewEmail, SoftDeletes, HasAvatarUrl, SoftDeletes;

    protected $guard_name = 'customer';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'customer_id',
        'email',
        'password',
        'creation_token',
        'email_verified_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
            'id',
            'customer_id',
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

        static::creating(function (CustomerAccount $item) {
            $item->creation_token = Str::uuid()->toString();
        });

        static::created(function (CustomerAccount $item) {
            $item->notify(new CustomerCreatedNotification($item));
        });
    }

    public function customer() {
        return $this->hasOne(Customer::class,'id','customer_id');
    }

}
