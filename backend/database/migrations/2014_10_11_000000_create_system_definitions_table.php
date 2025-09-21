<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('system_definitions', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('code', 100)->unique()->comment('Machine-readable code, e.g. VAT_RATE');
            $table->string('name', 150)->comment('Human-readable name/title');
            $table->decimal('value', 10, 4)->nullable()->comment('Actual value (numeric rates)');
            $table->text('description')->nullable()->comment('Description or details');
            $table->string('remarks')->default('Y')->comment('e.g. Y = applicable, N = not applicable');
            $table->enum('is_active', ['Y', 'N'])->default('Y')->comment('Enable/disable flag');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('system_definitions');
    }
};
