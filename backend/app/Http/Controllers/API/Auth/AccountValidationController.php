<?php

namespace App\Http\Controllers\API\Auth;

use App\Models\User;
use App\Models\CustomerAccount;
use App\Http\Controllers\Controller;

class AccountValidationController extends Controller
{
    public function verifyEmail($token)
    {
        // Try find in User then CustomerAccount
        $account = User::where('creation_token', $token)->first()
            ?? CustomerAccount::where('creation_token', $token)->first();

        if (! $account) {
            return response()->view('auth.validate-result', [
                'status' => 'error',
                'message' => 'Invalid or expired validation link.'
            ], 404);
        }

        // If already verified
        if ($account->email_verified_at) {
            return view('auth.validate-result', [
                'status' => 'info',
                'message' => 'Your account is already verified.'
            ]);
        }

        // Mark verified
        $account->email_verified_at = now();
        $account->creation_token = null; // prevent reuse
        $account->save();

        return view('auth.validate-result', [
            'status' => 'success',
            'message' => 'Your account has been verified. You may now login.'
        ]);
    }
}
