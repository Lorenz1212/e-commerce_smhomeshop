<?php

namespace App\Http\Controllers\API\Auth;

use Illuminate\Validation\ValidationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Traits\ApiResponse;
use App\Services\AuthAdminService;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use Carbon\Carbon;

class AdminLoginController extends Controller
{
    use ApiResponse;

    protected $authService;

    public function __construct(AuthAdminService $authService)
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
            $user = Auth::guard('core')->user();

            $user = User::with('user_info')->find($user->id);
  
            if (!$user) {
                throw ValidationException::withMessages([_lang_message('invalid_token')]);
            }

            $mainRole = $user->roles->pluck('name')->first();
             
            $modules = ['core','cashier'];

            if($mainRole !== 'core'){
                $modules = $user->roles->pluck('name')->filter(fn($r) => in_array($r, ['cashier', 'core']))->values()->all();
                $mainRole = $user->roles->whereNotIn('name', ['core', 'cashier'])->pluck('name')->first();
            }

            $permissions = $user->getAllPermissions()->pluck('name');

            return $this->returnData([
                'user' => [
                    'id' => $user->id_encrypted??null,
                    'account_no' => $user->user_info->account_no ??null,
                    'email' => $user->email??null,
                    'fullname' => $user->user_info->full_name ?? null??null,
                    'gender' => $user->user_info->gender_text_format??null,
                    'birthdate' => $user->user_info->birth_date_format??null,
                    'age' =>  Carbon::parse($user->user_info->birthdate)->age??null,
                    'contact_no' => $user->user_info->contact_no ?? null,
                    'modules'=> $modules,
                    'role_name' => $mainRole,
                    'image' => $user->user_info->image_cover ?? null,
                    'address' => $user->user_info->address ?? null,
                    'permissions'=>$permissions??null,
                ]
            ]);

        } catch (\Throwable $e) {
            return $this->ExceptionHandler($e);
        }
    }

    public function logout(Request $request)
    {
        $user = $request->user('core');

        $user->token()->revoke();

        return $this->success(false, _lang_message('logout_success'));
    }

    public function getUserInfo(){

        $user = Auth::guard('core')->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        return response()->json($user);
    }


    public function updateEmail(Request $request)
    {
        try {
            DB::beginTransaction();

            $request->validate([
                'email' => 'required|email',
                'confirm_password' => 'required|min:8',
            ]);

            $response = $this->authService->updateEmail($request);

            DB::commit();

            return $this->success($response, _lang_message('email_changed'));

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

            $this->authService->changePassword($request);

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

    public function resendOTP(Request $request)
    {
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
