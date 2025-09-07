<?php

namespace App\Services\Admin\Reports;

use App\Helpers\DTServerSide;
use App\Models\InventoryMovement;
use Carbon\Carbon;

class InventoryMovementService
{
    public function getReports($request,$startDate = null, $endDate = null)
    {
        $data = InventoryMovement::with(['product', 'supplier']);

        if ($startDate && $endDate) {
            $data->whereBetween('created_at', [
                Carbon::parse($startDate)->startOfDay(),
                Carbon::parse($endDate)->endOfDay()
            ]);
        }

        $data->orderBy('created_at', 'desc');

        $normalFields = ['product.name', 'supplier.name','quantity', 'created_at_format']; 
        
        $sortableColumns = [
            'id'            => 'id',
            'created_at_format'    => 'created_at_format',
            'product_name'  => 'product.name',
            'supplier_name' => 'supplier.name',
            'quantity'      => 'quantity',
        ];

        return (new DTServerSide($request, $data, $normalFields, $sortableColumns))->renderTable();
    }

    /**
     * Summary Report grouped by period (daily, monthly, yearly) + optional date range
     */
    public function getSummaryReport($period = 'monthly', $startDate = null, $endDate = null)
    {
        $dateFormat = match ($period) {
            'daily' => '%Y-%m-%d',
            'monthly' => '%Y-%m',
            'yearly' => '%Y',
            default => '%Y-%m-%d',
        };
 
        $query = InventoryMovement::with('product')
            ->selectRaw("product_id, movement_type, DATE_FORMAT(created_at, '{$dateFormat}') as period, SUM(quantity) as total_quantity");
        
        if ($startDate && $endDate) {
            $query->whereBetween('created_at', [
                $startDate,
                $endDate
            ]);
        }

        return $query->groupBy('product_id', 'movement_type', 'period')
            ->orderBy('period', 'asc')
            ->get()
            ->groupBy('period')
            ->map(function($rows, $period) {
                return [
                    'period' => $period,
                    'in' => $rows->where('movement_type','IN')->sum('total_quantity'),
                    'out' => $rows->where('movement_type','OUT')->sum('total_quantity'),
                ];
            })
            ->values();
    }
}
