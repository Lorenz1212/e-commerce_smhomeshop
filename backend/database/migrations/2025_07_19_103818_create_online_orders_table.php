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
            $table->string('queue_number')->nullable();
            $table->foreignId('customer_id')->constrained('customers')->onDelete('cascade');
            $table->foreignId('store_id')->constrained('stores')->onDelete('cascade');
            $table->date('order_date');
            $table->dateTime('scheduled_time')->nullable();
            $table->enum('request_type', ['DINE-IN', 'TAKE-OUT'])->default('DINE-IN');
            $table->enum('status', ['PENDING', 'IN_PROGRESS', 'PAID', 'READY', 'SERVED', 'CANCELLED'])->default('PENDING');
            $table->string('payment_status');
            $table->enum('payment_method', ['CASH', 'GCASH', 'CARD'])->default('CASH');
            $table->decimal('subtotal', 10, 2)->default(0);
            $table->decimal('tax_amount', 10, 2)->default(0);
            $table->decimal('discount_amount', 10, 2)->default(0);
            $table->decimal('total_amount', 10, 2)->default(0);
            $table->string('delivery_address')->nullable();
            $table->text('special_instructions')->nullable();
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
