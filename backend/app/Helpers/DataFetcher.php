<?php

namespace App\Helpers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Exceptions\ExceptionHandler;
use App\Models\Addon;
use App\Models\FeedbackSource;
use App\Models\PermissionParent;
use App\Models\ProductBrand;
use App\Models\ProductCategory;
use App\Models\SentimentModel;
use App\Models\Store;
use App\Models\Supplier;
use App\Models\SystemDefinition;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Spatie\Permission\Models\Role;

class DataFetcher extends Controller {

    public function getSupplier(Request $request){
        try{
            $query = Supplier::query();

            if(isset($request->id)){
                $id = $request->supplier_id;
                $query->where('id',$id);
            }

            $result = $query->get();

            $data = [];
            // $data[] = ['value'=>' ','label'=>'No Trainor'];
            foreach($result as $row){
                $data[] = [
                    'id' => $row->id,
                    'name' => $row->name
                ];
            }

            return response()->json($data,200);
        } catch (\Throwable $e) {
            return ExceptionHandler::handle($e);
        }
    }

    public function getProductCategory(Request $request){
        try{
            $query = ProductCategory::query();

            if(isset($request->id)){
                $id = $request->category_id;
                $query->where('id',$id);
            }

            $result = $query->get();

            $data = [];

            foreach($result as $row){
                $data[] = [
                    'id' => $row->id,
                    'name' => $row->name
                ];
            }

            return response()->json($data,200);
        } catch (\Throwable $e) {
            return ExceptionHandler::handle($e);
        }
    }

    public function getProductBrand(Request $request){
        try{
            $query = ProductBrand::query();

            if(isset($request->id)){
                $id = $request->category_id;
                $query->where('id',$id);
            }

            $result = $query->get();

            $data = [];

            foreach($result as $row){
                $data[] = [
                    'id' => $row->id,
                    'name' => $row->name
                ];
            }

            return response()->json($data,200);
        } catch (\Throwable $e) {
            return ExceptionHandler::handle($e);
        }
    }

    public function getFeedbackSource(){
        try{
            $sources = FeedbackSource::all();

            foreach($sources as $row){
                $data[] = [
                    'id' => $row->id,
                    'name' => $row->name
                ];
            }

            return response()->json($data,200);
        } catch (\Throwable $e) {
            return ExceptionHandler::handle($e);
        }
    }

    public function getHandlerBy(){
        try{
            $handlers  = User::all();
            $data=[];
            foreach($handlers  as $row){
                $data[] = [
                    'id' => $row->id,
                    'name' => $row->user_info->full_name
                ];
            }

            return response()->json($data,200);
        } catch (\Throwable $e) {
            return ExceptionHandler::handle($e);
        }
    }

    public function getSentimentModel(){
         try{
            $activeModel = SentimentModel::latest()->first();

            return response()->json($activeModel,200);
         } catch (\Throwable $e) {
            return ExceptionHandler::handle($e);
        }
    }

    public function getStores(){
        try{
            $handlers  = Store::all();

            foreach($handlers  as $row){
                $data[] = [
                    'id' => $row->id,
                    'name' => $row->name
                ];
            }

            return response()->json($data,200);
        } catch (\Throwable $e) {
            return ExceptionHandler::handle($e);
        }
    }

    public function getAddons(){
         try{
            $result = Addon::all();

            $data=[];
            foreach($result  as $row){
                $data[] = [
                    'id' => $row->id,
                    'name' => $row->name,
                    'base_price'=>$row->base_price,
                    'is_freebies'=>$row->is_freebies
                ];
            }

            return response()->json($data,200);
         } catch (\Throwable $e) {
            return ExceptionHandler::handle($e);
        }
    }

    public function getPermissions(){
        try {
            $permissionParents = PermissionParent::with('permissions')->get();

            $data = [];
            foreach ($permissionParents as $permissionParent) {
                $data[] = [
                    'id'   => $permissionParent->id,
                    'name' => $permissionParent->name,
                    'permissions' => $permissionParent->permissions->map(function ($item) {
                        return [
                            'id'   => $item->id,
                            'name' => $item->description,
                        ];
                    }),
                ];
            }

            return response()->json($data, 200);
        } catch (\Throwable $e) {
            return ExceptionHandler::handle($e);
        }
    }

    public function getRoles(){
        try {
            $roles = Role::whereNotIn('name',['core','cashier'])->get();

            $data = [];
            foreach ($roles as $role) {
                $data[] = [
                    'id' => $role->id,
                    'name' => $role->name
                ];
            }

            return response()->json($data, 200);
        } catch (\Throwable $e) {
            return ExceptionHandler::handle($e);
        }
    }

    public function getAllDefiners()
    {
         try {
            
            $definers = Cache::remember('all_definers', 3600, function () {
                return SystemDefinition::where('is_active', 'Y')
                    ->get(['name_code', 'value', 'description'])
                    ->keyBy('name_code');
            });

            return response()->json($definers, 200);
        } catch (\Throwable $e) {
            return ExceptionHandler::handle($e);
        }
      
    }
}