<?php

namespace App\Http\Controllers\API\Admin\Product;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\Admin\Product\ProductCategoryService;
use App\Http\Requests\Category\StoreProductCategoryRequest;
use App\Http\Requests\Category\UpdateProductCategoryRequest;
use Illuminate\Support\Facades\DB;

class ProductCategoryController extends Controller
{
    protected $productCategoryService;

    public function __construct(ProductCategoryService $productCategoryService)
    {
        $this->productCategoryService = $productCategoryService;
    }

    public function list(Request $request){
        return $this->productCategoryService->getlistCategory($request);
    }

     public function archivedList(Request $request){
        return $this->productCategoryService->getArchivedList($request);
    }

    public function showDetails(string $category_id){

        $category_id = $this->decrypt_string($category_id);

        $data =  $this->productCategoryService->getCategoryDetails($category_id);

        return $this->returnData($data);
    }
    
    public function store(StoreProductCategoryRequest $request){
        try {
            DB::beginTransaction();

            $response = $this->productCategoryService->createCategory($request->validated());

            DB::commit();
            
            return $this->success(false, _lang_message('created_successfully',['item' => 'Category']));

        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->ExceptionHandler($e);
        }
    }

    public function update(string $category_id, UpdateProductCategoryRequest $request){
        try {
            DB::beginTransaction();

            $category_id = $this->decrypt_string($category_id);

            $response = $this->productCategoryService->updateCategory($category_id, $request->validated());

            DB::commit();
            
            return $this->success(false, _lang_message('updated_successfully',['item' => 'Category']));

        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->ExceptionHandler($e);
        }
    }

    public function delete(string $category_id){
        try {
            DB::beginTransaction();

            $category_id = $this->decrypt_string($category_id);

            $response = $this->productCategoryService->deleteCategory($category_id);

            DB::commit();
            
            return $this->success(false, _lang_message('deleted_successfully',['item' => $response]));

        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->ExceptionHandler($e);
        }
    }

    public function restore(string $category_id){
        try {
            DB::beginTransaction();

            $category_id = $this->decrypt_string($category_id);

            $response = $this->productCategoryService->restoreCategory($category_id);

            DB::commit();
            
            return $this->success(false, _lang_message('restored_successfully',['item' => $response]));

        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->ExceptionHandler($e);
        }
    }
}
