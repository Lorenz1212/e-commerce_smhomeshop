<?php

namespace App\Http\Controllers\API\Admin\Transactions;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Services\Admin\Transactions\OnlineOrderService;

class OnlineOrderController extends Controller
{
    protected $onlineOrderService;

    public function __construct(OnlineOrderService $onlineOrderService)
    {
        $this->onlineOrderService = $onlineOrderService;
    }

    public function list(Request $request){

        return $this->onlineOrderService->getOrderList($request);
    }

    public function OrderDetails(string $order_id){

        $order_id = $this->decrypt_string($order_id);

        $response = $this->onlineOrderService->getOrderDetails($order_id);

        return $this->returnData($response);
    }
}
