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
         Schema::create('feedbacks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('source_id')->constrained('feedback_sources')->onDelete('cascade');
            $table->string('external_id')->nullable();
            $table->string('author_name')->nullable();
            $table->string('order_no')->nullable()->comment('Order number if applicable');
            $table->unsignedTinyInteger('rating')->nullable()->comment('1 to 5 stars');
            $table->text('comment');
            $table->dateTime('date_posted')->nullable();
            $table->enum('sentiment', ['POSITIVE', 'NEGATIVE','NEUTRAL'])->nullable();
            $table->float('confidence_score')->nullable();
            $table->json('keywords')->nullable();
            $table->enum('status', ['NEW', 'IN_PROGRESS', 'RESOLVED'])->default('NEW');
            $table->foreignId('handled_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('action_logs');
        Schema::dropIfExists('feedbacks');
    }
};
