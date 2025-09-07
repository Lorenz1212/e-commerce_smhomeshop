<?php

namespace App\Http\Controllers\API\Admin\Core;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Requests\Feedback\StoreApiCredentialRequest;
use App\Http\Requests\Feedback\UpdateApiCredentialRequest;
use App\Services\Admin\Core\ApiCredentialService;


class ApiCredetialController extends Controller
{
    // protected $apiCredentialService;

    // public function __construct(ApiCredentialService $apiCredentialService)
    // {
    //     $this->apiCredentialService = $apiCredentialService;
    // }
    
    // public function list($request){
    //     return $this->apiCredentialService->getlistApiCredential($request);
    // }

    // public function showDetails(string $api_id){

    //     $api_id = $this->decrypt_string($api_id);

    //     $data = $this->apiCredentialService->getApiCredentialDetails($api_id);

    //     return $this->returnData($data);
    // }
    
    // public function store(StoreApiCredentialRequest $request){
    //     try {
    //         DB::beginTransaction();

    //         $response = $this->apiCredentialService->createApiCredential($request->validated());

    //         DB::commit();
            
    //         return $this->success($response, _lang_message('created_successfully',['item' => $response]));

    //     } catch (\Throwable $e) {
    //         DB::rollBack();
    //         return $this->ExceptionHandler($e);
    //     }
    // }

    // public function update(string $api_id, UpdateApiCredentialRequest $request){
    //     try {
    //         DB::beginTransaction();

    //         $api_id = $this->decrypt_string($api_id);

    //         $response = $this->apiCredentialService->updateApiCredential($api_id, $request->validated());

    //         DB::commit();
            
    //         return $this->success($response, _lang_message('updated_successfully',['item' => $response]));

    //     } catch (\Throwable $e) {
    //         DB::rollBack();
    //         return $this->ExceptionHandler($e);
    //     }
    // }

    // public function delete(string $api_id){
    //     try {
    //         DB::beginTransaction();

    //         $api_id = $this->decrypt_string($api_id);

    //         $response = $this->apiCredentialService->deleteApiCredential($api_id);

    //         DB::commit();
            
    //         return $this->success($response, _lang_message('deleted_successfully',['item' => $response]));

    //     } catch (\Throwable $e) {
    //         DB::rollBack();
    //         return $this->ExceptionHandler($e);
    //     }
    // }

    
    // public function restore($api_id){
    //     $api_id = $this->decrypt_string($api_id);

    //     $response = $this->apiCredentialService->restoreApiCredential($api_id);

    //     return $this->success($response, _lang_message('restored_successfully',['item' => $response]));
    // }
}
