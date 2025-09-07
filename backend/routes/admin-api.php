<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\Admin\Customer\CustomerController;
use App\Http\Controllers\API\Admin\Dashboard\DashboardController;
use App\Http\Controllers\API\Admin\Feedback\FeedbackController;
use App\Http\Controllers\API\Admin\Product\ProductAddOnsController;
use App\Http\Controllers\API\Admin\Product\ProductController;
use App\Http\Controllers\API\Admin\Product\ProductCategoryController;
use App\Http\Controllers\API\Admin\Reports\InventoryReportController;
use App\Http\Controllers\API\Admin\Reports\SalesReportController;
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
            Route::get('/list', [CustomerController::class, 'list']);
            Route::get('/archived/list', [CustomerController::class, 'archivedList']);
            Route::get('/{customer_id}/edit', [CustomerController::class, 'showDetails']);
            Route::post('/{customer_id}/update', [CustomerController::class, 'update']);
            Route::post('/{customer_id}/restore', [CustomerController::class, 'restore']);
            Route::delete('/{customer_id}/archive', [CustomerController::class, 'archive']);
        });

        Route::prefix('supplier')->group(function () {
            Route::get('/list', [SupplierController::class, 'list']);
            Route::get('/archived/list', [SupplierController::class, 'archivedList']);
            Route::get('/{supplier_id}/edit', [SupplierController::class, 'showDetails']);
            Route::post('/store', [SupplierController::class, 'store']);
            Route::put('/{supplier_id}/update', [SupplierController::class, 'update']);
            Route::post('/{supplier_id}/restore', [SupplierController::class, 'restore']);
            Route::delete('/{supplier_id}/delete', [SupplierController::class, 'delete']);
        });

        Route::prefix('product_category')->group(function () {
            Route::get('/list', [ProductCategoryController::class, 'list']);
            Route::get('/archived/list', [ProductCategoryController::class, 'archivedList']);
            Route::get('/{category_id}/edit', [ProductCategoryController::class, 'showDetails']);
            Route::post('/store', [ProductCategoryController::class, 'store']);
            Route::post('/{category_id}/update', [ProductCategoryController::class, 'update']);
            Route::post('/{category_id}/restore', [ProductCategoryController::class, 'restore']);
            Route::delete('/{category_id}/delete', [ProductCategoryController::class, 'delete']);
        });

        Route::prefix('product')->group(function () {
            Route::get('/list', [ProductController::class, 'list']);
            Route::get('/archived/list', [ProductController::class, 'archivedList']);
            Route::get('/{product_id}/edit', [ProductController::class, 'showDetails']);
            Route::post('/store', [ProductController::class, 'store']);
            Route::post('/{product_id}/update', [ProductController::class, 'update']);
            Route::post('/{product_id}/restore', [ProductController::class, 'restore']);
            Route::delete('/{product_id}/archive', [ProductController::class, 'archive']);
        });

        Route::prefix('addon')->group(function () {
            Route::get('/list', [ProductAddOnsController::class, 'list']);
            Route::get('/archived/list', [ProductAddOnsController::class, 'archivedList']);
            Route::get('/{addon_id}/edit', [ProductAddOnsController::class, 'showDetails']);
            Route::post('/store', [ProductAddOnsController::class, 'store']);
            Route::post('/{addon_id}/update', [ProductAddOnsController::class, 'update']);
            Route::post('/{addon_id}/restore', [ProductAddOnsController::class, 'restore']);
            Route::delete('/{addon_id}/archive', [ProductAddOnsController::class, 'archive']);
        });

        Route::prefix('feedback')->group(function () {
            Route::get('/list', [FeedbackController::class, 'list']);
            Route::post('/count', [FeedbackController::class, 'count']);
            Route::put('/update/{id}', [FeedbackController::class, 'update']);
        });

        Route::prefix('order')->group(function () {
            Route::get('/online/list', [OnlineOrderController::class, 'list']);
            Route::get('/online/{order_id}/details', [OnlineOrderController::class, 'OrderDetails']);

            Route::get('/walkin/list', [WalkinOrderController::class, 'list']);
            Route::get('/walkin/{order_id}/details', [WalkinOrderController::class, 'OrderDetails']);
        });

        Route::prefix('reports')->group(function () {
            Route::get('/inventory-movement/list', [InventoryReportController::class, 'reports']);
            Route::get('/inventory-movement/summary', [InventoryReportController::class, 'summary']);

            Route::get('/sales/online/list', [SalesReportController::class, 'onlineOrderReports']);
            Route::get('/sales/walkin/list', [SalesReportController::class, 'walkinOrderReports']);
            Route::get('/sales/summary', [SalesReportController::class, 'summary']);
        });
    });
});

