<?php

namespace App\Http\Controllers\API\Admin\Reports;

use App\Http\Controllers\Controller;
use App\Services\Admin\Reports\InventoryMovementService;
use Illuminate\Http\Request;

class InventoryReportController extends Controller
{
    protected $inventoryService;

    public function __construct(InventoryMovementService $inventoryService)
    {
        $this->inventoryService = $inventoryService;
    }

    public function reports(Request $request)
    {
        $data = $this->inventoryService->getReports(
            $request,
            $request->extra_filter['start_date'],
            $request->extra_filter['end_date']
        );

        return $data;
    }

    public function summary(Request $request)
    {
        $data = $this->inventoryService->getSummaryReport(
            $request->period ?? 'monthly',
            $request->start_date,
            $request->end_date
        );

         return $this->returnData($data);
    }
}
