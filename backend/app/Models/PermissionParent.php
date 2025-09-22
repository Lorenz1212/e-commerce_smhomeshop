<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class PermissionParent extends BaseModel
{
    use HasFactory,SoftDeletes;

    protected $fillable = ['name', 'is_active'];

    public function permissions()
    {
        return $this->hasMany(Permission::class, 'permission_parent_id');
    }
}
