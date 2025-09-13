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
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')
                ->constrained('products')
                ->onDelete('cascade'); // kung madelete ang product, delete variants too

            $table->string('sku')->unique(); // unique per variant
            $table->string('variant_name');  // e.g. "Red / Large"
            
            // Inventory & pricing (optional override ng parent product)
            $table->integer('quantity_on_hand')->default(0);
            // $table->integer('stocks_alert')->default(0);
            $table->integer('reorder_point')->nullable();
            $table->decimal('cost_price', 10, 2)->nullable();    // can inherit from product if null
            $table->decimal('selling_price', 10, 2)->nullable(); // can inherit from product if null

            // Flexible attributes (kung dynamic variants)
            $table->json('attributes')->nullable(); // e.g. {"color":"Red","size":"Large"}

            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
       Schema::dropIfExists('product_variants');
    }
};
