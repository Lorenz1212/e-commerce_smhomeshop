<?php 
namespace App\Models;

use Spatie\Permission\Models\Permission as SpatiePermission;

class Permission extends SpatiePermission
{
    protected $fillable = ['permission_parent_id', 'name', 'description', 'guard_name'];

    public function parent()
    {
        return $this->belongsTo(PermissionParent::class, 'permission_parent_id');
    }
}
