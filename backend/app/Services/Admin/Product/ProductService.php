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

    public function getArchivedList($request)
    {
        $data = Product::onlyTrashed()->with(['primaryImage','variants']);

        $normalFields = ['name','cost_price', 'status', 'selling_price', 'quantity_on_hand', 'reorder_point','created_at']; 
        
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

        if(!empty($data['filename'])){
            foreach ($data['filename'] ?? [] as $index => $filename) {
                $isPrimary = ($index == $data['primary_index']);
                ProductImage::create([
                    'product_id' => $product->id,
                    'filename' => $filename,
                    'is_primary' => $isPrimary
                ]);
            }
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
                    ProductVariantImage::create([
                        'variant_id' => $newVariant->id, // ✅ use object id
                        'filename'   => $variant['filename'],
                        'is_primary' => 1, // first image is primary
                    ]);
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

            $existingImages = $product->images->pluck('id', 'filename')->toArray();

            foreach ($data['filename'] as $index => $filename) {
                $isPrimary = $data['primary_index']??0 == $index ? 1 : 0;

                if (isset($existingImages[$filename])) {
                    ProductImage::where('id', $existingImages[$filename])
                        ->update(['is_primary' => $isPrimary]);
                } else {
                    ProductImage::create([
                        'product_id' => $product->id,
                        'filename'   => $filename,
                        'is_primary' => $isPrimary,
                    ]);
                }
            }

            $keepFilenames = $data['filename'];
            $product->images()
                ->whereNotIn('filename', $keepFilenames)
                ->delete();
        }else{
            if (isset($data['primary_index'])) {
                foreach ($product->images as $index => $image) {
                    $image->update([
                        'is_primary' => $index == $data['primary_index'] ? 1 : 0,
                    ]);
                }
            }
        }

        if (!empty($data['addons'])) {

            $addonIds = collect($data['addons'])->pluck('id')->toArray();

            foreach ($data['addons'] as $row) {
                $productAddon = ProductAddon::where('product_id', $product->id)
                    ->where('addon_id', $row['id'])
                    ->first();

                if ($productAddon) {
                    $productAddon->update([
                        'custom_price' => !empty($row['custom_price']) ? $row['custom_price'] : $row['base_price'],
                    ]);
                } else {
                    ProductAddon::create([
                        'product_id'   => $product->id,
                        'addon_id'     => $row['id'],
                        'custom_price' => !empty($row['custom_price']) ? $row['custom_price'] : $row['base_price'],
                    ]);
                }
            }

            // Delete removed addons
            $product->product_addons()->whereNotIn('id', $addonIds)->delete();
        } else {
            $product->product_addons()->delete();
        }

        if(!empty($data['variants'])){
           
            $variantIds = collect($data['variants'])->pluck('id')->toArray();

            foreach ($data['variants'] as $row) {
                $variantModel = ProductVariant::find($row['id']);
                 
                if ($variantModel) {
                    $variantModel->update([
                        'sku' => $row['sku'],
                        'variant_name' => $row['variant_name'],
                        'quantity_on_hand' => $row['quantity_on_hand'],
                        'reorder_point' => $row['reorder_point'] ?? null,
                        'cost_price' => $row['cost_price'] ?? null,
                        'selling_price' => $row['selling_price'] ?? null,
                    ]);
                } else {
                    $variantModel = ProductVariant::create([
                        'product_id' => $product->id,
                        'sku' => $row['sku'],
                        'variant_name' => $row['variant_name'],
                        'quantity_on_hand' => $row['quantity_on_hand'],
                        'reorder_point' => $row['reorder_point'] ?? null,
                        'cost_price' => $row['cost_price'] ?? null,
                        'selling_price' => $row['selling_price'] ?? null,
                    ]);
                }

                if (!empty($row['filename']) && $variantModel && $variantModel->images()->exists()) {

                    foreach ($variantModel->images as $img) {
                        $path = 'images/variants/' . $img->filename;
                        if (Storage::disk('public')->exists($path)) {
                            Storage::disk('public')->delete($path);
                        }
                    }

                    $variantModel->images()->delete();
                }

                if (!empty($row['filename'])) {
                    ProductVariantImage::create([
                        'variant_id' => $variantModel->id,
                        'filename'   => $row['filename'],
                        'is_primary' => 1,
                    ]);
                }

         
            }

            $product->variants()->whereNotIn('id', $variantIds)->delete();
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
