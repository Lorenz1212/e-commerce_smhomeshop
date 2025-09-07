<?php

namespace App\Http\Controllers\API\Cashier;

use App\Http\Controllers\Controller;
use App\Services\Cashier\OrderService;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class OrderController extends Controller
{
    protected $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    public function categoryList(Request $request){

        $response = $this->orderService->getCategoryList($request);

        return $this->returnData($response);
    }   

    public function productList(string $category_id){
        
        $category_id = $this->decrypt_string($category_id);

        $response = $this->orderService->getProductList($category_id);

        return $this->returnData($response);
    }   

    public function onlineOrderList()
    {
        $response = $this->orderService->getOnlineOrderList();

        return $this->returnData($response);
    }

    public function onlineOrdersItem(string $order_id)
    {
        $order_id = $this->decrypt_string($order_id);

        $response = $this->orderService->getOnlineOrdersItem($order_id);

        return $this->returnData($response);
    }

    public function generateOrderNo()
    {
        $response = $this->orderService->generateOrderNo();

        return $this->returnData($response);
    }

    public function processOrder(Request $request)
    {
        try {
            DB::beginTransaction();

            $order_id = ($request->order_id)?$this->decrypt_string($request->order_id):null;

            $response = $this->orderService->processOrder($request,$order_id);

            DB::commit();
            
            return $this->returnData($response);

        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->ExceptionHandler($e);
        }
    }

    public function queueOrder()
    {
        try {
            DB::beginTransaction();

            $response = $this->orderService->QueueOrder();

            DB::commit();
            
            return $this->returnData($response);

        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->ExceptionHandler($e);
        }
    }

    public function queueOrderCount()
    {
        try {
            DB::beginTransaction();

            $response = $this->orderService->QueueOrderCount();

            DB::commit();
            
            return $this->returnData($response);

        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->ExceptionHandler($e);
        }
    }

    public function updateQueueOrder(Request $request, $id)
    {
        try {
            DB::beginTransaction();

            $data = $request->validate([
                'status' => ['required', Rule::in(['READY','SERVED'])],
                'source' => ['nullable', Rule::in(['ONLINE','POS'])],
            ]);

            $id = $this->decrypt_string($id);

            $response = $this->orderService->updateQueueOrder($data,$id);

            DB::commit();
            
            return $this->returnData($response);

        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->ExceptionHandler($e);
        }
    }

}