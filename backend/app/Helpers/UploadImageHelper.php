<?php

namespace App\Helpers;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;


class UploadImageHelper extends Controller{

    public function uploadImage($file,$path){
          // Handle image upload, resizing, and renaming 
          if ($file) {
                $timestamp = Carbon::now()->format('YmdHis');

                $customFilename =  $timestamp . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                
                // Store the image in the public disk
                $file->storeAs($path, $customFilename, 'public');

                // Merge the image path into the request data
                return $customFilename;
            }
    }

    public function uploadImageAndResize($file,$path){
         // Handle image upload, resizing, and renaming it
         if ($file) {
            $timestamp = Carbon::now()->format('Y-m-d_H-i-s');
            $randomString = Str::random(5);
            
            // Generate custom filename
            $customFilename = "{$timestamp}_{$randomString}." . $file->getClientOriginalExtension();

            //Resize the image and adjust quality
            $imageResize = Image::make($file)->resize(800, null, function ($constraint) {
                $constraint->aspectRatio();  // Keep the aspect ratio
                $constraint->upsize(); // Prevent upsizing
            })->encode($file->getClientOriginalExtension(), 85); // Adjust the quality (85%)

            // Store the image in the public disk
            $imageResize->storeAs($path, $customFilename, 'public');

            // Merge the image path into the request data
            return $customFilename;
        }
    }

    public function processFileUpload($request, $uploadPath, $fileInputName, $targetField, $imageResize = false)
    {
        $uploadedFiles = $request->file($fileInputName);

        if (!$uploadedFiles) {
            return;
        }

        $filenames = [];

        if (is_array($uploadedFiles)) {
            foreach ($uploadedFiles as $file) {
                $filename = $imageResize
                    ? $this->uploadImageAndResize($file, $uploadPath)
                    : $this->uploadImage($file, $uploadPath);

                $filenames[] = $filename;
            }
        } else {
            $filename = $imageResize
                ? $this->uploadImageAndResize($uploadedFiles, $uploadPath)
                : $this->uploadImage($uploadedFiles, $uploadPath);

            $filenames[] = $filename; // Ensure it's always an array
        }

        $request->merge([$targetField => $filenames]);
    }


    // public function processFileUpload($request,$uploadPath,$fileInputName ,$targetField,$modelInstance=false,$id=false,$imageResize=false)
    // {
    //     if ($file = $request->file($fileInputName)) {
    //         if($id){
    //             $setOldImage = $this->getOldImage($id,$modelInstance,$targetField);
    //             if(Storage::disk('public')->exists($uploadPath.'/'.$setOldImage)){
    //                 Storage::disk('public')->delete($uploadPath.'/'.$setOldImage);
    //             }
    //         }
    //         if($imageResize){
    //             $customFilename = $this->uploadImageAndResize($file,$uploadPath);
    //         }else{
    //             $customFilename = $this->uploadImage($file, $uploadPath);
    //         }
           
    //         $request->merge([$targetField => $customFilename]);
    //     }else{
    //         if($id){
    //             $setOldImage = $this->getOldImage($id,$modelInstance,$targetField);
    //             $request->merge([$targetField => $setOldImage]);
    //         }
    //     }
    // }
}