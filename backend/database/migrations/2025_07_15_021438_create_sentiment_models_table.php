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
        Schema::create('sentiment_models', function (Blueprint $table) {
            $table->id();
            $table->string('model_name')->nullable(); // e.g., Facebook, Twitter, etc.
            $table->string('description')->nullable(); // ID sa social media
            $table->string('accuracy')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sentiment_models');
    }
};
