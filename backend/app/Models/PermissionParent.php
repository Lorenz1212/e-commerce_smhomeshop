<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class PermissionParent extends BaseModel
{
    use HasFactory;

    protected $fillable = ['name', 'is_active'];

    public function permissions()
    {
        return $this->hasMany(Permission::class, 'permission_parent_id');
    }
}
