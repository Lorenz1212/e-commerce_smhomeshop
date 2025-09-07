<?php

namespace App\Http\Controllers\API\Auth;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Illuminate\Foundation\Auth\ThrottlesLogins;
use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Illuminate\Validation\ValidationException;
use App\Services\AuthCustomerService;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\CustomerRegistrationRequest;
use App\Models\CustomerAccount;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class CustomerLoginController extends Controller
{
    use ApiResponse;

    protected $authService;

    public function __construct(AuthCustomerService $authService)
    {
        $this->authService = $authService;
    }

    public function login(LoginRequest $request)
    {
        try {
            $validated = $request->validated();

            $response = $this->authService->login($validated);
            
            return $this->success($response, _lang_message('login_success'));

        } catch (\Throwable $e) {
            return $this->ExceptionHandler($e);
        }
    }

    public function me()
    {
        try {
            $user = Auth::guard('customer')->user();

            $user = CustomerAccount::with('customer')->find($user->id);
  
            if (!$user) {
                throw ValidationException::withMessages([_lang_message('invalid_token')]);
            }

            return $this->returnData([
                'user' => [
                    'id' => $user->id_encrypted??null,
                    'account_no' => $user->customer->account_no ??null,
                    'email' => $user->email??null,
                    'first_name' => $user->customer->fname??null,
                    'last_name' => $user->customer->lname??null,
                    'suffix' => $user->user_icustomernfo->suffix??null,
                    'fullname' => $user->customer->full_name ?? null??null,
                    'gender_text_format' => $user->customer->gender_text_format??null,
                    'gender' => $user->customer->gender??null,
                    'birthdate' => $user->customer->birth_date_formatted??null,
                    'age' => $user->customer->age??null,
                    'contact_no' => $user->customer->contact_no ?? null,
                    'roles' => $user->roles->pluck('id')->toArray(),
                    'image' => $user->customer->image_cover ?? null,
                    'address' => $user->customer->address ?? null,
                ]
            ]);

        } catch (\Throwable $e) {
            return $this->ExceptionHandler($e);
        }
    }

    public function logout(Request $request)
    {
        $token = $request->user()->token();

        $token->delete();

        return $this->success(false, _lang_message('logout_success'));
    }

    public function register(CustomerRegistrationRequest $request){
        try {
            DB::beginTransaction();

            $validated = $request->validated();

            $this->authService->register($validated);

            DB::commit();

            return $this->success(false, _lang_message('registration_success'));

        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->ExceptionHandler($e);
        }
    }

    public function changePassword(Request $request)
    {
         try {
            DB::beginTransaction();
            
            $request->validate([
                'current_password' => 'required',
                'new_password' => 'required|min:6|confirmed',
            ]);

            $user = Auth::guard('customer')->user();

            if (!Hash::check($request->current_password, $user->password)) {
                return $this->success(false, 'Current password is incorrect');
            }

            $user->password = bcrypt($request->new_password);
            $user->save();

            DB::commit();

            return $this->success(false, _lang_message('password_changed'));

         } catch (\Throwable $e) {
            DB::rollBack();
            return $this->ExceptionHandler($e);
        }
    }

    public function forgot_password(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email|exists:customer_accounts,email',
            ]);

            $response = $this->authService->sendOTP($request);
            
            return $this->success($response, _lang_message('send_otp'));

        } catch (\Throwable $e) {
            return $this->ExceptionHandler($e);
        }
    }

    public function verifyOTP(Request $request){
        try {
            DB::beginTransaction();

            $request->validate([
                'email' => 'required|email|exists:customer_accounts,email',
                'otp'   => 'required|digits:6',
            ]);

            $response = $this->authService->verifyOTP($request);

            DB::commit();

            return $this->success($response, _lang_message('password_changed'));

        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->ExceptionHandler($e);
        }
    }

    public function resendOTP(Request $request){
        try {
            DB::beginTransaction();

            $request->validate([
                'email' => 'required|email|exists:customer_accounts,email',
            ]);

            $response = $this->authService->sendOTP($request);

            DB::commit();

            return $this->success($response, _lang_message('send_otp'));

        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->ExceptionHandler($e);
        }
    }

    public function resetPassword(Request $request)
    {
        try {
            DB::beginTransaction();

            $request->validate([
                'email' => 'required|email|exists:customer_accounts,email',
                'token' => 'required',
                'new_password' => 'required|min:6|confirmed',
            ]);

            $response = $this->authService->resetPassword($request);

            DB::commit();

            return $this->success($response, _lang_message('password_changed'));

        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->ExceptionHandler($e);
        }
    }
}
