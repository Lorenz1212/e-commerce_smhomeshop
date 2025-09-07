<?php
namespace App\Traits;

trait ApiResponse
{
    protected function success($data, $message = '', $code = 200)
    {
        return response()->json(['status' => 'success', 'message' => $message, 'result' => $data], $code);
    }

    protected function error($message, $code = 400)
    {
        return response()->json(['status' => 'error', 'message' => $message], $code);
    }

    protected function returnData($data, $code = 200)
    {
        return response()->json($data, $code);
    }
}
