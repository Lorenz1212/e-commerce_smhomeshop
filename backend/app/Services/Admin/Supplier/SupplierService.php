<?php

namespace App\Services\Admin\Supplier;

use App\Helpers\DTServerSide;
use App\Models\Supplier;

class SupplierService
{
    public function getListSupplier($request)
    {
        $data = Supplier::query();

        $normalFields = ['name', 'contact_person', 'phone', 'email','created_at_format']; 
        
        $sortableColumns = [
            'row_number'    => 'row_number',
            'id'            => 'id',
            'created_at_format'   => 'created_at_format',
            'name'          => 'name',
            'contact_person'=> 'contact_person',
            'phone'         => 'phone',
            'email'         => 'email',
           
        ];

        return (new DTServerSide($request, $data, $normalFields, $sortableColumns))->renderTable();
    }

    public function getArchivedList($request)
    {
        $data = Supplier::onlyTrashed();

        $normalFields = ['name', 'contact_person', 'phone', 'email','created_at_format']; 
        
        $sortableColumns = [
            'row_number'    => 'row_number',
            'id'            => 'id',
            'created_at_format'   => 'created_at_format',
            'name'          => 'name',
            'contact_person'=> 'contact_person',
            'phone'         => 'phone',
            'email'         => 'email',
           
        ];

        return (new DTServerSide($request, $data, $normalFields, $sortableColumns))->renderTable();
    }
    
    public function getSupplierDetails($supplier_id)
    {
        $response = Supplier::findorFail($supplier_id);

        return $response;
    }

    public function createSupplier(array $data)
    {
        return Supplier::create($data);
    }

    public function updateSupplier(int $supplier_id, array $data): Supplier
    {
        $supplier = Supplier::findOrFail($supplier_id);

        $supplier->update($data);

        return $supplier;
    }

    public function deleteSupplier($supplier_id)
    {
        $response = Supplier::findorFail($supplier_id);
        
        $name = $response->name;

        $response->delete();

        return $name;
    }

    public function restoreSupplier($product_id)
    {
        $supplier = Supplier::withTrashed()->findorFail($product_id);

        if ($supplier->trashed()) {
             $supplier->restore();
        }

        return $supplier->name;
    }
}
