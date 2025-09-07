<?php

namespace App\Services\Customer;

use App\Models\Product;
use App\Models\ProductAddon;
use App\Models\ProductCategory;
use Illuminate\Support\Facades\DB;

class ProductService
{
    public function getProductBestSellerList(){

       $result = Product::with('product_addons')
        ->select('*')
        ->selectRaw('
            COALESCE(online.total_quantity, 0) + COALESCE(pos.total_quantity, 0) AS total_quantity_sold
        ')
        ->leftJoinSub(
            DB::table('online_order_items')
                ->select('product_id', DB::raw('SUM(quantity) as total_quantity'))
                ->groupBy('product_id'),
            'online',
            'products.id',
            '=',
            'online.product_id'
        )
        ->leftJoinSub(
            DB::table('pos_transaction_items')
                ->select('product_id', DB::raw('SUM(quantity) as total_quantity'))
                ->groupBy('product_id'),
            'pos',
            'products.id',
            '=',
            'pos.product_id'
        )
        ->orderByDesc('total_quantity_sold')
        ->limit(10)
        ->get()
        ->map(function ($product) {
            return [
                    'id' => $product->id_encrypted,
                    'name' => $product->name,
                    'price' => (float) $product->selling_price,
                    'quantity_on_hand' => $product->quantity_on_hand,
                    'description' => $product->description,
                    'image_url' => $product->images->first()?->image_cover,
                    'total_quantity_sold' => (int) $product->total_quantity_sold,
            ];
        });

        return $result;
    }

    public function getProductCategoriesList(){

        $categories = ProductCategory::all();

        $data = [];
        if($categories){
            foreach($categories as $category){
                $data[] = [
                    'id_encrypted'=>$category->id_encrypted,
                    'name'=>$category->name,
                    'image_url'=> $category->images->first()?->image_cover
                ];
            }
        }
        
        return $data;

    }

    public function getProductList(string $category_id){

        $products = Product::where('category_id',$category_id)->get();
        $data = [];
        if($products){
            foreach($products as $product){
                $data[] = [
                    'id'=>$product->id_encrypted,
                    'name'=>$product->name,
                    'price'=>$product->selling_price,
                    'image_url'=> $product->images->first()?->image_cover
                ];
            }
        }
        
        return $data;
    }

    public function getProductDetails(string $product_id){

        $product = Product::with(['images', 'product_addons'])->findOrFail($product_id);

        return [
            'name'=>$product->name,
            'description'=>$product->description,
            'price'=>$product->selling_price,
            'image_url'=> $product->images->first()?->image_cover,
            'addons' => $product->product_addons->map(function ($product_addon) {
                return [
                    'id' => $product_addon->id,
                    'name' => $product_addon->addon->name,
                    'price' => $product_addon->custom_price
                ];
            })
        ];
    }

     public function getProductAddons(string $product_id){

        $product_addons = ProductAddon::where('product_id',$product_id)->get();
        $data = [];
        if($product_addons){
             foreach($product_addons as $product_addon){
                $data[] =  [
                    'id' => $product_addon->addon_id,
                    'name' => $product_addon->addon->name,
                    'price' => $product_addon->custom_price
                ];
            }
        }
        return $data;
    }
}