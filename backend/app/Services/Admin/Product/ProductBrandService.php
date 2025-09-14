<?php

namespace App\Services\Admin\Product;

use App\Helpers\DTServerSide;
use App\Models\ProductBrand;
use Illuminate\Support\Facades\Storage;

class ProductBrandService
{
    public function getListBrand($request)
    {
        $data = ProductBrand::query();

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
        $data = ProductBrand::onlyTrashed();

        $normalFields = ['name', 'created_at_format']; 
        
        $sortableColumns = [
            'row_number'          => 'row_number',
            'id'                  => 'id',
            'created_at_format'   => 'created_at_format',
            'name'                => 'name',
        ];

        return (new DTServerSide($request, $data, $normalFields, $sortableColumns))->renderTable();
    }
    

    public function getBrandDetails($brand_id)
    {
        $response = ProductBrand::findOrFail($brand_id);

        return $response;
    }

    public function createBrand(array $data)
    {
        $brand = ProductBrand::create([
            'name' => $data['name'],
            'image'=> $data['filename'][0]
        ]);

        return $brand;
    }

    public function updateBrand($brand_id, array $data)
    {
        $brand = ProductBrand::findorFail($brand_id);

        $filename = $brand->image;

        if (!empty($data['filename'])) {
      
            $path = 'images/brands/' . $brand->image;

            if (Storage::disk('public')->exists($path)) {
                Storage::disk('public')->delete($path);
            }

            $filename = $data['filename'][0];
        }

        $brand->update([
            'name'  => $data['name'],
            'image' => $filename
        ]);

        return $data['name'];
    }

    public function deleteBrand($brand_id)
    {
        $response = ProductBrand::findorFail($brand_id);
        
        $name = $response->name;

        $response->delete();

        return $name;
    }

    public function restoreBrand($brand_id)
    {
        $response = ProductBrand::withTrashed()->findorFail($brand_id);
        if ($response->trashed()) {
             $response->restore();
        }
        return $response->name;
    }
}
