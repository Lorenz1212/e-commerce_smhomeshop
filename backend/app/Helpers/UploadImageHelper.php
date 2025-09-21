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

   public function  processFileUpload($request, $uploadPath, $fileInputName, $targetField, $imageResize = false)
   {
        $uploadedFiles = $request->file($fileInputName);
     
        if (!$uploadedFiles) {
            return;
        }

        // ✅ Case 1: Multiple flat uploads (e.g. images[])
        if (is_array($uploadedFiles) && isset($uploadedFiles[0]) && $uploadedFiles[0] instanceof \Illuminate\Http\UploadedFile) {
            $filenames = [];

            foreach ($uploadedFiles as $file) {
                $filenames[] = $imageResize
                    ? $this->uploadImageAndResize($file, $uploadPath)
                    : $this->uploadImage($file, $uploadPath);
            }

            $request->merge([$targetField => $filenames]);
            return;
        }

        // ✅ Case 2: Single file upload (e.g. profile_image or a single variant.image)
        if ($uploadedFiles instanceof \Illuminate\Http\UploadedFile) {
            $filename = $imageResize
                ? $this->uploadImageAndResize($uploadedFiles, $uploadPath)
                : $this->uploadImage($uploadedFiles, $uploadPath);

            return $filename;
        }
           
        // ✅ Case 3: Nested uploads (e.g. variants.*.image)
        if (is_array($uploadedFiles)) {
            $filename = [];
            foreach ($uploadedFiles as $index => $file) {
                if ($file instanceof \Illuminate\Http\UploadedFile) {
                    $filename[] = $imageResize
                        ? $this->uploadImageAndResize($file, $uploadPath)
                        : $this->uploadImage($file, $uploadPath);

                }
            }

            return $filename;
        }
    }

}