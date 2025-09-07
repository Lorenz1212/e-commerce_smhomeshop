<?php

namespace App\Http\Controllers\API\Admin\Core;

use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Services\Admin\Core\UserPermissionService;

use App\Http\Requests\Permission\CreatePermissionRequest;
use App\Http\Requests\Permission\UpdatePermissionRequest;


class UserPermissionController extends Controller
{
    protected $userPermissionService;

    public function __construct(UserPermissionService $userPermissionService)
    {
        $this->userPermissionService = $userPermissionService;
    }

    public function store(CreatePermissionRequest $request){
        try {
            DB::beginTransaction();

            $validated = $request->validated();

            $response = $this->userPermissionService->createPermission($validated);

            DB::commit();
            
            return $this->success($response, _lang_message('created_successfully',['item' => 'New Permission']));

        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->ExceptionHandler($e);
        }
    }

    public function update(string $id, UpdatePermissionRequest $request){
        try {
            DB::beginTransaction();

            $validated = $request->validated();

            $id = $this->decrypt_string($id);

            $response = $this->userPermissionService->updatePermission($id, $validated);

            DB::commit();
            
            return $this->success($response, _lang_message('updated_successfully',['item' => $response]));

        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->ExceptionHandler($e);
        }
    }

    public function delete(string $id){
        try {
            DB::beginTransaction();

            $id = $this->decrypt_string($id);

            $response = $this->userPermissionService->deletePermission($id);

            DB::commit();
            
            return $this->success($response, _lang_message('deleted_successfully',['item' => $response]));

        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->ExceptionHandler($e);
        }
    }

    public function change_status(string $id){
        try {
            DB::beginTransaction();
            
            $id = $this->decrypt_string($id);

            $response = $this->userPermissionService->changeStatusPermission($id);

            DB::commit();
            
            return $this->success($response, _lang_message('updated_successfully',['item' => $response]));

        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->ExceptionHandler($e);
        }
    }
}
