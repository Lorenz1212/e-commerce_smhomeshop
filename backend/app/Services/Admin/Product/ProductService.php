<?php

namespace App\Services\Admin\Product;

use App\Models\Product;
use App\Helpers\DTServerSide;
use App\Models\InventoryMovement;
use App\Models\ProductAddon;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\ProductVariantImage;
use Illuminate\Support\Facades\Storage;

class ProductService
{
    public function getProductList($request)
    {
        $data = Product::with(['category','primaryImage']);

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
        $data = Product::onlyTrashed()->with(['category','primaryImage']);

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
            'product_addons.addon',
            'variants'
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

        return $response;
    }

    public function createProduct(array $data)
    {
        $product = Product::create([
            'sku' => $data['sku'],
            'name' => $data['name'],
            'description' => $data['description'],
            'brand_id' => $data['brand_id'],
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

        foreach ($data['filename'] ?? [] as $index => $filename) {
            $isPrimary = ($index == $data['primary_index']);
            ProductImage::create([
                'product_id' => $product->id,
                'filename' => $filename,
                'is_primary' => $isPrimary
            ]);
        }

        if(!empty($data['variants'])){
            foreach ($data['variants'] as $variant) {

                $newVariant = ProductVariant::create([
                    'product_id' => $product->id,
                    'sku' =>  $variant['sku'],
                    'variant_name' => $variant['variant_name'],
                    'quantity_on_hand'=> $variant['quantity_on_hand'],
                    'reorder_point'=> $variant['reorder_point'],
                    'cost_price'=> $variant['cost_price'],
                    'selling_price'=> $variant['selling_price'],
                    'attributes' => $variant['attributes'] ?? null,
                ]);

                if (!empty($variant['filename'])) {
                    // If multiple images, loop through them
                    $filenames = is_array($variant['filename']) ? $variant['filename'] : [$variant['filename']];

                    foreach ($filenames as $index => $filename) {
                        ProductVariantImage::create([
                            'variant_id' => $newVariant->id, // ✅ use object id
                            'filename'   => $filename,
                            'is_primary' => $index === 0 ? 1 : 0, // first image is primary
                        ]);
                    }
                }
            }
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
        }else{

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

         if(!empty($data['variants'])){
            foreach ($data['variants'] as $variant) {

                $newVariant = ProductVariant::create([
                    'product_id' => $product->id,
                    'sku' =>  $variant['sku'],
                    'variant_name' => $variant['variant_name'],
                    'quantity_on_hand'=> $variant['quantity_on_hand'],
                    'reorder_point'=> $variant['reorder_point'],
                    'cost_price'=> $variant['cost_price'],
                    'selling_price'=> $variant['selling_price'],
                    'attributes' => $variant['attributes'] ?? null,
                ]);

                if (!empty($variant['filename'])) {
                    // If multiple images, loop through them
                    $filenames = is_array($variant['filename']) ? $variant['filename'] : [$variant['filename']];

                    foreach ($filenames as $index => $filename) {
                        ProductVariantImage::create([
                            'variant_id' => $newVariant->id, 
                            'filename'   => $filename,
                            'is_primary' => $index === 0 ? 1 : 0,
                        ]);
                    }
                }
            }
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
            'brand_id'    => $data['brand_id'],
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
