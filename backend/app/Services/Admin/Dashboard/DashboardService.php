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


    public function getForecastingSales($request)
    {
        $storeId  = $request->input('store_id', 1);
        $fromDate = $request->input('from_date', Carbon::now()->startOfMonth()->format('Y-m-d'));
        $toDate   = $request->input('to_date', Carbon::now()->endOfMonth()->format('Y-m-d'));
 
        // === ONLINE ORDERS ===
        $online = collect();

        $onlineQuery = OnlineOrder::where('status', ORDER_SHIPPED);

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

        // === COMBINE DATA ===
        $final = [];

        foreach ($online as $row) {
            $date = $row->date;
            if (!isset($final[$date])) {
                $final[$date] = [
                    'date' => $date,
                    'total_sales' => 0,
                ];
            }
            $final[$date]['total_sales'] += (float) $row->total_sales;
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
            if ($day['total_sales'] > 0) {
                $dataPoints->push([
                    'x' => $index,
                    'y' => floatval($day['total_sales']),
                ]);
            }
            $index++;
        }

        // === FORECAST SECTION ===
        $forecasts = [];

        if ($dataPoints->count() >= 2) {
            [$m, $b] = $this->linearRegressionCoefficients($dataPoints);

            $forecastDays = 7; // You can change this to any number
            $days = $merged->count();
            $lastSales = $merged->last()['total_sales'] ?? 0;

            $lastSalesDate = collect($merged)
                ->filter(fn($d) => $d['total_sales'] > 0)
                ->last();

            $lastDate = Carbon::parse($lastSalesDate['date']);

            for ($i = 1; $i <= $forecastDays; $i++) {
                $x = $dataPoints->count() + $i;
                $y = $m * $x + $b;

                // Use last known sales if regression is flat or gives negative result
                $forecastValue = ($y > 0) ? $y : $lastSales;

                $forecasts[] = [
                    'date' => $lastDate->copy()->addDays($i)->format('Y-m-d'),
                    'forecast' => max(0, round($y, 2)),
                ];
            }
        }

        return [
            'historical_sales' => $merged,
            'forecast' => $forecasts,
        ];
    }

    private function linearRegressionCoefficients($dataPoints){
        $n = $dataPoints->count();

        $sumX = $dataPoints->sum('x');
        $sumY = $dataPoints->sum('y');
        $sumXY = $dataPoints->sum(fn($p) => $p['x'] * $p['y']);
        $sumX2 = $dataPoints->sum(fn($p) => $p['x'] * $p['x']);

        $denominator = ($n * $sumX2 - pow($sumX, 2));
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
