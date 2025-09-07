<?php

namespace App\Http\Controllers\API\Admin\Customer;

use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Services\Admin\Customer\CustomerService;
use App\Http\Requests\Customer\UpdateCustomerRequest;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    protected $customerService;

    public function __construct(CustomerService $customerService){
        $this->customerService = $customerService;
    }

    public function list(Request $request){

        return $this->customerService->getCustomerList($request);
    }

    public function archivedList(Request $request){

        return $this->customerService->getArchivedList($request);
    }

    public function showDetails(string $customer_id){

        $customer_id = $this->decrypt_string($customer_id);

        $data = $this->customerService->getCustomerDetails($customer_id);

        return $this->returnData($data);
    }

    public function update(string $customer_id,UpdateCustomerRequest $request){
        try {
            DB::beginTransaction();

            $customer_id = $this->decrypt_string($customer_id);

            $response = $this->customerService->updateCustomer($customer_id, $request->validated());

            DB::commit();
            
            return $this->success($response, _lang_message('updated_successfully',['item' => $response]));

        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->ExceptionHandler($e);
        }
    }

    public function archive(string $customer_id){
        try {
            DB::beginTransaction();

            $customer_id = $this->decrypt_string($customer_id);

            $response = $this->customerService->archiveCustomer($customer_id);

            DB::commit();
            
            return $this->success($response, _lang_message('deleted_successfully',['item' => $response]));

        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->ExceptionHandler($e);
        }
    }
    
    public function restore($customer_id){
        $customer_id = $this->decrypt_string($customer_id);

        $response = $this->customerService->restoreCustomer($customer_id);

        return $this->success($response, _lang_message('restored_successfully',['item' => $response]));
    }
}
