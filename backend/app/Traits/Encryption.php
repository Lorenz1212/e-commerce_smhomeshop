<?php

namespace App\Traits;

use Illuminate\Support\Facades\Crypt;

use Illuminate\Support\Facades\DB;

trait Encryption
{
    public static function encrypt_string($value)
    {
        return base64_encode(Crypt::encryptString($value));
    }

    public static function decrypt_string($value)
    {   
        return Crypt::decryptString(base64_decode($value));
    }

    public static function aes_encrypt($value)
    {
        $encryptedData = DB::selectOne("SELECT encryptionHelper(?, ?) AS encrypted_data", ['encrypt',$value]);

        if (!$encryptedData || !isset($encryptedData->encrypted_data)) {
            throw new \Exception('Encryption failed.');
        }

        return $encryptedData->encrypted_data;
    }
    
    public static function aes_decrypt($value)
    {
        if (is_null($value) || $value === '') {
            return null; // Or return an empty string, depending on your logic.
        }
        
        $decryptedData = DB::selectOne("SELECT CAST(encryptionHelper(?, ?) AS CHAR) AS decrypted_data", ['decrypt',$value]);

        return $decryptedData->decrypted_data;
    }
}