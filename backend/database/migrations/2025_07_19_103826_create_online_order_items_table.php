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
        Schema::create('online_order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->foreignId('product_id')->constrained('products')->onDelete('restrict');
            $table->foreignId('variant_id')->nullable()->constrained('product_variants')->onDelete('set null');

            // Snapshots
            $table->string('product_name');
            $table->string('sku')->nullable();

            // Pricing
            $table->integer('quantity')->default(1);
            $table->decimal('unit_price', 10, 2);
            $table->decimal('subtotal', 10, 2);
            $table->decimal('discount_amount', 10, 2)->default(0);
            $table->decimal('tax_amount', 10, 2)->default(0);

            // Fulfillment
            $table->enum('status', ['PENDING', 'FULFILLED', 'RETURNED'])->default('PENDING');
            $table->dateTime('fulfilled_at')->nullable();
            $table->dateTime('returned_at')->nullable();

            // Flexible attributes
            $table->json('attributes')->nullable(); // ex: {"color":"red","size":"M"}

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('online_order_items');
    }
};
