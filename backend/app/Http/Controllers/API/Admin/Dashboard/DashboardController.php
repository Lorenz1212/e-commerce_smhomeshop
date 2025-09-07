<?php

namespace App\Http\Controllers\API\Admin\Dashboard;

use App\Http\Controllers\Controller;
use App\Services\Admin\Dashboard\DashboardService;
use Illuminate\Http\Request;


class DashboardController extends Controller
{
    protected $dashboardService;

    public function __construct(DashboardService $dashboardService){

        $this->dashboardService = $dashboardService;
    }

    public function customerCount(Request $request){

        $response =  $this->dashboardService->getCustomerCount($request);

        return $this->returnData($response);
    }

    public function productCount(Request $request){

        $response = $this->dashboardService->getProductCount($request);

        return $this->returnData($response);
    }

    public function productStocksTable(Request $request){

        $response =  $this->dashboardService->getProductStocks($request);

        return $this->returnData(['data'=> $response]);
    }

    public function forcastingSales(Request $request)
    {
        $response = $this->dashboardService->getForcastingSales($request);

        return $this->returnData($response);
    }

    public function sentimentCountsAndStatus(Request $request){

        $response = $this->dashboardService->getSentimentCountsAndStatus($request);

        return $this->returnData($response);
    }

    public function feedbackStats(Request $request){

        $response = $this->dashboardService->getFeedbackStats($request);

        return $this->returnData($response);
    }

    public function feedbackOvertime(Request $request){

        $data = $this->dashboardService->getFeedbackOvertime($request);

        return $this->returnData($data);
    }

    public function recentFeedback(Request $request){

        $data = $this->dashboardService->getRecentFeedback($request);

        return $this->returnData($data);
    }

    
}
