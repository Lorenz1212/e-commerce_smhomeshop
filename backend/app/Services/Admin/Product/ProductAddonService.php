<?php

namespace App\Services\Admin\Product;

use App\Helpers\DTServerSide;
use App\Models\Addon;

class ProductAddonService
{
    public function getAddonList($request)
    {
        $data = Addon::query();

        $normalFields = ['name','base_price', 'created_at_format']; 
        
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
        $data = Addon::onlyTrashed();

        $normalFields = ['name','base_price', 'created_at_format']; 
        
        $sortableColumns = [
            'row_number'          => 'row_number',
            'id'                  => 'id',
            'created_at_format'   => 'created_at_format',
            'name'                => 'name',
        ];

        return (new DTServerSide($request, $data, $normalFields, $sortableColumns))->renderTable();
    }
    
    public function getAddonDetails($addon_id)
    {
        $response = Addon::findorFail($addon_id);

        return $response;
    }

    public function createAddon(array $data)
    {
        $addon = Addon::create($data);

        return $addon;
    }

    public function updateAddon($addon_id, array $data)
    {
        $addon = Addon::findorFail($addon_id);

        $addon->update($data);

        $name = $addon->name;
        
        return $name;
    }

    public function deleteAddon($addon_id)
    {
        $response = Addon::findorFail($addon_id);
        
        $name = $response->name;

        $response->delete();

        return $name;
    }

    public function restoreAddon($addon_id)
    {
        $response = Addon::withTrashed()->findorFail($addon_id);
        if ($response->trashed()) {
             $response->restore();
        }
        return $response->name;
    }
}
