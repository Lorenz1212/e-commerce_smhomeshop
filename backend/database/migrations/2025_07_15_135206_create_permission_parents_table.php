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
        Schema::create('permission_parents', function (Blueprint $table) {
            $table->id(); // AUTO_INCREMENT primary key
            $table->string('name')->nullable();
            $table->enum('is_active', ['Y', 'N'])->default('Y');
            $table->timestamps(); // created_at & updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('permission_parents');
    }
};
