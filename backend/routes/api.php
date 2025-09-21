<?php

use App\Helpers\DataFetcher;
use App\Http\Controllers\API\Auth\AdminLoginController;
use App\Http\Controllers\API\Auth\CashierLoginController;
use App\Http\Controllers\API\Auth\CustomerLoginController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    
    Route::prefix('admin')->group(function () {
         Route::middleware('throttle:60,1')->group(function () {
            Route::post('/login', [AdminLoginController::class, 'login']);
            Route::post('/setup_password', [AdminLoginController::class, 'setupPassword']);
            Route::post('/forgot_password', [AdminLoginController::class, 'forgot_password']);
            Route::post('/reset_password', [AdminLoginController::class, 'resetPassword']);
            Route::post('/verify_otp', [AdminLoginController::class, 'verifyOTP']);
            Route::post('/resend_otp', [AdminLoginController::class, 'resendOTP']);
         });

         Route::middleware(['auth:core','throttle:100,1'])->group(function () {
            Route::post('/logout', [AdminLoginController::class, 'logout']);
            Route::post('/me', [AdminLoginController::class, 'me']);
            Route::post('/update_email', [AdminLoginController::class, 'updateEmail']);
            Route::post('/change_password', [AdminLoginController::class, 'changePassword']);
         });
    });

    Route::prefix('cashier')->group(function () {
         Route::middleware('throttle:60,1')->group(function () {
            Route::post('/login', [CashierLoginController::class, 'login']);
            Route::post('/setup_password', [CashierLoginController::class, 'setupPassword']);
            Route::post('/forgot_password', [CashierLoginController::class, 'forgot_password']);
            Route::post('/reset_password', [CashierLoginController::class, 'resetPassword']);
            Route::post('/verify_otp', [CashierLoginController::class, 'verifyOTP']);
            Route::post('/resend_otp', [CashierLoginController::class, 'resendOTP']);
         });

         Route::middleware(['auth:cashier','throttle:100,1'])->group(function () {
            Route::post('/logout', [CashierLoginController::class, 'logout']);
            Route::post('/me', [CashierLoginController::class, 'me']);
         });
    });

    Route::prefix('customer')->group(function () {
         Route::middleware('throttle:60,1')->group(function () {
            Route::post('/login', [CustomerLoginController::class, 'login']);
            Route::post('/register', [CustomerLoginController::class, 'register']);
            Route::post('/forgot_password', [CustomerLoginController::class, 'forgot_password']);
            Route::post('/reset_password', [CustomerLoginController::class, 'resetPassword']);
            Route::post('/verify_otp', [CustomerLoginController::class, 'verifyOTP']);
            Route::post('/resend_otp', [CustomerLoginController::class, 'resendOTP']);
         });

         Route::middleware(['auth:customer','throttle:100,1'])->group(function () {
            Route::post('/logout', [CustomerLoginController::class, 'logout']);
            Route::get('/me', [CustomerLoginController::class, 'me']);
            Route::post('/change_password', [CustomerLoginController::class, 'changePassword']);
            Route::post('/profile', [CustomerLoginController::class, 'profile']);
         });
    });

    Route::middleware(['auth:core', 'auth:cashier','throttle:100,1'])->group(function () {
         Route::middleware('throttle:60,1')->group(function () {
            Route::get('/supplier', [DataFetcher::class, 'getSupplier']);
            Route::get('/category', [DataFetcher::class, 'getProductCategory']);
            Route::get('/feedback_source', [DataFetcher::class, 'getFeedbackSource']);
            Route::get('/handle_by', [DataFetcher::class, 'getHandlerBy']);
            Route::get('/sentimentModel', [DataFetcher::class, 'getSentimentModel']);
            Route::get('/store', [DataFetcher::class, 'getStores']);
            Route::get('/addons', [DataFetcher::class, 'getAddons']);
            Route::get('/brands', [DataFetcher::class, 'getProductBrand']);
            Route::get('/definers', [DataFetcher::class, 'getAllDefiners']);
         });
    });
});
