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
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('customer_no')->unique();
            $table->string('fname')->nullable();
            $table->string('lname')->nullable();
            $table->string('mname')->nullable();
            $table->string('suffix')->nullable();
            $table->enum('gender',['M','F','O'])->nullable();
            $table->date('birth_date')->nullable();
            $table->integer('age')->nullable();
            $table->string('phone')->nullable();
            $table->integer('loyalty_points')->nullable();
            $table->enum('is_active',['Y','N'])->default('Y');
            $table->enum('is_block',['Y','N'])->default('N');
            $table->string('image')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
