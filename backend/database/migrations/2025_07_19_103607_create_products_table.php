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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            
            $table->string('sku')->unique();
            $table->string('name');
            $table->string('description');
            $table->foreignId('category_id')->constrained('product_categories');
            $table->integer('quantity_on_hand');
            $table->integer('stocks_alert')->default(0);
            $table->integer('reorder_point');
            $table->foreignId('supplier_id')->constrained('suppliers');
            $table->decimal('cost_price', 10, 2);
            $table->decimal('selling_price', 10, 2);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
