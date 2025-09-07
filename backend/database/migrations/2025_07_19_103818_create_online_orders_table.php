<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('online_orders', function (Blueprint $table) {

            $table->id();
            $table->string('order_no')->unique();
            $table->foreignId('customer_id')->constrained('customers')->onDelete('cascade');
            $table->foreignId('store_id')->nullable()->constrained('stores')->onDelete('set null');
            $table->dateTime('order_datetime');
            
            // Order lifecycle
            $table->enum('status', [
                'PENDING',        // order placed but not processed yet
                'PROCESSING',     // being prepared/packed
                'SHIPPED',        // handed over to courier
                'DELIVERED',      // received by customer
                'CANCELLED',      // cancelled by store/customer
                'RETURNED',       // returned by customer
            ])->default('PENDING');

            // Payment
            $table->enum('payment_status', ['PENDING', 'PAID', 'FAILED', 'REFUNDED'])->default('PENDING');
            $table->enum('payment_method', ['CASH_ON_DELIVERY', 'CARD', 'GCASH', 'PAYPAL'])->default('CASH_ON_DELIVERY');

            // Amounts
            $table->decimal('subtotal', 10, 2)->default(0);
            $table->decimal('tax_amount', 10, 2)->default(0);
            $table->decimal('discount_amount', 10, 2)->default(0);
            $table->decimal('shipping_fee', 10, 2)->default(0);
            $table->decimal('total_amount', 10, 2)->default(0);

            // Shipping / Billing
            $table->string('shipping_address');
            $table->string('billing_address')->nullable();
            $table->string('tracking_number')->nullable();
            $table->string('courier_name')->nullable();

            // Metadata
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('online_orders');
    }
};
