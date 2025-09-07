<?php

namespace App\Helpers;

use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use App\Exceptions\ExceptionHandler;
use App\Traits\Encryption;
use App\Http\Controllers\Controller;
use App\Models\AddressRegion;
use App\Models\AddressProvince;
use App\Models\AddressCity;
use App\Models\AddressBrgy;

class AddressHelper extends Controller{

    use Encryption;

    public function getRegions(Request $request){
        try{
            $query = AddressRegion::query();

            if(isset($request->id)){
                $id = $this->decrypt_string($request->id);
                $query->where('id',$id);
            }

            $result = $query->get();

            $data = [];
            $data[] = ['value'=>'','label'=>'Select Region'];
            foreach($result as $row){
                $data[] = [
                    'value' => $row->region_code,
                    'label' => $row->region_description
                ];
            }

            return response()->json($data,200);
        } catch (\Throwable $e) {
            return $this->ExceptionHandler($e);
        }
    }

    public function getProvinces(Request $request){
        try{
            $data = [];
            if(!$request->region_code){
                $data[] = ['value'=>'','label'=>'Select Region First'];
                return response()->json($data,200);
            }
            $region_code = $request->region_code;

            $query = AddressProvince::query();

            $query->where('region_code',$region_code);

            if(isset($request->id)){
                $id = $this->decrypt_string($request->id);
                $query->where('id',$id);
            }
        
            $result = $query->get();
            
            $data[] = ['value'=>'','label'=>'Select Province'];
            foreach($result as $row){
                $data[] = [
                    'value' => $row->province_code,
                    'label' => $row->province_description
                ];
            }

            return response()->json($data,200);
        } catch (\Throwable $e) {
            return $this->ExceptionHandler($e);
        }
    }

    public function getCities(Request $request){
        try{
            $data = [];
            if(!$request->province_code){
                $data[] = ['value'=>'','label'=>'Select Province First'];
                return response()->json($data,200);
            }
            $province_code = $request->province_code;

            $query = AddressCity::query();

            $query->where('province_code',$province_code);

            if(isset($request->id)){
                $id = $this->decrypt_string($request->id);
                $query->where('id',$id);
            }

            $result = $query->get();

            $data = [];
            $data[] = ['value'=>'','label'=>'Select City'];
            foreach($result as $row){
                $data[] = [
                    'value' => $row->city_municipality_code,
                    'label' => $row->city_municipality_description
                ];
            }

            return response()->json($data,200);
        } catch (\Throwable $e) {
            return $this->ExceptionHandler($e);
        }
    }

    public function getBrgy(Request $request){
        try{
            $data = [];
            if(!$request->city_code){
                $data[] = ['value'=>'','label'=>'Select City First'];
                return response()->json($data,200);
            }

            $query = AddressBrgy::query();

            $query->where('city_municipality_code',$request->city_code);

            if(isset($request->id)){
                $id = $this->decrypt_string($request->id);
                $query->where('id',$id);
            }

            $result = $query->get();

            $data = [];
            $data[] = ['value'=>'','label'=>'Select Barangay'];
            foreach($result as $row){
                $data[] = [
                    'value' => $row->barangay_code,
                    'label' => $row->barangay_description
                ];
            }

            return response()->json($data,200);
        } catch (\Throwable $e) {
            return $this->ExceptionHandler($e);
        }
    }

    public function getFullAddress($additional_address, $addressWhere){
        try {
            $addressFields = [
                'region' => ['model' => AddressRegion::class, 'column_name' => 'region_description'],
                'province' => ['model' => AddressProvince::class, 'column_name' => 'province_description'],
                'city' => ['model' => AddressCity::class, 'column_name' => 'city_municipality_description'],
                'brgy' => ['model' => AddressBrgy::class, 'column_name' => 'barangay_description'],
            ];

            $address = [];

            foreach ($addressFields as $field => $row) {
                $id = $addressWhere[$field] ?? null; // Check if ID exists

                if ($id) {
                    $address[$field] = $row['model']::where($row['model']::CODE_COLUMN, $id)->value($row['column_name']) ?? 'Unknown';
                } else {
                    $address[$field] = 'Unknown'; // Default if no ID
                }
            }

            // Format final address properly
            $data = trim("{$additional_address}, {$address['brgy']}, {$address['city']}, {$address['province']}, {$address['region']}");

            return $data;

        } catch (\Throwable $e) {
            return $this->ExceptionHandler($e);
        }
    }

    public function SetAddressIds($request): void {
        $addressFields = [
            'region' => AddressRegion::class,
            'province' => AddressProvince::class,
            'city' => AddressCity::class,
            'brgy' => AddressBrgy::class,
        ];

        foreach ($addressFields as $field => $model) {
            $request->merge([$field => $this->FindAddressId($request->input($field), $model, $field)]);
        } 
    }

    private function FindAddressId($code, $model, $field){
        if (!$code) return null;

        try {
            return $model::where($model::CODE_COLUMN, $code)->value('id');
        } catch (\Exception $e) {
            throw ValidationException::withMessages([$field => "Invalid $field data."]);
        }
    }

    public function SetAddressCode($itemArray): void {
        $addressFields = [
            'region' => AddressRegion::class,
            'province' => AddressProvince::class,
            'city' => AddressCity::class,
            'brgy' => AddressBrgy::class,
        ];

        foreach ($addressFields as $field => $model) {
            $itemArray->{$field} = $this->EncryptedAndFindId($itemArray->{$field}, $model, $field);
        }
    }

    private function EncryptedAndFindId($id, $model, $field){
        try {
            return $model::where('id', $id)->value($model::CODE_COLUMN);
        } catch (\Exception $e) {
            return $this->ExceptionHandler($e);
        }
    }
}