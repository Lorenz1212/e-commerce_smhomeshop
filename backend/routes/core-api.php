<?php

use App\Helpers\DataFetcher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\Admin\Core\UserPermissionController;
use App\Http\Controllers\API\Admin\Core\RoleController;
use App\Http\Controllers\API\Admin\Core\UserAccountController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
Route::prefix('v1')->group(function () {
    Route::middleware(['auth:core', 'role:core','throttle:100,1'])->prefix('core')->group(function () {
        
        Route::get('/permissions', [DataFetcher::class, 'getPermissions']);
        Route::get('/roles', [DataFetcher::class, 'getRoles']);

        Route::prefix('permission')->group(function () {
            Route::get('/index', [UserPermissionController::class, 'index'])->middleware('permission:view_permission_list');
            Route::post('/create', [UserPermissionController::class, 'create'])->middleware('permission:create_permission');
            Route::put('/{permission_id}/update/', [UserPermissionController::class, 'update'])->middleware('permission:update_permission');
            Route::delete('/{permission_id}/archive', [UserPermissionController::class, 'delete'])->middleware('permission:delete_permission');
        });

        Route::prefix('role')->group(function () {
            Route::get('/list', [RoleController::class, 'roleList'])->middleware('permission:view_role_list');
            Route::get('/archived/list', [RoleController::class, 'archivedList'])->middleware('permission:delete_role');
            Route::get('/{role_id}/edit', [RoleController::class, 'showDetails'])->middleware('permission:view_role_details');
            Route::post('/store', [RoleController::class, 'store'])->middleware('permission:create_role');
            Route::put('/{role_id}/update', [RoleController::class, 'update'])->middleware('permission:update_role');
            Route::delete('/{role_id}/archive', [RoleController::class, 'archive'])->middleware('permission:delete_role');
            Route::post('/{role_id}/restore', [RoleController::class, 'restore'])->middleware('permission:restore_role');
         });

         Route::prefix('user')->group(function () {
            Route::get('/list', [UserAccountController::class, 'list'])->middleware('permission:view_user_account_list');
            Route::get('/archived/list', [UserAccountController::class, 'archivedList'])->middleware('permission:delete_user_account');
            Route::get('/{user_id}/edit', [UserAccountController::class, 'showDetails'])->middleware('permission:view_user_account_details');
            Route::post('/store', [UserAccountController::class, 'store'])->middleware('permission:create_user_account');
            Route::post('/{user_id}/update', [UserAccountController::class, 'update'])->middleware('permission:update_user_account');
            Route::delete('/{user_id}/archive', [UserAccountController::class, 'archive'])->middleware('permission:delete_user_account');
            Route::post('/{user_id}/restore', [UserAccountController::class, 'restore'])->middleware('permission:restore_user_account');
            Route::post('/{user_id}/reset', [UserAccountController::class, 'reset']);
         });
    });
});

