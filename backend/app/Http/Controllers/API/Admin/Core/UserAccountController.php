<?php

namespace App\Http\Controllers\API\Admin\Core;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use App\Traits\Encryption;
use App\Services\Admin\Core\UserAccountService;

use App\Http\Requests\UserAccount\StoreUserAccountRequest;
use App\Http\Requests\UserAccount\UpdateUserAccountRequest;

class UserAccountController extends Controller
{
    use ApiResponse, Encryption;

    protected $userAccountService;

    public function __construct(UserAccountService $userAccountService)
    {
        $this->userAccountService = $userAccountService;
    }

    public function list(Request $request){

        return $this->userAccountService->getUserAccountList($request);
    }

    public function archivedList(Request $request){

        return $this->userAccountService->getArchivedList($request);
    }

    public function showDetails(string $user_id){

        $user_id = $this->decrypt_string($user_id);

        $data = $this->userAccountService->getUserAccountDetails($user_id);

        return $this->returnData($data);
    }
    
    public function store(StoreUserAccountRequest $request){
        try {
            DB::beginTransaction();

            $response = $this->userAccountService->createUserAccount($request->validated());

            DB::commit();
            
            return $this->success($response, _lang_message('created_successfully',['item' => $response]));

        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->ExceptionHandler($e);
        }
    }

    public function update(string $user_id, UpdateUserAccountRequest $request){
        try {
            DB::beginTransaction();

            $user_id = $this->decrypt_string($user_id);

            $response = $this->userAccountService->updateUserAccount($user_id, $request->validated());

            DB::commit();
            
            return $this->success($response, _lang_message('updated_successfully',['item' => $response]));

        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->ExceptionHandler($e);
        }
    }

    public function archive(string $user_id){
        try {
            DB::beginTransaction();

            $user_id = $this->decrypt_string($user_id);

            $response = $this->userAccountService->archiveUserAccount($user_id);

            DB::commit();
            
            return $this->success($response, _lang_message('deleted_successfully',['item' => $response]));

        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->ExceptionHandler($e);
        }
    }
    
    public function restore(string $user_id){
        $user_id = $this->decrypt_string($user_id);

        $response = $this->userAccountService->restoreUserAccount($user_id);

        return $this->success($response, _lang_message('restored_successfully',['item' => $response]));
    }

    public function reset(string $user_id){
        
        $user_id = $this->decrypt_string($user_id);

        $response = $this->userAccountService->resetUserPassword($user_id);

        return $this->success($response, _lang_message('password_reset',['item' => $response]));
    }
}
