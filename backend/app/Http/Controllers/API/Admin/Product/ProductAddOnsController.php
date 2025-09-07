<?php

namespace App\Http\Controllers\API\Admin\Product;

use App\Http\Controllers\Controller;
use App\Http\Requests\Addons\StoreAddonsRequest;
use App\Http\Requests\Addons\UpdateAddonsRequest;
use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use Illuminate\Support\Facades\DB;
use App\Services\Admin\Product\ProductAddonService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ProductAddOnsController extends Controller
{
    protected $productAddonService;

    public function __construct(ProductAddonService $productAddonService)
    {
        $this->productAddonService = $productAddonService;
    }

    public function list(Request $request){
        return $this->productAddonService->getAddonList($request);
    }   

    public function archivedList(Request $request){
        return $this->productAddonService->getArchivedList($request);
    }  
    
    public function showDetails(string $addon_id)
    {
         try {
            DB::beginTransaction();

            $addon_id = $this->decrypt_string($addon_id);

            $data = $this->productAddonService->getAddonDetails($addon_id);

            DB::commit();
            
            return $this->returnData($data);

        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->ExceptionHandler($e);
        }
    }

    public function store(StoreAddonsRequest $request)
    {
        try {
            DB::beginTransaction();
         
            $response = $this->productAddonService->createAddon($request->validated());

            DB::commit();
            
            return $this->success($response, _lang_message('created_successfully',['item' => $response->sku]));

        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->ExceptionHandler($e);
        }
    }

    public function update(UpdateAddonsRequest $request, string $addon_id)
    {
         try {
            DB::beginTransaction();

            Log::error($request);

            $addon_id = $this->decrypt_string($addon_id);

            $response = $this->productAddonService->updateAddon($addon_id, $request->validated());

            DB::commit();
            
            return $this->success($response, _lang_message('updated_successfully',['item' => 'Item']));

        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->ExceptionHandler($e);
        }
    }

    public function archive(string $addon_id)
    {
         try {
            DB::beginTransaction();

            $addon_id = $this->decrypt_string($addon_id);

            $response = $this->productAddonService->deleteAddon($addon_id);

            DB::commit();
            
            return $this->success($response, _lang_message('deleted_successfully',['item' => $response]));

        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->ExceptionHandler($e);
        }
    }

    public function restore(string $addon_id)
    {
         try {
            DB::beginTransaction();

            $addon_id = $this->decrypt_string($addon_id);

            $response = $this->productAddonService->restoreAddon($addon_id);

            DB::commit();
            
            return $this->success($response, _lang_message('restored_successfully',['item' => $response]));

        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->ExceptionHandler($e);
        }
    }
}