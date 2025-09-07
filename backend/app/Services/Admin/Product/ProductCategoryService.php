<?php

namespace App\Services\Admin\Product;

use App\Helpers\DTServerSide;
use App\Models\ProductCategory;
use App\Models\ProductCategoryImage;
use Illuminate\Support\Facades\Storage;

class ProductCategoryService
{
    public function getListCategory($request)
    {
        $data = ProductCategory::with(['images']);

        $normalFields = ['name', 'is_active', 'created_at_format']; 
        
        $sortableColumns = [
            'row_number'          => 'row_number',
            'id'                  => 'id',
            'created_at_format'   => 'created_at_format',
            'name'                => 'name',
        ];

        return (new DTServerSide($request, $data, $normalFields, $sortableColumns))->renderTable();
    }

    public function getArchivedList($request)
    {
        $data = ProductCategory::onlyTrashed()->with(['images']);

        $normalFields = ['name', 'is_active', 'created_at_format']; 
        
        $sortableColumns = [
            'row_number'          => 'row_number',
            'id'                  => 'id',
            'created_at_format'   => 'created_at_format',
            'name'                => 'name',
        ];

        return (new DTServerSide($request, $data, $normalFields, $sortableColumns))->renderTable();
    }
    

    public function getCategoryDetails($category_id)
    {
         $response = ProductCategory::with([
            'images',
        ])->findOrFail($category_id);

        $response->image = $response->images->first()?->image_cover;

        return $response;
    }

    public function createCategory(array $data)
    {
        $category = ProductCategory::create([
            'name' => $data['name'],
        ]);

        foreach ($data['filename'] ?? [] as $filename) {
            ProductCategoryImage::create([
                'category_id' => $category->id,
                'filename' => $filename,
            ]);
        }

        return $category;
    }

    public function updateCategory($category_id, array $data)
    {
        $category = ProductCategory::findorFail($category_id);

        $name = $category->name;

        if (!empty($data['filename'])) {
      
            foreach ($category->images as $image) {
                $path = 'images/categories/' . $image->filename;

                if (Storage::disk('public')->exists($path)) {
                    Storage::disk('public')->delete($path);
                }

                $image->delete();
            }

            $category->images()->delete();

            foreach ($data['filename'] as $filename) {
                ProductCategoryImage::create([
                    'category_id' => $category->id,
                    'filename' => $filename,
                ]);
            }
        }

        $category->update([
            'name' => $data['name']
        ]);
        
        return $name;
    }

    public function deleteCategory($category_id)
    {
        $response = ProductCategory::findorFail($category_id);
        
        $name = $response->name;

        $response->delete();

        return $name;
    }

    public function restoreCategory($category_id)
    {
        $response = ProductCategory::withTrashed()->findorFail($category_id);
        if ($response->trashed()) {
             $response->restore();
        }
        return $response->name;
    }
}
