<?php

namespace App\Services\Admin\Customer;

use Illuminate\Support\Facades\Storage;
use App\Helpers\DTServerSide;
use App\Models\Customer;
use App\Models\CustomerAccount;

class CustomerService
{
    public function getCustomerList($request){

        $data = Customer::with('customer_account');

        $normalFields = ['fname','lname','mname','customer_account.email','created_at']; 
        
        $sortableColumns = [
            'id'         => 'id',
            'created_at' => 'created_at',
            'fname'      => 'fname',
            'lname'      => 'lname',
            'mname'      => 'mname',
            'suffix'     => 'suffix',
            'email'      => 'email',
            'gender'     => 'gender',
        ];

        return (new DTServerSide($request, $data, $normalFields, $sortableColumns))->renderTable();
   }

   public function getArchivedList($request){

       $data = Customer::onlyTrashed()
         ->with(['customer_account' => function ($query) {
            $query->withTrashed();
         }]);

        $normalFields = ['fname','lname','mname','customer_account.email','created_at']; 
        
        $sortableColumns = [
            'id'         => 'id',
            'created_at' => 'created_at',
            'fname'      => 'fname',
            'lname'      => 'lname',
            'mname'      => 'mname',
            'suffix'     => 'suffix',
            'email'      => 'email',
            'gender'     => 'gender',
        ];

        return (new DTServerSide($request, $data, $normalFields, $sortableColumns))->renderTable();
   }

   public function getCustomerDetails($customer_id) {
      
      $user = CustomerAccount::where('customer_id',$customer_id)->first();

      $personalInfo = Customer::findOrFail($customer_id);

      return [
         'personal_info' => [
               'fname' => $personalInfo->fname,
               'lname' => $personalInfo->lname,
               'mname' => $personalInfo->mname,
               'suffix' => $personalInfo->suffix,
               'birthdate' => $personalInfo->birth_date,
               'full_name'=>$personalInfo->full_name,
               'birth_date_format'=>$personalInfo->birth_date_format,
               'gender' => $personalInfo->gender,
               'phone' => $personalInfo->phone,
               'image_cover' => $personalInfo->image_cover,
               'email' => $user->email,
         ]
      ];
   }


   public function updateCustomer($customer_id, array $data){

      $userInfo = Customer::find($customer_id);

      $userInfo->update([
         'fname' => $data['fname'],
         'lname' => $data['lname'],
         'mname' => $data['mname'],
         'suffix' => $data['suffix'],
         'phone' => $data['phone'],
         'gender' => $data['gender'],
         'birth_date' => $data['birthdate'],
         'age' => $data['age'],
         'address' => $data['address'],
      ]);

      $user = CustomerAccount::where('customer_id', $customer_id)->first();
      
      if ($user) {
         $user->update(['email' => $data['email']]);
      }

      return $userInfo->customer_no;
   }

   public function archiveCustomer($customer_id){
      $customer = Customer::findOrFail($customer_id);

      $customer_no = $customer->customer_no;
      
      $customer->delete();

      CustomerAccount::where('customer_id',$customer_id)->delete();

      return $customer_no;
   }

   public function restoreCustomer($customer_id){

        // Restore main user account
        $user = CustomerAccount::withTrashed()->where('customer_id', $customer_id)->firstOrFail();
        
        $user->restore();

        // Restore personal infos
        $personal_info = Customer::withTrashed()->findOrFail($customer_id);

        $personal_info->restore();

        $full_name = $personal_info->full_name;
      
        $personal_info->restore();

        return 'Customer: ' . $full_name;
   }

}
