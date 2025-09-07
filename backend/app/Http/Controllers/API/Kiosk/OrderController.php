<?php

namespace App\Http\Controllers\API\Kios;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\Feedback\AddToCartRequest;
use App\Http\Requests\Feedback\CheckOutOrderRequest;
use Illuminate\Support\Facades\DB;
use App\Exceptions\ExceptionHandler;
use App\Services\Admin\Order\CustomerOrderService;
use App\Traits\ApiResponse;

class CustomerOrderController extends Controller
{
    use ApiResponse;


    // protected $customerOrderService;

    // public function __construct(CustomerOrderService $customerOrderService)
    // {
    //     $this->customerOrderService = $customerOrderService;
    // }

    // public function addToCart(AddToCartRequest $request)
    // {
    //     try {
    //         DB::beginTransaction();

    //         $response = $this->customerOrderService->addToCart($request->validated());

    //         DB::commit();
            
    //         return $this->success($response, _lang_message('add_to_cart',['item' => $response]));

    //     } catch (\Throwable $e) {
    //         DB::rollBack();
    //         return $this->ExceptionHandler($e);
    //     }
    // }

    // public function checkOutOrder(string $id, CheckOutOrderRequest $request)
    // {
    //     try {
    //         DB::beginTransaction();

    //         $id = $this->decrypt_string($id);

    //         $response = $this->customerOrderService->checkOutOrder($id, $request->validated());

    //         DB::commit();
            
    //         return $this->success($response, _lang_message('check_out',['item' => $response]));

    //     } catch (\Throwable $e) {
    //         DB::rollBack();
    //         return $this->ExceptionHandler($e);
    //     }
    // }

    // public function removeItem(string $id)
    // {
    //     try {
    //         DB::beginTransaction();

    //         $id = $this->decrypt_string($id);

    //         $response = $this->customerOrderService->removeItem($id);

    //         DB::commit();
            
    //         return $this->success($response, _lang_message('remove_item',['item' => $response]));

    //     } catch (\Throwable $e) {
    //         DB::rollBack();
    //         return $this->ExceptionHandler($e);
    //     }
    // }

    // public function changeQuantity(string $id)
    // {
    //     try {
    //         DB::beginTransaction();

    //         $id = $this->decrypt_string($id);

    //         $response = $this->customerOrderService->changeQuantity($id);

    //         DB::commit();
            
    //         return $this->success($response, _lang_message('change_quantity',['item' => $response['product_name'],'quantity'=> $response['quantity']]));

    //     } catch (\Throwable $e) {
    //         DB::rollBack();
    //         return $this->ExceptionHandler($e);
    //     }
    // }
}
