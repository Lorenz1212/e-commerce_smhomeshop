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
        Schema::create('customer_address', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained('customers')->onDelete('cascade');
            $table->string('company_name')->nullable();
            $table->string('address')->nullable();
            $table->string('brgy_code')->nullable();
            $table->string('city_code')->nullable();
            $table->string('province_code')->nullable();
            $table->string('region_code')->nullable();
            $table->string('postal_code')->nullable();
            $table->enum('default_flag',['Y','N'])->default('N');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customer_address');
    }
};
