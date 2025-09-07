<?php

namespace App\Services\Admin\Dashboard;

use App\Models\Customer;
use App\Models\Feedback;
use Illuminate\Support\Str;
use App\Models\OnlineOrder;
use App\Models\PosTransaction;
use App\Models\Product;
use Carbon\Carbon;

class DashboardService
{
     public function getCustomerCount($request){
        
        if($request->status == '1'){
            return Customer::count();
        }else if($request->status == '2'){
            return Customer::onlyTrashed()->count();
        }
    }

    public function getProductCount($request){
        if ($request->status == '1') {
            return Product::count();
        } elseif ($request->status == '2') {
            return Product::onlyTrashed()->count();
        }
    }

    public function getProductStocks($request)
    {
        $products = Product::whereColumn('quantity_on_hand', '<=', 'reorder_point')
        ->get()
        ->map(function ($product, $index) {
            $product->row_number = $index + 1;
            $product->image_cover = $product->images->first()?->image_cover;
            $product->status = $product->stock_status;
            return $product;
        });

        return $products;
    }


    public function getForcastingSales($request) {
        $storeId   = $request->input('store_id', 1);
        $fromDate  = $request->input('from_date', Carbon::now()->startOfMonth()->format('Y-m-d'));
        $toDate    = $request->input('to_date', Carbon::now()->endOfMonth()->format('Y-m-d'));
        $channel   = $request->input('channel', 'both'); // 'pos', 'online', 'both'

        // === POS TRANSACTIONS ===
        $pos = collect();
        if ($channel === 'pos' || $channel === 'both') {
            $posQuery = PosTransaction::where('status', c('POS_SERVED'));

            if ($storeId) {
                $posQuery->where('store_id', $storeId);
            }

            if ($fromDate && $toDate) {
                $posQuery->whereBetween('transaction_datetime', [$fromDate, $toDate]);
            }

            $pos = $posQuery
                ->selectRaw('DATE(transaction_datetime) as date, SUM(total_amount) as total_sales')
                ->groupBy('date')
                ->get();
        }

        // === ONLINE ORDERS ===
        $online = collect();
        if ($channel === 'online' || $channel === 'both') {
            $onlineQuery = OnlineOrder::where('status', c('ORDER_SERVED'));

            if ($storeId) {
                $onlineQuery->where('store_id', $storeId);
            }

            if ($fromDate && $toDate) {
                $onlineQuery->whereBetween('order_date', [$fromDate, $toDate]);
            }

            $online = $onlineQuery
                ->selectRaw('DATE(order_date) as date, SUM(total_amount) as total_sales')
                ->groupBy('date')
                ->get();
        }

        // === COMBINE DATA ===
        $final = [];

        foreach ($pos as $row) {
            $date = $row->date;
            if (!isset($final[$date])) {
                $final[$date] = [
                    'date' => $date,
                    'total_sales' => 0,
                ];
            }
            $final[$date]['total_sales'] += $row->total_sales; // ✅ fixed
        }

        foreach ($online as $row) {
            $date = $row->date;
            if (!isset($final[$date])) {
                $final[$date] = [
                    'date' => $date,
                    'total_sales' => 0,
                ];
            }
            $final[$date]['total_sales'] += $row->total_sales; // ✅ fixed
        }

        $final = collect($final)->sortBy('date')->values();

        // === FILL MISSING DATES WITH ZERO SALES ===
        $startDate = Carbon::parse($fromDate);
        $endDate   = Carbon::parse($toDate);

        $datesRange = collect();
        $dateCursor = $startDate->copy();

        while ($dateCursor->lte($endDate)) {
            $datesRange->push($dateCursor->format('Y-m-d'));
            $dateCursor->addDay();
        }

        $merged = $datesRange->map(function ($date) use ($final) {
            $daySales = $final->firstWhere('date', $date);
            return [
                'date' => $date,
                'total_sales' => $daySales['total_sales'] ?? 0,
            ];
        });

        // === PREPARE DATA POINTS FOR LINEAR REGRESSION ===
        $dataPoints = collect();
        $index = 1;

        foreach ($merged as $day) {
            $dataPoints->push([
                'x' => $index,          // Day number (1, 2, 3, ...)
                'y' => (float) $day['total_sales'],
            ]);
            $index++;
        }

        // Default forecast (empty)
        $forecasts = [];

        // Forecast ONLY if may sapat na data
        if ($dataPoints->count() >= 3) {
            list($m, $b) = $this->linearRegressionCoefficients($dataPoints);

            $forecastDays = 7;
            $days = $merged->count();

            for ($i = 1; $i <= $forecastDays; $i++) {
                $x = $days + $i;
                $y = $m * $x + $b;
                $forecasts[] = [
                    'day' => Carbon::now()->addDays($i)->format('Y-m-d'),
                    'forecast' => max(0, round($y, 2)),  // Avoid negative forecast
                ];
            }
        }

        return [
            'historical_sales' => $merged,
            'forecast' => $forecasts,
        ];
    }

    private function linearRegressionCoefficients($dataPoints) {
        $n = $dataPoints->count();

        $sumX = $dataPoints->sum('x');
        $sumY = $dataPoints->sum('y');
        $sumXY = $dataPoints->sum(function ($point) {
            return $point['x'] * $point['y'];
        });
        $sumX2 = $dataPoints->sum(function ($point) {
            return $point['x'] * $point['x'];
        });

        // Handle division by zero
        $denominator = ($n * $sumX2 - $sumX * $sumX);
        if ($denominator == 0) {
            return [0, 0];
        }

        $m = ($n * $sumXY - $sumX * $sumY) / $denominator;
        $b = ($sumY - $m * $sumX) / $n;

        return [$m, $b];
    }


    public function getSentimentCountsAndStatus ($request){

        $query = Feedback::query()->with('source', 'handler');

        if ($request->filled('from')) {
            $query->whereDate('date_posted', '>=', $request->from);
        }

        if ($request->filled('to')) {
            $query->whereDate('date_posted', '<=', $request->to);
        }

        if ($request->filled('source_id')) {
            $query->where('source_id', $request->source_id);
        }

        if ($request->filled('sentiment')) {
            $query->where('sentiment', $request->sentiment);
        }

        if ($request->filled('handled_by')) {
            $query->where('handled_by', $request->handled_by);
        }

        $sentimentCounts = (clone $query)->selectRaw('sentiment, COUNT(*) as total')->groupBy('sentiment')->pluck('total', 'sentiment');

        $statusCounts = (clone $query)->selectRaw('status, COUNT(*) as total')->groupBy('status')->pluck('total', 'status');

        return [
            'sentimentCounts'=>$sentimentCounts,
            'statusCounts'=>$statusCounts
        ];

    } 

    public function getFeedbackStats($request){

        $total = Feedback::count();

        $positive = Feedback::where('sentiment','POSITIVE')->count();

        $negative = Feedback::where('sentiment','NEGATIVE')->count();

        $neutral = Feedback::where('sentiment','NEUTRAL')->count();

        return [
            'total'=>$total,
            'positive' => $positive,
            'negative' => $negative,
            'neutral' => $neutral
        ];
    } 
    
    public function getFeedbackOvertime($request){
        $query = Feedback::with('source', 'handler');

        if ($request->filled('from')) {
            $query->whereDate('date_posted', '>=', $request->from);
        } else {
            $query->where('date_posted', '>=', now()->subDays(30)); // default
        }

        if ($request->filled('to')) {
            $query->whereDate('date_posted', '<=', $request->to);
        }

        if ($request->filled('source_id')) {
            $query->where('source_id', $request->source_id);
        }

        if ($request->filled('sentiment')) {
            $query->where('sentiment', $request->sentiment);
        }

        if ($request->filled('handled_by')) {
            $query->where('handled_by', $request->handled_by);
        }

        return $query
            ->selectRaw('DATE(date_posted) as date, COUNT(*) as count')
            ->groupByRaw('DATE(date_posted)')
            ->orderBy('date')
            ->pluck('count', 'date');
    }

    public function getRecentFeedback($request)
    {
        $query = Feedback::with('source')
            ->select('author_name', 'rating', 'comment', 'date_posted', 'source_id');

        // Apply filters
        if ($request->filled('from')) {
            $query->whereDate('date_posted', '>=', $request->from);
        }

        if ($request->filled('to')) {
            $query->whereDate('date_posted', '<=', $request->to);
        }

        // Kunin na yung actual results
        $feedbacks = $query->latest('date_posted')->limit(10)->get();

        $data = [];
        foreach ($feedbacks as $item) {
            $data[] = [
                'id'          => $item->id_encrypted,
                'author_name' => $item->author_name,
                'rating'      => $item->rating,
                'comment'     => $item->comment,
                'date_posted' => Carbon::parse($item->date_posted)->format('F d, Y'),
                'source'      => $item->source->name ?? 'N/A',
            ];
        }

        return $data;
    }

}
