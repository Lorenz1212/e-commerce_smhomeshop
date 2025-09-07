<?php

namespace App\Services\Admin\Core;

use App\Helpers\DTServerSide;
use App\Models\User;
use App\Models\UserPersonalInfo;
use App\Notifications\ResetPasswordNotification;
use App\Notifications\UserCreatedNotification;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class UserAccountService
{
   public function getUserAccountList($request){

        $data = UserPersonalInfo::with('user')->where('id','!=',1);

        $normalFields = ['fname','lname','mname','user.email','created_at']; 
        
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

       $data = UserPersonalInfo::onlyTrashed()
         ->with(['user' => function ($query) {
            $query->withTrashed();
         }])
         ->where('id', '!=', 1);

        $normalFields = ['fname','lname','mname','user.email','created_at']; 
        
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

   public function getUserAccountDetails($user_id) {
      
      $user = User::with('roles:id,name')->where('user_id',$user_id)->first();

      $personalInfo = UserPersonalInfo::findOrFail($user_id);

      $modules = $user->roles->pluck('name')->filter(fn($r) => in_array($r, ['cashier', 'core']))->values()->all();

      $mainRole = $user->roles->whereNotIn('name', ['core', 'cashier'])->first();

      return [
         'personal_info' => [
               'fname' => $personalInfo->fname,
               'lname' => $personalInfo->lname,
               'mname' => $personalInfo->mname,
               'suffix' => $personalInfo->suffix,
               'birthdate' => $personalInfo->birthdate,
               'full_name'=>$personalInfo->full_name,
               'birth_date_format'=>$personalInfo->birth_date_format,
               'gender' => $personalInfo->gender,
               'contact_no' => $personalInfo->contact_no,
               'address' => $personalInfo->address,
               'image_cover' => $personalInfo->image_cover,
         ],
         'user' => [
               'email' => $user->email,
         ],
         'modules' => $modules,
         'role' => $mainRole->id ?? null,
         'role_name' => $mainRole->name ?? null,
      ];
   }

   public function createUserAccount(array $data){

      $response =  UserPersonalInfo::create([
         'fname'=>$data['fname'],
         'lname'=>$data['lname'],
         'mname'=>$data['mname'],
         'suffix'=>$data['suffix'],
         'contact_no'=>$data['contact_no'],
         'gender'=>$data['gender'],
         'birthdate'=>$data['birthdate'],
         'age'=>$data['age'],
         'address'=>$data['address'],
         'image' => ($data['filename']? $data['filename'][0] :NULL)
      ]);

      $user = User::create([
         'user_id' =>$response->id,
         'email'=>$data['email']
      ]);

      $rolesToAssign = [];

      if (!empty($data['role_id']) && in_array('core', $data['modules'] ?? [])) {
         $roleName = DB::table('roles')->where('id', $data['role_id'])->value('name');
         if ($roleName) {
               $rolesToAssign[] = $roleName;
         }
      }

      if (in_array('cashier', $data['modules'] ?? [])) {
         $rolesToAssign[] = 'cashier';
      }

      if (!empty($rolesToAssign)) {
         $user->assignRole($rolesToAssign);
      }

      $account_no = UserPersonalInfo::find($response->id)->value('account_no');

      if (in_array('core', $rolesToAssign)) {
         $primaryRole = 'core';
      } else {
         $primaryRole = $rolesToAssign[0];
      }

      $user->notify(new UserCreatedNotification($user, $primaryRole));

      return $account_no;
   }

   public function updateUserAccount($user_id, array $data){

      $userInfo = UserPersonalInfo::find($user_id);

      if (!empty($data['filename']) ) {
            $path = 'images/profiles/' . $userInfo->image;

            if (Storage::disk('public')->exists($path)) {
               Storage::disk('public')->delete($path);
            }
      }

      $userInfo->update([
         'fname' => $data['fname'],
         'lname' => $data['lname'],
         'mname' => $data['mname'],
         'suffix' => $data['suffix'],
         'contact_no' => $data['contact_no'],
         'gender' => $data['gender'],
         'birthdate' => $data['birthdate'],
         'age' => $data['age'],
         'address' => $data['address'],
         'image' => !empty($data['filename']) ? $data['filename'][0] : $userInfo->image,
      ]);

      $user = User::where('user_id', $user_id)->first();
      
      if ($user) {
         $user->update(['email' => $data['email']]);
      }

     $rolesToAssign = [];

      if (!empty($data['role_id']) && in_array('core', $data['modules'] ?? [])) {
         $roleName = DB::table('roles')->where('id', $data['role_id'])->value('name');
         if ($roleName) {
            $rolesToAssign[] = $roleName;
         }
      }

      if (in_array('cashier', $data['modules'] ?? [])) {
         $rolesToAssign[] = 'cashier';
      }

      if (!empty($rolesToAssign) && $user) {
         $user->syncRoles($rolesToAssign); // works now
      }

      return $userInfo->account_no;
   }

   public function archiveUserAccount($user_id){

      UserPersonalInfo::findOrFail($user_id)->delete();

      User::where('user_id',$user_id)->delete();

      return true;
   }

   public function blockUserAccount($user_id){

      $query = User::findOrFail($user_id);

      $is_blocked = $query->is_blocked = c('ENUM_NO')? c('ENUM_YES'): c('ENUM_NO');

      $query->update([
         'is_blocked'=> $is_blocked 
      ]);

      return true;
   }

   public function restoreUserAccount($user_id){

        // Restore main user account
        $user = User::withTrashed()->where('user_id', $user_id)->firstOrFail();
        $user->restore();

        // Restore personal infos
        $personal_info = UserPersonalInfo::withTrashed()->findOrFail($user_id);
        $personal_info->restore();

        $full_name = $personal_info->full_name;
      
        $personal_info->restore();

        return 'User: ' . $full_name;
   }

   public function resetUserPassword($user_id){

        $user = User::where('user_id', $user_id)->first();
        
        $password = uniqid();

        $user->update([
            'password'=>Hash::make($password)
        ]);
      
        $user->notify(new ResetPasswordNotification($user,$password));

        return $user->user_info->account_no;
   }  
}
