<?php

namespace App\Http\Controllers\API\Admin\Product;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\Admin\Product\ProductBrandService;
use App\Http\Requests\Category\StoreProductCategoryRequest;
use App\Http\Requests\Category\UpdateProductCategoryRequest;
use Illuminate\Support\Facades\DB;

class ProductBrandController extends Controller
{
    protected $productBrandService;

    public function __construct(ProductBrandService $productBrandService){
        $this->productBrandService = $productBrandService;
    }

    public function list(Request $request){
        return $this->productBrandService->getListBrand($request);
    }

     public function archivedList(Request $request){
        return $this->productBrandService->getArchivedList($request);
    }

    public function showDetails(string $category_id){

        $category_id = $this->decrypt_string($category_id);

        $data =  $this->productBrandService->getBrandDetails($category_id);

        return $this->returnData($data);
    }
    
    public function store(StoreProductCategoryRequest $request){
        try {
            DB::beginTransaction();

            $response = $this->productBrandService->createBrand($request->validated());

            DB::commit();
            
            return $this->success(false, _lang_message('created_successfully',['item' => 'Product Brand']));

        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->ExceptionHandler($e);
        }
    }

    public function update(string $brand_id, UpdateProductCategoryRequest $request){
        try {
            DB::beginTransaction();

            $brand_id = $this->decrypt_string($brand_id);

            $response = $this->productBrandService->updateBrand($brand_id, $request->validated());

            DB::commit();
            
            return $this->success(false, _lang_message('updated_successfully',['item' => 'Product Brand']));

        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->ExceptionHandler($e);
        }
    }

    public function delete(string $brand_id){
        try {
            DB::beginTransaction();

            $brand_id = $this->decrypt_string($brand_id);

            $response = $this->productBrandService->deleteBrand($brand_id);

            DB::commit();
            
            return $this->success(false, _lang_message('deleted_successfully',['item' => $response]));

        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->ExceptionHandler($e);
        }
    }

    public function restore(string $brand_id){
        try {
            DB::beginTransaction();

            $brand_id = $this->decrypt_string($brand_id);

            $response = $this->productBrandService->restoreBrand($brand_id);

            DB::commit();
            
            return $this->success(false, _lang_message('restored_successfully',['item' => $response]));

        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->ExceptionHandler($e);
        }
    }
}
