<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use App\Exceptions\ExceptionHandler;
use App\Traits\Encryption;
use App\Traits\ApiResponse;
use Illuminate\Support\Facades\Log;

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests, Encryption, ApiResponse;

    public function ExceptionHandler($message){
        return ExceptionHandler::handle($message);
    }

    public function LogMessage($status, $message)
    {
        if (method_exists(Log::class, $status)) {
            return call_user_func([Log::class, $status], $message);
        }

        // fallback kung invalid status
        return Log::error($message);
    }
}
