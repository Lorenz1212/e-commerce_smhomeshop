<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\Customer\CustomerController;

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
    Route::middleware(['auth:customer', 'throttle:100,1'])->prefix('customer')->group(function () {
         Route::prefix('auth')->group(function () {
            Route::get('/product/best_seller/list', [CustomerController::class, 'productBestSellerList']);
            Route::get('/categories', [CustomerController::class, 'productCategoriesList']);

            Route::get('/product/list/{category_id}', [CustomerController::class, 'productList']);
            Route::get('/product/details/{product_id}', [CustomerController::class, 'productDetails']);
            Route::get('/product/{product_id}/addons', [CustomerController::class, 'productAddons']);

            Route::get('/cart/list', [CustomerController::class, 'cartList']);
            Route::get('/cart/count', [CustomerController::class, 'cartCount']);
            Route::post('/cart/store', [CustomerController::class, 'cartStore']);
            Route::post('/cart/update/{cart_id}', [CustomerController::class, 'cartUpdate']);
            Route::delete('/cart/delete/{cart_id}', [CustomerController::class, 'cartDelete']);

            Route::get('/order/list', [CustomerController::class, 'orderList']);
            Route::post('/order/checkout', [CustomerController::class, 'orderCheckout']);
            Route::get('/order/queue', [CustomerController::class, 'orderQueue']);

            Route::post('/order/{order_id}/feedback', [CustomerController::class, 'orderFeedback']);
            
         });
    });
});

