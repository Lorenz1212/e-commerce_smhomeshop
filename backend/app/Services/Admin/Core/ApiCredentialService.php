<?php

namespace App\Services\Admin\Core;

use App\Helpers\DTServerSide;
use App\Models\ApiCredetial;
use App\Models\User;
use App\Models\UserPersonalInfo;

class ApiCredentialService
{
   public function getlistApiCredential($request){

        $data = ApiCredetial::query();

        $normalFields = ['platform','access_token','refresh_token', 'expires_at','created_at']; 
        
        $sortableColumns = [
            'created_at'      => 'created_at',
            'platform'        => 'platform',
            'access_token'    => 'access_token',
            'refresh_token'   => 'refresh_token',
            'expires_at'      => 'expires_at', 
        ];

        return (new DTServerSide($request, $data, $normalFields, $sortableColumns))->renderTable();
   }

   public function getUserAccountDetails($user_id){

      $response = ApiCredetial::findOrFail($user_id);

      return $response;
   }

   public function createUserAccount($request){

      $response =  ApiCredetial::create($request);
    
      return $response;
   }

   public function updateUserAccount($api_id, $request){

      $response =  ApiCredetial::findOrFail($api_id)->update($request);

      return $response;
   }

   public function deleteUserAccount($api_id){

      ApiCredetial::findOrFail($api_id)->delete();
      return true;
   }

   public function restoreUserAccount($api_id){

        $user = User::withTrashed()->where('api_id', $api_id)->firstOrFail();
        $user->restore();

        return true;
   }
}
