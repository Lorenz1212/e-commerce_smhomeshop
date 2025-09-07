<?php

namespace App\Http\Controllers\API\Admin\Transactions;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Services\Admin\Transactions\WalkinOrderService;

class WalkinOrderController extends Controller
{
    protected $walkinOrderService;

    public function __construct(WalkinOrderService $walkinOrderService)
    {
        $this->walkinOrderService = $walkinOrderService;
    }

    public function list(Request $request){

        return $this->walkinOrderService->getOrderList($request);
    }

    public function OrderDetails(string $order_id){

        $order_id = $this->decrypt_string($order_id);

        return $this->walkinOrderService->getOrderDetails($order_id);
    }
}
