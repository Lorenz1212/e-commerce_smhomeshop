<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Casts\Attribute;
use App\Traits\Encryption;
use Illuminate\Database\Eloquent\SoftDeletes;

use Spatie\Permission\Models\Role as SpatieRole;

class Role extends SpatieRole
{
    use HasFactory, Encryption, SoftDeletes;

    protected $fillable = ['name', 'guard_name'];

    protected $appends = [
        'id_encrypted',
        'row_number',
        'created_at_format',
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

    protected function CreatedAtFormat(): Attribute
    {
        return Attribute::make(
            get: function () {
                return $this->created_at ? Carbon::parse($this->created_at)->format('F d, Y h:i A') : NULL;
            }
        );
    }

    public function permissionParents()
    {
        return PermissionParent::whereIn(
            'id',
            $this->permissions->pluck('permission_parent_id')
        )->with('permissions')->get();
    }
}
