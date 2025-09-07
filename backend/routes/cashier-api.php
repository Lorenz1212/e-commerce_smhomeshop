<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\Cashier\OrderController as CashierOrderController;


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
    Route::middleware(['throttle:100,1'])->prefix('cashier')->group(function () {

        Route::prefix('category')->group(function () {
            Route::get('/list', [CashierOrderController::class, 'categoryList']);
        });

        Route::prefix('product')->group(function () {
            Route::get('/list/{category_id}', [CashierOrderController::class, 'productList']);
            Route::get('/online_order', [CashierOrderController::class, 'onlineOrderList']);
            Route::get('/{order_id}/online_order_items', [CashierOrderController::class, 'onlineOrdersItem']);
        });

        Route::prefix('online_order')->group(function () {
            Route::get('/list', [CashierOrderController::class, 'onlineOrderList']);
            Route::get('/{order_id}/getItems', [CashierOrderController::class, 'onlineOrdeonlineOrdersItemrList']);
        });

        Route::prefix('order')->group(function () {
            Route::post('/generateOrderNo', [CashierOrderController::class, 'generateOrderNo']);
            Route::post('/process', [CashierOrderController::class, 'processOrder']);
        });

        Route::prefix('queue')->group(function () {
            Route::get('/count', [CashierOrderController::class, 'queueOrderCount']);
            Route::get('/order', [CashierOrderController::class, 'queueOrder']);
            Route::put('{id}/status', [CashierOrderController::class, 'updateQueueOrder']);
        });
    });
});

