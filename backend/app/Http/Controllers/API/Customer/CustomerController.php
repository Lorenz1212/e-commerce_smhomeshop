<?php

namespace App\Http\Controllers\API\Customer;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

use App\Services\Customer\OrderService;
use App\Services\Customer\ProductService;

class CustomerController extends Controller
{
    protected $productService;

    protected $orderService;


    public function __construct(
        ProductService $productService, 
        OrderService $orderService,
    ){
        $this->productService = $productService;
        $this->orderService = $orderService;
    }

    public function productBestSellerList()
    {
        try {
            DB::beginTransaction();

            $response = $this->productService->getProductBestSellerList();

            DB::commit();
            
            return $this->returnData($response);

        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->ExceptionHandler($e);
        }
    }

    public function productCategoriesList()
    {
        try {
            DB::beginTransaction();

            $response = $this->productService->getProductCategoriesList();

            DB::commit();
            
            return $this->returnData($response);

        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->ExceptionHandler($e);
        }
    }

    public function productList(string $category_id)
    {
        try {
            DB::beginTransaction();

            $category_id = $this->decrypt_string($category_id);

            $response = $this->productService->getProductList($category_id);

            DB::commit();
            
            return $this->returnData($response);

        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->ExceptionHandler($e);
        }
    }

    public function productDetails(string $product_id)
    {
        try {
            DB::beginTransaction();

            $product_id = $this->decrypt_string($product_id);

            $response = $this->productService->getProductDetails($product_id);

            DB::commit();
            
           return $this->returnData($response);

        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->ExceptionHandler($e);
        }
    }

    public function productAddons(string $product_id)
    {
        try {
            DB::beginTransaction();

            $product_id = $this->decrypt_string($product_id);

            $response = $this->productService->getProductAddons($product_id);

            DB::commit();
            
           return $this->returnData($response);

        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->ExceptionHandler($e);
        }
    }

    public function cartList()
    {
        try {
            DB::beginTransaction();

            $response = $this->orderService->getCartList();

            DB::commit();
            
            return $this->returnData($response);

        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->ExceptionHandler($e);
        }
    }

    public function cartCount()
    {
        try {
            DB::beginTransaction();

            $response = $this->orderService->getCartCount();

            DB::commit();
            
            return $this->returnData($response);

        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->ExceptionHandler($e);
        }
    }

    public function cartStore(Request $request)
    {
        try {
            DB::beginTransaction();

            $request['product_id'] = $this->decrypt_string($request->product_id);

            $response = $this->orderService->cartStore($request);

            DB::commit();
            
            return $this->success($response, _lang_message('add_to_cart',['item' => $response]));

        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->ExceptionHandler($e);
        }
    }

    public function cartUpdate(Request $request, string $cart_id)
    {
        try {
            DB::beginTransaction();

            $request['cart_id'] = $this->decrypt_string($cart_id);

            $response = $this->orderService->cartUpdate($request);

            DB::commit();

            return $response;
            
            return $this->success($response, _lang_message('updated_successfully',['item' => $response]));

        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->ExceptionHandler($e);
        }
    }

    public function cartDelete(string $cart_id)
    {
        try {
            DB::beginTransaction();

            $cart_id = $this->decrypt_string($cart_id);

            $response = $this->orderService->cartDelete($cart_id);

            DB::commit();
            
            return $this->returnData($response);

        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->ExceptionHandler($e);
        }
    }

    public function orderList()
    {
        try {
            DB::beginTransaction();

            $response = $this->orderService->getOrderList();

            DB::commit();
            
            return $this->returnData($response);

        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->ExceptionHandler($e);
        }
    }

    public function orderCheckout(Request $request)
    {
        try {
            DB::beginTransaction();

            $response = $this->orderService->orderCheckout($request);

            DB::commit();
            
             return $this->returnData($response);

        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->ExceptionHandler($e);
        }
    }

    public function orderQueue()
    {
        try {
            DB::beginTransaction();

            $response = $this->orderService->getOrderQueue();

            DB::commit();
            
            return $this->returnData($response);

        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->ExceptionHandler($e);
        }
    }

    public function orderFeedback(string $order_id,Request $request)
    {
        try {
            DB::beginTransaction();

            $order_id = $this->decrypt_string($order_id);

            $response = $this->orderService->OrderFeedback($request,$order_id);

            DB::commit();
            
             return $this->success(false, _lang_message('feedback',['item' => $response]));

        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->ExceptionHandler($e);
        }
    }
}
