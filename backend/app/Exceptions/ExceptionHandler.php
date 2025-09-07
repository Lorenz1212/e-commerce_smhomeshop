<?php
namespace App\Exceptions;

use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Illuminate\Http\JsonResponse;

class ExceptionHandler
{
    /**
     * Handle exceptions and return a standardized JSON response.
     *
     * @param \Throwable $e
     * @return JsonResponse
     */
    public static function handle(\Throwable $e)
    {
        // Handle ValidationException
        if ($e instanceof ValidationException) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }

        // Handle HttpException (for HTTP-related errors)
        if ($e instanceof HttpException) {
            return response()->json([
                'message' => $e->getMessage(),
            ], $e->getStatusCode());
        }
        return response()->json([
            'message' => $e->getMessage(),
        ], 500);

        // Handle general exceptions
        // return response()->json([
        //     'message' => 'An unexpected error occurred',
        // ], 500);
    }
}
