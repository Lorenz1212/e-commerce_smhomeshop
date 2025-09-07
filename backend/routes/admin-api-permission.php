<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\Admin\Customer\CustomerController;
use App\Http\Controllers\API\Admin\Dashboard\DashboardController;
use App\Http\Controllers\API\Admin\Feedback\FeedbackController;
use App\Http\Controllers\API\Admin\Product\ProductAddOnsController;
use App\Http\Controllers\API\Admin\Product\ProductController;
use App\Http\Controllers\API\Admin\Product\ProductCategoryController;
use App\Http\Controllers\API\Admin\Supplier\SupplierController;
use App\Http\Controllers\API\Admin\Transactions\OnlineOrderController;
use App\Http\Controllers\API\Admin\Transactions\WalkinOrderController;

Route::prefix('v1')->group(function () {
    Route::middleware(['auth:core', 'throttle:100,1'])->prefix('admin')->group(function () {

        Route::prefix('dashboard')->group(function () {
            Route::post('/customer_count', [DashboardController::class, 'customerCount']);
            Route::post('/product_count', [DashboardController::class, 'productCount']);
            Route::get('/product_stocks', [DashboardController::class, 'productStocksTable']);
            Route::post('/forcasting_sales', [DashboardController::class, 'forcastingSales']);
            Route::post('/sentiment_count_status', [DashboardController::class, 'sentimentCountsAndStatus']);
            Route::post('/feedback_overtime', [DashboardController::class, 'feedbackOvertime']);
            Route::post('/recent_feedback', [DashboardController::class, 'recentFeedback']);
            Route::post('/feedback_stats', [DashboardController::class, 'feedbackStats']);
        });
        
        Route::prefix('customer')->group(function () {
            Route::get('/list', [CustomerController::class, 'list'])->middleware('permission:view_customer_list');
            Route::get('/{customer_id}/edit', [CustomerController::class, 'showDetails'])->middleware('permission:view_customer_details');
            Route::post('/store', [CustomerController::class, 'store'])->middleware('permission:create_customer');
            Route::put('/{customer_id}/update', [CustomerController::class, 'update'])->middleware('permission:update_customer');
            Route::put('/{customer_id}/restore', [CustomerController::class, 'restore'])->middleware('permission:restore_customer');
            Route::put('/{customer_id}/block', [CustomerController::class, 'block'])->middleware('permission:block_customer');
            Route::delete('/{customer_id}/delete', [CustomerController::class, 'delete'])->middleware('permission:delete_customer');
        });

        Route::prefix('supplier')->group(function () {
            Route::get('/list', [SupplierController::class, 'list'])->middleware('permission:view_supplier_list');
            Route::get('/archived/list', [SupplierController::class, 'archivedList'])->middleware('permission:view_supplier_archived_list');
            Route::get('/{supplier_id}/edit', [SupplierController::class, 'showDetails'])->middleware('permission:view_supplier_details');
            Route::post('/store', [SupplierController::class, 'store'])->middleware('permission:create_supplier');
            Route::put('/{supplier_id}/update', [SupplierController::class, 'update'])->middleware('permission:update_supplier');
            Route::post('/{supplier_id}/restore', [SupplierController::class, 'restore'])->middleware('permission:restore_supplier');
            Route::delete('/{supplier_id}/delete', [SupplierController::class, 'delete'])->middleware('permission:delete_supplier');
        });

        Route::prefix('product_category')->group(function () {
            Route::get('/list', [ProductCategoryController::class, 'list'])->middleware('permission:view_product_category_list');
            Route::get('/archived/list', [ProductCategoryController::class, 'archivedList'])->middleware('permission:view_product_category_archived_list');
            Route::get('/{category_id}/edit', [ProductCategoryController::class, 'showDetails'])->middleware('permission:view_product_category_details');
            Route::post('/store', [ProductCategoryController::class, 'store'])->middleware('permission:create_product_category');
            Route::post('/{category_id}/update', [ProductCategoryController::class, 'update'])->middleware('permission:update_product_category');
            Route::post('/{category_id}/restore', [ProductCategoryController::class, 'restore'])->middleware('permission:restore_product_category');
            Route::delete('/{category_id}/delete', [ProductCategoryController::class, 'delete'])->middleware('permission:delete_product_category');
        });

        Route::prefix('product')->group(function () {
            Route::get('/list', [ProductController::class, 'list'])->middleware('permission:view_product_list');
            Route::get('/archived/list', [ProductController::class, 'archivedList'])->middleware('permission:view_product_archived_list');
            Route::get('/{product_id}/edit', [ProductController::class, 'showDetails'])->middleware('permission:view_product_details');
            Route::post('/store', [ProductController::class, 'store'])->middleware('permission:create_product');
            Route::post('/{product_id}/update', [ProductController::class, 'update'])->middleware('permission:update_product');
            Route::post('/{product_id}/restore', [ProductController::class, 'restore'])->middleware('permission:restore_product');
            Route::delete('/{product_id}/archive', [ProductController::class, 'archive'])->middleware('permission:delete_product');
        });

        Route::prefix('addon')->group(function () {
            Route::get('/list', [ProductAddOnsController::class, 'list'])->middleware('permission:view_product_addons_list');
            Route::get('/archived/list', [ProductAddOnsController::class, 'archivedList'])->middleware('permission:view_product_addons_archived_list');
            Route::get('/{addon_id}/edit', [ProductAddOnsController::class, 'showDetails'])->middleware('permission:view_product_addons_details');
            Route::post('/store', [ProductAddOnsController::class, 'store'])->middleware('permission:create_product_addons');
            Route::post('/{addon_id}/update', [ProductAddOnsController::class, 'update'])->middleware('permission:update_product_addons');
            Route::post('/{addon_id}/restore', [ProductAddOnsController::class, 'restore'])->middleware('permission:restore_product_addons');
            Route::delete('/{addon_id}/archive', [ProductAddOnsController::class, 'archive'])->middleware('permission:delete_product_addons');
        });

        Route::prefix('feedback')->group(function () {
            Route::get('/list', [FeedbackController::class, 'list'])->middleware('permission:view_feedback_list');
            Route::put('/update/{id}', [FeedbackController::class, 'update'])->middleware('permission:update_feedback');
        });

        Route::prefix('order')->group(function () {
            Route::get('/online/list', [OnlineOrderController::class, 'list'])->middleware('permission:view_online_order_list');
            Route::get('/online/{order_id}/details', [OnlineOrderController::class, 'OrderDetails'])->middleware('permission:view_online_order_details');

            Route::get('/walkin/list', [WalkinOrderController::class, 'list'])->middleware('permission:view_walkin_order_list');
            Route::get('/walkin/{order_id}/details', [WalkinOrderController::class, 'OrderDetails'])->middleware('permission:view_walkin_order_details');
        });
    });
});

