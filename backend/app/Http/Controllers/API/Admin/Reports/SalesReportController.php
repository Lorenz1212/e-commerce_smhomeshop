<?php

namespace App\Http\Controllers\API\Admin\Reports;

use App\Http\Controllers\Controller;
use App\Services\Admin\Reports\SalesService;
use Illuminate\Http\Request;

class SalesReportController extends Controller
{
    protected $salesService;

    public function __construct(SalesService $salesService)
    {
        $this->salesService = $salesService;
    }

    public function onlineOrderReports(Request $request)
    {
        $data = $this->salesService->getOnlineOrderList(
            $request,
            $request->extra_filter['start_date'],
            $request->extra_filter['end_date']
        );

        return  $data;
    }

    public function walkinOrderReports(Request $request)
    {
        $data = $this->salesService->getWalkinOrderList(
            $request,
            $request->extra_filter['start_date'],
            $request->extra_filter['end_date']
        );

        return $data;
    }

    public function summary(Request $request)
    {
        $data = $this->salesService->getSummaryReport(
            $request->period ?? 'monthly',
            $request->start_date,
            $request->end_date,
            $request->channel
        );

         return $this->returnData($data);
    }
}
