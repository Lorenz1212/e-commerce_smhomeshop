<?php

namespace App\Services\Website;

use App\Models\Product;
use App\Helpers\DTServerSide;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class ProductService
{
    public function getProductList($request)
    {
        $minPrice = $request->minPrice;
        $maxPrice = $request->maxPrice;

        $query = Product::with(['primaryImage','variants','category','brand'])    
        ->withMin('variants', 'selling_price')
        ->withMax('variants', 'selling_price');

        if ($request->category) {
            $query->whereHas('category', fn($q) =>
                $q->where('name', $request->category)
            );
        }

       if ($request->brands && is_array($request->brands)) {
            $query->whereHas('brand', function ($q) use ($request) {
                $q->whereIn('name', $request->brands);
            });
        }
        
        if ($minPrice !== null && $maxPrice !== null) {
            $query->where(function($q) use ($minPrice, $maxPrice) {
                $q->whereBetween('selling_price', [$minPrice, $maxPrice]) // base product price
                ->orWhereHas('variants', function($v) use ($minPrice, $maxPrice) {
                    $v->whereBetween('selling_price', [$minPrice, $maxPrice]);
                });
            });
        }

        switch ($request->sort) {
            case 'a-z':
                $query->orderBy('name', 'asc');
                break;
            case 'z-a':
                $query->orderBy('name', 'desc');
                break;
            case 'lowToHigh':
                $query->orderByRaw('COALESCE(variants_min_selling_price, selling_price) asc');
                break;
            case 'highToLow':
                $query->orderByRaw('COALESCE(variants_min_selling_price, selling_price) desc');
                break;
            case 'oldToNew':
                $query->orderBy('created_at', 'asc');
                break;
            case 'newToOld':
                $query->orderBy('created_at', 'desc');
                break;
        }

        $normalFields = ['name', 'cost_price', 'status', 'selling_price', 'quantity_on_hand', 'reorder_point','created_at']; 
        
        $sortableColumns = [
            'id'            => 'id',
            'created_at'    => 'created_at',
            'name'          => 'name',
            'quantity_on_hand' => 'quantity_on_hand',
        ];

        $request['pageSize'] = 12;

        return (new DTServerSide($request, $query, $normalFields, $sortableColumns))->renderTable();
    }
    
    public function getProductDetails($product_id)
    {
        $response = Product::with([
            'images',
            'product_addons.addon',
            'variants',
            'supplier',
            'category',
            'brand'
        ])
        ->withMin('variants', 'selling_price')
        ->withMax('variants', 'selling_price')
        ->findOrFail($product_id);

        $response->product_addons->transform(function ($productAddon) {
            $productAddon->base_price = $productAddon->addon->base_price ?? null;
            return $productAddon;
        });

        $response->variants->transform(function ($productVariant) {
            $productVariant->image_cover = $productVariant->image?->image_cover??null;
            return $productVariant;
        });

        return $response;
    }

    public function getRelatedProducts($product_id)
    {

        $currentProduct = Product::findOrFail($product_id);

        $relatedProducts = $currentProduct->relatedProducts(8);

        return $relatedProducts;
    }
}
