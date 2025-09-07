<?php

namespace App\Services;

use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\Customer;
use App\Models\CustomerAccount;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;

class AuthCustomerService
{
    public function register(array $data)
    {
        $customer = Customer::create([
            'fname'=>$data['fname'],
            'lname'=>$data['lname'],
            'mname'=>$data['mname'],
            'gender'=>$data['gender'],
            'phone'=>$data['contact_number'],
            'birth_date'=>$data['birthdate']
        ]);

        $response = CustomerAccount::create([
            'customer_id' => $customer->id,
            'email'=> $data['email'],
            'password'=> $data['password']
        ]);

        return $response;
    }

    public function login(array $data)
    {
        $key = 'customer_login_attempts:' . strtolower($data['email']) . '|' . request()->ip();

        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);
            throw ValidationException::withMessages([_lang_message('login_attempt', ['item' => $seconds . ' seconds.'])]);
        }

        Auth::shouldUse('customer');

        $user = CustomerAccount::where('email', $data['email'])->first();

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

        Auth::guard('customer')->setUser($user);

        $token = $user->createToken('Customer Token: ' . $user->customer->customer_no)->accessToken;

        RateLimiter::clear($key);

        return [
            'token' => $token,
            'user'  => $user->customer
        ];
    }

    public function verifyOTP($request){

        $email = $request->email;
        $key = "otp_{$email}";
        $cachedOtp = Cache::get($key);

        if (!$cachedOtp || $cachedOtp != $request->otp) {
            throw ValidationException::withMessages(['Invalid or expired OTP. Please request a new one.']);
        }

        // OTP valid -> delete it to prevent reuse
        Cache::forget($key);

        // Generate temporary reset token (valid for 10 minutes)
        $resetToken = Str::random(60);
        Cache::put("reset_token_{$email}", $resetToken, now()->addMinutes(10));

        return $resetToken;

    }

    public function sendOTP($request){
        $email = $request->email;
        $otp = rand(100000, 999999); // 6-digit OTP
        $key = "otp_{$email}";

        // Save OTP in cache with 5 minutes expiration
        Cache::put($key, $otp, now()->addMinutes(5));

        $user =  CustomerAccount::where('email',$email)->first();

        // Send OTP to user's email
        Mail::to($email)->queue(new \App\Mail\SendOtpMail($user->customer->fname,$otp));

        return true;
    }

    public function resetPassword($request)
    {
        $email = $request->email;
        $key = "reset_token_{$email}";
        $cachedToken = Cache::get($key);

        if (!$cachedToken || $cachedToken != $request->token) {
            throw ValidationException::withMessages(['Invalid or expired reset token.']);
        }

        // Update user password
        $user = CustomerAccount::where('email', $email)->first();
        $user->password = Hash::make($request->new_password);
        $user->save();

        // Clear token after use
        Cache::forget($key);

        return true;
    }
}
