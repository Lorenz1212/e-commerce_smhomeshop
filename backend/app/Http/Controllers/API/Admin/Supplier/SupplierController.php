<?php

namespace App\Http\Controllers\API\Admin\Supplier;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Services\Admin\Supplier\SupplierService;
use App\Http\Requests\Supplier\StoreSupplierRequest;
use App\Http\Requests\Supplier\UpdateSupplierRequest;


class SupplierController extends Controller
{
    protected $supplierService;

    public function __construct(SupplierService $supplierService)
    {
        $this->supplierService = $supplierService;
    }

    public function list(Request $request){

        return $this->supplierService->getlistSupplier($request);
    }

    public function archivedList(Request $request){

        return $this->supplierService->getArchivedList($request);
    }

    public function showDetails(string $supplier_id){

        $supplier_id = $this->decrypt_string($supplier_id);

        return $this->supplierService->getSupplierDetails($supplier_id);
    }
    
    public function store(StoreSupplierRequest $request){
        try {
            DB::beginTransaction();

            $response = $this->supplierService->createSupplier($request->validated());

            DB::commit();
            
            return $this->success(false, _lang_message('created_successfully',['item' => 'Supplier']));

        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->ExceptionHandler($e);
        }
    }

    public function update(string $supplier_id, UpdateSupplierRequest $request){
        try {
            DB::beginTransaction();

            $supplier_id = $this->decrypt_string($supplier_id);

            $response = $this->supplierService->updateSupplier($supplier_id, $request->validated());

            DB::commit();
            
            return $this->success(false, _lang_message('updated_successfully',['item' => 'Supplier']));

        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->ExceptionHandler($e);
        }
    }

    public function delete(string $supplier_id){
        try {
            DB::beginTransaction();

            $supplier_id = $this->decrypt_string($supplier_id);

            $response = $this->supplierService->deleteSupplier($supplier_id);

            DB::commit();
            
            return $this->success(false, _lang_message('deleted_successfully',['item' => $response]));

        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->ExceptionHandler($e);
        }
    }

    public function restore(string $supplier_id)
    {
         try {
            DB::beginTransaction();

            $supplier_id = $this->decrypt_string($supplier_id);

            $response = $this->supplierService->restoreSupplier($supplier_id);

            DB::commit();
            
            return $this->success($response, _lang_message('restored_successfully',['item' => $response]));

        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->ExceptionHandler($e);
        }
    }
}
