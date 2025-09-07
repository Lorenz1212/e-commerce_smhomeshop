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
        Schema::create('pos_transactions', function (Blueprint $table) {
            $table->id();
            $table->string('transaction_number')->unique();
            $table->string('queue_number')->nullable();
            $table->foreignId('store_id')->constrained('stores');
            $table->foreignId('kiosk_id')->constrained('kiosks');
            $table->foreignId('customer_id')->nullable()->constrained('customers');
            $table->dateTime('transaction_datetime');
            $table->decimal('subtotal', 10, 2)->default(0);
            $table->decimal('tax_amount', 10, 2)->default(0);
            $table->decimal('discount_amount', 10, 2)->default(0);
            $table->decimal('total_amount', 10, 2)->default(0);
            $table->string('payment_method');
            $table->string('payment_status');
            $table->string('order_source');
            $table->enum('request_type', ['DINE-IN', 'TAKE-OUT'])->default('DINE-IN');
            $table->enum('status', ['PENDING', 'IN_PROGRESS', 'PAID', 'READY', 'SERVED', 'CANCELLED'])->default('PENDING');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pos_transactions');
    }
};
