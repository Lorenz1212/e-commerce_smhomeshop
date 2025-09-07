<?php

namespace App\Http\Controllers\API\Admin\Product;

use App\Http\Controllers\Controller;
use App\Services\Admin\Product\ProductService;
use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    protected $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    public function list(Request $request){
        return $this->productService->getProductList($request);
    } 
    
    public function archivedList(Request $request){
        return $this->productService->getArchivedList($request);
    } 
    
    public function showDetails(string $product_id)
    {
         try {
            DB::beginTransaction();

            $product_id = $this->decrypt_string($product_id);

            $data = $this->productService->getProductDetails($product_id);

            DB::commit();
            
            return $this->returnData($data);

        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->ExceptionHandler($e);
        }
    }

    public function store(StoreProductRequest $request)
    {
        try {
            DB::beginTransaction();
         
            $response = $this->productService->createProduct($request->validated());

            DB::commit();
            
            return $this->success($response, _lang_message('created_successfully',['item' => $response->sku]));

        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->ExceptionHandler($e);
        }
    }

    public function update(UpdateProductRequest $request, string $product_id)
    {
         try {
            DB::beginTransaction();

            $product_id = $this->decrypt_string($product_id);

            $response = $this->productService->updateProduct($product_id, $request->validated());

            DB::commit();
            
            return $this->success($response, _lang_message('updated_successfully',['item' => 'Item']));

        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->ExceptionHandler($e);
        }
    }

    public function archive(string $product_id)
    {
         try {
            DB::beginTransaction();

            $product_id = $this->decrypt_string($product_id);

            $response = $this->productService->archiveProduct($product_id);

            DB::commit();
            
            return $this->success($response, _lang_message('deleted_successfully',['item' => $response]));

        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->ExceptionHandler($e);
        }
    }

    public function restore(string $product_id)
    {
         try {
            DB::beginTransaction();

            $product_id = $this->decrypt_string($product_id);

            $response = $this->productService->restoreProduct($product_id);

            DB::commit();
            
            return $this->success($response, _lang_message('restored_successfully',['item' => $response]));

        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->ExceptionHandler($e);
        }
    }
}