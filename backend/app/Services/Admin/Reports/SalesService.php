<?php

namespace App\Services\Admin\Reports;

use App\Helpers\DTServerSide;
use App\Models\InventoryMovement;
use App\Models\OnlineOrder;
use App\Models\PosTransaction;
use Carbon\Carbon;

class SalesService
{
    public function getOnlineOrderList($request,$startDate = null, $endDate = null)
    {
        $data = OnlineOrder::with('customer');

        if ($startDate && $endDate) {
            $data->whereBetween('order_date', [
                Carbon::parse($startDate)->startOfDay(),
                Carbon::parse($endDate)->endOfDay()
            ]);
        }

        $data->where('status', c('ORDER_SERVED'))->orderBy('order_date', 'desc');

        $normalFields = ['order_no', 'order_date', 'request_type', 'total_amount', 'customer.full_name']; 
        
        $sortableColumns = [
            'row_number'    => 'row_number',
            'id'            => 'id',
            'created_at'    => 'created_at',
            'order_date'    => 'order_date',
            'request_type'  => 'request_type',
            'total_amount'  => 'total_amount',
        ];

        return (new DTServerSide($request, $data, $normalFields, $sortableColumns))->renderTable();
    }

    public function getWalkinOrderList($request, $startDate = null, $endDate = null)
    {
        $data = PosTransaction::query();

        if ($startDate && $endDate) {
            $data->whereBetween('transaction_datetime', [
                Carbon::parse($startDate)->startOfDay(),
                Carbon::parse($endDate)->endOfDay()
            ]);
        }

        $data->where('status', c('POS_SERVED'))->orderBy('transaction_datetime', 'desc');

        $normalFields = ['order_no', 'transaction_datetime', 'request_type', 'total_amount']; 
        
        $sortableColumns = [
            'row_number'    => 'row_number',
            'id'            => 'id',
            'created_at'    => 'created_at',
            'transaction_datetime' => 'transaction_datetime',
            'request_type'  => 'request_type',
            'total_amount'  => 'total_amount',
        ];

        return (new DTServerSide($request, $data, $normalFields, $sortableColumns))->renderTable();
    }

    /**
     * Summary Report grouped by period (daily, monthly, yearly) + optional date range
     */
    public function getSummaryReport($period = 'monthly', $startDate = null, $endDate = null, $channel='both')
    {
        $dateFormat = match ($period) {
            'daily' => '%Y-%m-%d',
            'monthly' => '%Y-%m',
            'yearly' => '%Y',
            default => '%Y-%m-%d',
        };


        // === POS TRANSACTIONS ===
        $pos = collect();
        if ($channel === 'pos' || $channel === 'both') {
            $posQuery = PosTransaction::where('status', c('POS_SERVED'));

            if ($startDate && $endDate) {
                $posQuery->whereBetween('transaction_datetime', [
                    $startDate,
                    $endDate
                ]);
            }

            $pos = $posQuery
                ->selectRaw("DATE_FORMAT(transaction_datetime, '{$dateFormat}') as period, SUM(total_amount) as total_sales")
                ->groupBy('period')
                ->get();
        }
      
        // === ONLINE ORDERS ===
        $online = collect();
        if ($channel === 'online' || $channel === 'both') {
            $onlineQuery = OnlineOrder::where('status', c('ORDER_SERVED'));

            if ($startDate && $endDate) {
                $posQuery->whereBetween('order_date', [
                    $startDate,
                    $endDate
                ]);
            }

            $online = $onlineQuery
                ->selectRaw("DATE_FORMAT(order_date, '{$dateFormat}') as period, SUM(total_amount) as total_sales")
                ->groupBy('period')
                ->get();
        }
        // === COMBINE DATA ===
        $final = [];

        foreach ($pos as $row) {
            $date = $row->period;
            if (!isset($final[$date])) {
                $final[$date] = [
                    'period' => $date,
                    'total_sales' => 0,
                ];
            }
            $final[$date]['total_sales'] += $row->total_sales; // ✅ fixed
        }

        foreach ($online as $row) {
            $date = $row->period;
            if (!isset($final[$date])) {
                $final[$date] = [
                    'period' => $date,
                    'total_sales' => 0,
                ];
            }
            $final[$date]['total_sales'] += $row->total_sales; // ✅ fixed
        }

        $final = collect($final)->sortBy('period')->values();

        // === FILL MISSING DATES WITH ZERO SALES ===
        $startDate = Carbon::parse($startDate);
        $endDate   = Carbon::parse($endDate);

        $datesRange = collect();
        $dateCursor = $startDate->copy();

        while ($dateCursor->lte($endDate)) {
            $datesRange->push($dateCursor->format('Y-m-d'));
            $dateCursor->addDay();
        }

        $merged = $datesRange->map(function ($date) use ($final) {
            $daySales = $final->firstWhere('period', $date);
            return [
                'period' => $date,
                'total_sales' => $daySales['total_sales'] ?? 0,
            ];
        });

        return $merged->values();
    }
}
