<?php

namespace App\Services\Website;

use App\Models\Product;
use App\Helpers\DTServerSide;
use Illuminate\Support\Facades\Storage;


class ProductService
{
    public function getProductList($request)
    {
        $data = Product::with(['primaryImage','variants']);

        $normalFields = ['name', 'cost_price', 'status', 'selling_price', 'quantity_on_hand', 'reorder_point','created_at']; 
        
        $sortableColumns = [
            'id'            => 'id',
            'created_at'    => 'created_at',
            'name'          => 'name',
            'quantity_on_hand' => 'quantity_on_hand',
        ];

        return (new DTServerSide($request, $data, $normalFields, $sortableColumns))->renderTable();
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
        ])->findOrFail($product_id);

        $primaryImage = $response->images->firstWhere('is_primary', 1);

        $response->image = $primaryImage?->image_cover;

        $primaryIndex = $response->images
            ->search(fn($img) => $img->is_primary == 1);

        $response->primary_index = $primaryIndex;

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
}
