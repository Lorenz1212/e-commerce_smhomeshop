<?php

namespace App\Http\Controllers\API\Website;

use App\Http\Controllers\Controller;
use App\Services\Website\ProductService;
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

    public function getlist(Request $request){
        return $this->productService->getProductList($request);
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
}