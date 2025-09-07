<?php

namespace App\Services\Admin\Product;

use App\Models\Product;
use App\Helpers\DTServerSide;
use App\Models\InventoryMovement;
use App\Models\ProductAddon;
use App\Models\ProductImage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use PDO;

class ProductService
{
    public function getProductList($request)
    {
        $data = Product::with(['category','images']);

        $normalFields = ['name', 'category.name','cost_price', 'status', 'selling_price', 'quantity_on_hand', 'reorder_point','created_at']; 
        
        $sortableColumns = [
            'id'            => 'id',
            'created_at'    => 'created_at',
            'name'          => 'name',
            'category_name' => 'category.name',
            'quantity_on_hand' => 'quantity_on_hand',
        ];

        return (new DTServerSide($request, $data, $normalFields, $sortableColumns))->renderTable();
    }

    public function getArchivedList($request)
    {
        $data = Product::onlyTrashed()->with(['category','images']);

        $normalFields = ['name', 'category.name','cost_price', 'status', 'selling_price', 'quantity_on_hand', 'reorder_point','created_at']; 
        
        $sortableColumns = [
            'id'            => 'id',
            'created_at'    => 'created_at',
            'name'          => 'name',
            'category_name' => 'category.name',
            'quantity_on_hand' => 'quantity_on_hand',
            
        ];

        return (new DTServerSide($request, $data, $normalFields, $sortableColumns))->renderTable();
    }
    
    public function getProductDetails($product_id)
    {
        $response = Product::with([
            'images',
            'product_addons.addon'
        ])->findOrFail($product_id);

        $response->image = $response->images->first()?->image_cover;

        $response->product_addons->transform(function ($productAddon) {
            $productAddon->base_price = $productAddon->addon->base_price ?? null;
            return $productAddon;
        });

        return $response;
    }

    public function createProduct(array $data)
    {
        $product = Product::create([
            'sku' => $data['sku'],
            'name' => $data['name'],
            'description' => $data['description'],
            'category_id' => $data['category_id'],
            'supplier_id' => $data['supplier_id'],
            'quantity_on_hand' => $data['quantity_on_hand'],
            'reorder_point' => $data['reorder_point'],
            'cost_price' => $data['cost_price'],
            'selling_price' => $data['selling_price'],
        ]);

        InventoryMovement::create([
            'product_id'=>$product->id,
            'supplier_id'=>$data['supplier_id'],
            'quantity' => $data['quantity_on_hand'],
            'movement_type'=>'IN'
        ]);

        foreach ($data['filename'] ?? [] as $filename) {
            ProductImage::create([
                'product_id' => $product->id,
                'filename' => $filename,
            ]);
        }

        if (!empty($data['addons'])) {
            foreach ($data['addons'] as $row) {
                ProductAddon::create([
                    'product_id' => $product->id,
                    'addon_id' => $row['id'],
                    'custom_price' => !empty($row['custom_price']) ? $row['custom_price'] : $row['base_price'],
                ]);
            }
        }
       
        return $product;
    }

    public function updateProduct($product_id, array $data)
    {
        $product = Product::findorFail($product_id);

        $sku = $product->sku;

        if (!empty($data['filename'])) {

            foreach ($product->images as $image) {
                $path = 'images/products/' . $image->filename;

                if (Storage::disk('public')->exists($path)) {
                    Storage::disk('public')->delete($path);
                }

                $image->delete();
            }

            foreach ($data['filename'] as $filename) {
                ProductImage::create([
                    'product_id' => $product->id,
                    'filename' => $filename,
                ]);
            }
        }

        if (!empty($data['addons'])) {

            $product->product_addons()->delete();

            foreach ($data['addons'] as $row) {
                ProductAddon::create([
                    'product_id' => $product->id,
                    'addon_id' => $row['id'],
                    'custom_price'=>(!empty($row['custom_price']))?$row['custom_price']:$row['base_price']
                ]);
            }
        }else{
            $product->product_addons()->delete();
        }
     
        $quantity_on_hand = $product->quantity_on_hand??0;

        if(!empty($data['add_new_stocks'])){
            $quantity_on_hand_total = ($quantity_on_hand+$data['add_new_stocks']);
        }else{
            $quantity_on_hand_total = $quantity_on_hand;
        }

         $product->update([
            'sku' => $data['sku'],
            'name' => $data['name'],
            'description' => $data['description'],
            'category_id' => $data['category_id'],
            'supplier_id' => $data['supplier_id'],
            'quantity_on_hand' => $quantity_on_hand_total,
            'reorder_point' => $data['reorder_point'],
            'cost_price' => $data['cost_price'],
            'selling_price' => $data['selling_price'],
        ]);

        if(!empty($data['add_new_stocks'])){
            InventoryMovement::create([
                'product_id'=>$product->id,
                'supplier_id'=>$data['supplier_id'],
                'quantity' => $data['add_new_stocks'],
                'movement_type'=>'IN'
            ]);
        }

        return $sku;
    }

    public function archiveProduct($product_id)
    {
        $response = Product::findorFail($product_id)->delete();

        return $response;
    }

    public function restoreProduct($product_id)
    {
        $product = Product::withTrashed()->findorFail($product_id);
        if ($product->trashed()) {
             $product->restore();
        }

        return $product->name;
    }
}
