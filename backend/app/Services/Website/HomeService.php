<?php

namespace App\Services\Website;

use App\Models\Product;

class HomeService
{
    public function getProductBestSeller()
    {
        $bestSellers = Product::with(['primaryImage','variants','category','brand'])  
        ->withMin('variants', 'selling_price')
        ->withMax('variants', 'selling_price')
        ->withSum(['orderItems' => function ($q) {
            $q->where('status', 'FULFILLED');
        }], 'quantity')
        ->orderByDesc('order_items_sum_quantity')
        ->take(8)  
        ->get()->transform(function($item){
            $item->image_cover = $item->primaryImage->image_cover??null;
            return $item;
        });

        return $bestSellers;
    }

    public function getProductNewArrival()
    {
        $newArrivals = Product::
            with(['primaryImage','variants','category','brand'])  
            ->withMin('variants', 'selling_price')
            ->withMax('variants', 'selling_price')
            ->latest()   
            ->take(8)                    
            ->get()->transform(function($item){
            $item->image_cover = $item->primaryImage->image_cover??null;
            return $item;
        });

        return $newArrivals;
    }

    public function getProductAll()
    {
        $productAll = Product::
            with(['primaryImage','variants','category','brand'])  
            ->withMin('variants', 'selling_price')
            ->withMax('variants', 'selling_price')
            ->latest()->take(12)->get()->transform(function($item){
            $item->image_cover = $item->primaryImage->image_cover??null;
            return $item;
        });
        
        return $productAll;
    }
}
