<?php

namespace App\Http\Controllers\API\Auth;

use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;

use App\Services\AuthCashierService;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class CashierLoginController extends Controller
{
    use ApiResponse;

    protected $authService;

    public function __construct(AuthCashierService $authService)
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
            $user = Auth::guard('cashier')->user();

            $user = User::with('user_info')->find($user->id);
  
            if (!$user) {
                throw ValidationException::withMessages([_lang_message('invalid_token')]);
            }

            return $this->returnData([
                    'user' => [
                        'id' => $user->id_encrypted??null,
                        'account_no' => $user->user_info->account_no ??null,
                        'email' => $user->email??null,
                        'first_name' => $user->user_info->fname??null,
                        'last_name' => $user->user_info->lname??null,
                        'suffix' => $user->user_info->suffix??null,
                        'fullname' => $user->user_info->full_name ?? null??null,
                        'gender_text_format' => $user->user_info->gender_text_format??null,
                        'gender' => $user->user_info->gender??null,
                        'birthdate' => $user->user_info->birth_date_format??null,
                        'age' => $user->user_info->age??null,
                        'contact_no' => $user->user_info->contact_no ?? null,
                        'roles' => $user->roles->pluck('id')->toArray(),
                        'image' => $user->user_info->image_cover ?? null,
                        'address' => $user->user_info->address ?? null,
                    ]
            ]);

        } catch (\Throwable $e) {
            return $this->ExceptionHandler($e);
        }
    }

    public function logout(Request $request)
    {
        // Get the authenticated user's token
        
        $token = $request->user()->token();

        // Revoke the token
        $token->delete();

        return $this->success(false, _lang_message('logout_success'));
    }

    public function forgot_password(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email|exists:users,email',
            ]);

            $response = $this->authService->sendOTP($request);
            
            return $this->success($response, _lang_message('send_otp'));

        } catch (\Throwable $e) {
            return $this->ExceptionHandler($e);
        }
    }

    public function verifyOTP(Request $request)
    {
        try {
            DB::beginTransaction();

            $request->validate([
                'email' => 'required|email|exists:users,email',
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
                'email' => 'required|email|exists:users,email',
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

    public function setupPassword(Request $request)
    {
        try {
            DB::beginTransaction();

            $request->validate([
                'token' => 'required',
                'new_password' => 'required|min:6|confirmed',
            ]);

            $response = $this->authService->setupPassword($request);

            DB::commit();

            return $this->success($response, _lang_message('password_setup'));

        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->ExceptionHandler($e);
        }
    }
}
