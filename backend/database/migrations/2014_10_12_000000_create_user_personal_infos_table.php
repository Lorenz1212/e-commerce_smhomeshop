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
        Schema::create('user_personal_infos', function (Blueprint $table) {
            $table->id();
            $table->string('account_no')->nullable();
            $table->string('fname')->nullable();
            $table->string('lname')->nullable();
            $table->string('mname')->nullable();
            $table->string('suffix')->nullable();
            $table->string('contact_no')->nullable();
            $table->enum('gender',['M','F'])->default('M');
            $table->date('birthdate')->nullable();
            $table->integer('age')->nullable();
            $table->string('address')->nullable();
            $table->integer('barangay')->nullable();
            $table->integer('city')->nullable();
            $table->integer('province')->nullable();
            $table->integer('region')->nullable();
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
        Schema::dropIfExists('user_personal_infos');
    }
};
