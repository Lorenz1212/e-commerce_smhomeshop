<?php

namespace App\Services;

use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\RateLimiter;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Str;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class AuthCashierService
{
    public function login(array $data)
    {
        $key = 'cashier_login_attempts:' . strtolower($data['email']) . '|' . request()->ip();

        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);
            throw ValidationException::withMessages([_lang_message('login_attempt', ['item' => $seconds . ' seconds.'])]);
        }

        $user = User::where('email', $data['email'])->first();

        if (!$user || !Hash::check($data['password'], $user->password)) {
            RateLimiter::hit($key, 60);
            throw ValidationException::withMessages([_lang_message('incorrect_credential')]);
        }

        if ($user->trashed()) {
            throw ValidationException::withMessages([_lang_message('inactive_account')]);
        }

        if (empty($user->email_verified_at)) {
            throw ValidationException::withMessages([_lang_message('unverified_account')]);
        }

        Auth::shouldUse('cashier');

        Auth::guard('cashier')->setUser($user);

        $token = $user->createToken('Cashier Token: ' . $user->user_info->account_no)->accessToken;

        RateLimiter::clear($key);

        return [
            'api_token' => $token,
        ];
    }

    public function verifyOTP($request)
    {
        $email = $request->email;
        $key = "otp_cashier_{$email}";
        $cachedOtp = Cache::get($key);

        if (!$cachedOtp || $cachedOtp != $request->otp) {
            throw ValidationException::withMessages(['Invalid or expired OTP. Please request a new one.']);
        }

        Cache::forget($key);

        $resetToken = Str::uuid()->toString(); // or Str::random(60)

        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $email],
            [
                'token' => Hash::make($resetToken), // hash for security
                'created_at' => now()
            ]
        );

        return $resetToken;
    }

    public function sendOTP($request){
        $email = $request->email;
        $otp = rand(100000, 999999); // 6-digit OTP
        $key = "otp_cashier_{$email}";

        // Save OTP in cache with 5 minutes expiration
        Cache::put($key, $otp, now()->addMinutes(5));

        $user =  User::where('email',$email)->first();

        // Send OTP to user's email
        Mail::to($email)->queue(new \App\Mail\SendOtpMail($user->user_info->fname,$otp));

        return true;
    }

    public function resetPassword($request)
    {
        // Kunin lahat ng reset token entries
        $records = DB::table('password_reset_tokens')->get();

        // Hanapin kung saan nagma-match yung token
        $record = $records->first(function ($r) use ($request) {
            return Hash::check($request->token, $r->token);
        });

        if (!$record) {
            throw ValidationException::withMessages(['Invalid or expired reset token.']);
        }

        // Check expiration (10 minutes validity)
        if (Carbon::parse($record->created_at)->addMinutes(10)->isPast()) {
            throw ValidationException::withMessages(['Reset token expired.']);
        }

        // Update password
        $user = User::where('email', $record->email)->first();
        $user->password = Hash::make($request->new_password);
        $user->save();

        // Delete used token
        DB::table('password_reset_tokens')->where('email', $record->email)->delete();

        return true;
    }

    public function setupPassword($request)
    {
        $account = User::where('creation_token', $request->token)->first();

        if (! $account) {
            throw ValidationException::withMessages(['Invalid or expired validation link.']);
        }  
        
        if ($account->email_verified_at) {
            throw ValidationException::withMessages(['Your account is already verified.']);
        }

        $account->email_verified_at = now();
        $account->password = Hash::make($request->new_password);
        $account->creation_token = null;
        $account->save();

        return true;
    }
}
