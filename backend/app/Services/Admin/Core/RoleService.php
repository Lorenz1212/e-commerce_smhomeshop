<?php

namespace App\Services\Admin\Core;

use App\Helpers\DTServerSide;
use App\Models\Permission;
use App\Models\Role;

class RoleService
{
    public function getRoleList($request){

        $query = Role::with('permissions.parent')->whereNotIn('name',['cashier','core']);

        $normalFields = ['name', 'created_at']; 
        
        $sortableColumns = [
            'id'         => 'id',
            'created_at' => 'created_at',
            'name'       => 'name'
        ];

        $response = (new DTServerSide($request, $query, $normalFields, $sortableColumns))->renderTable();

        return response()->json($this->getPermissionParents($response));
    }

    public function getArchivedList($request)
    {
        $data = Role::onlyTrashed()->with('permissions.parent')->whereNotIn('name',['cashier','core']);

        $normalFields = ['name','created_at']; 
        
        $sortableColumns = [
            'row_number' => 'row_number',
            'id'         => 'id',
            'created_at' => 'created_at',
            'name'       => 'name'
        ];

        $response =  (new DTServerSide($request, $data, $normalFields, $sortableColumns))->renderTable();

        return response()->json($this->getPermissionParents($response));
    }

    private function getPermissionParents($response){
       
        $result = $response ->getData(true);

        $result['data'] = collect($result['data'])->map(function ($role) {
            $grouped = collect($role['permissions'])->groupBy('parent.id')->map(function ($perms, $parentId) {
                $parent = $perms->first()['parent'];
                return [
                    'id' => $parent['id'],
                    'name' => $parent['name'],
                    'permissions' => collect($perms)->map(function ($perm) {
                        return [
                            'id' => $perm['id'],
                            'name' => $perm['name'],
                            'description' => $perm['description'],
                        ];
                    })->values(),
                ];
            })->values();

            return [
                'row_number'=>$role['row_number'],
                'id_encrypted' => $role['id_encrypted'],
                'name' => $role['name'],
                'permissionParents' => $grouped,
            ];
        });

        return $result;
    }

    public function getRoleDetails($role_id)
    {
        $role = Role::with(['permissions.parent:id,name']) 
            ->findOrFail($role_id);

        $grouped = $role->permissions
            ->groupBy(fn($perm) => $perm->parent->name ?? 'Others')
            ->map(fn($perms, $groupName) => [
                'id' => $perms->first()->parent->id ?? 0,
                'name' => $groupName,
                'permissions' => $perms->map(fn($p) => [
                    'id' => $p->id,
                    'name' => $p->description,
                ])->values(),
            ])
            ->values();

        return [
            'name' => $role->name,
            'permissions' => $grouped,
        ];
    }

   public function createRole(array $data){

        $role = Role::create(['name' => $data['name']]);

        if (!empty($data['permissions'])) {
            $permissions = Permission::whereIn('id', $data['permissions'])->get();
            $role->syncPermissions($permissions);
        }
    
        return $role->name;
   }

    public function updateRole(int $role_id, array $data)
    {
        $role = Role::findOrFail($role_id);

        $hasChanges = false;

        // check if name changed
        if ($role->name !== $data['name']) {
            $role->name = $data['name'];
            $hasChanges = true;
        }

        // check if permissions changed
        $oldPermissions = $role->permissions->pluck('id')->sort()->values()->toArray();
        $newPermissions = collect($data['permissions'] ?? [])->sort()->values()->toArray();

        if ($oldPermissions !== $newPermissions) {
            $role->syncPermissions($newPermissions);
            $hasChanges = true;
        }

        if ($hasChanges) {
            $role->save();
        }

        return $hasChanges;
    }


    public function archiveRole($role_id)
    {
        $role = Role::findorFail($role_id)->delete();

        return $role;
    }

    public function restoreRole($product_id)
    {
        $role = Role::withTrashed()->findorFail($product_id);
        if ($role->trashed()) {
             $role->restore();
        }

        return $role->name;
    }
}
