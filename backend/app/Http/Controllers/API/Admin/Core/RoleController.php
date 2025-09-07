<?php

namespace App\Http\Controllers\API\Admin\Core;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\HttpException;
use App\Http\Controllers\Controller;
use App\Exceptions\ExceptionHandler;
use App\Traits\ApiResponse;
use App\Traits\Encryption;
use App\Http\Requests\Role\StoreRoleRequest;
use App\Http\Requests\Role\UpdateRoleRequest;
use App\Services\Admin\Core\RoleService;


class RoleController extends Controller
{
    use ApiResponse, Encryption;

    protected $roleService;

    public function __construct(RoleService $roleService)
    {
        $this->roleService = $roleService;
    }

    public function roleList(Request $request){

        return $this->roleService->getRoleList($request);
    }

    public function archivedList(Request $request){

        return $this->roleService->getArchivedList($request);
    }  

    public function showDetails(string $role_id){

        $role_id = $this->decrypt_string($role_id);

        $data = $this->roleService->getRoleDetails($role_id);

        return $this->returnData($data);
    }
    
    public function store(StoreRoleRequest $request){
        try {
            DB::beginTransaction();

            $response = $this->roleService->createRole($request->validated());

            DB::commit();
            
            return $this->success($response, _lang_message('created_successfully',['item' => $response]));

        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->ExceptionHandler($e);
        }
    }

    public function update(string $role_id, UpdateRoleRequest $request){
        try {
            DB::beginTransaction();

            $role_id = $this->decrypt_string($role_id);

            $response = $this->roleService->updateRole($role_id, $request->validated());

            DB::commit();
            
            return $this->success($response, _lang_message(($response)?'updated_successfully':'nothing_changes',['item' => 'Role']));

        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->ExceptionHandler($e);
        }
    }

    public function archive(string $role_id){
        try {
            DB::beginTransaction();

            $role_id = $this->decrypt_string($role_id);

            $response = $this->roleService->archiveRole($role_id);

            DB::commit();
            
            return $this->success($response, _lang_message('deleted_successfully',['item' => $response]));

        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->ExceptionHandler($e);
        }
    }

    
    public function restore($role_id){
         try {
            DB::beginTransaction();
            $role_id = $this->decrypt_string($role_id);

            $response = $this->roleService->restoreRole($role_id);

            DB::commit();

            return $this->success($response, _lang_message('restored_successfully',['item' => $response]));
         } catch (\Throwable $e) {
            DB::rollBack();
            return $this->ExceptionHandler($e);
        }
    }
}
