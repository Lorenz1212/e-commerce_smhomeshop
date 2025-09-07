<?php

use App\Http\Controllers\API\Auth\AccountValidationController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/validate-account/{token}', [AccountValidationController::class, 'verifyEmail'])->name('validate-account');

Route::get('/download-app-android', function () {
    $file = public_path('downloads/android/bestea-app.apk');

    if (file_exists($file)) {
        return response()->download($file, 'bestea-app.apk');
    }

    abort(404);
});

Route::get('/clear-cache', function () {
    Artisan::call('route:clear');
    Artisan::call('config:clear');
    Artisan::call('cache:clear');
    Artisan::call('permission:cache-reset');
    return '<h1>Cache Cleared</h1>';
});
