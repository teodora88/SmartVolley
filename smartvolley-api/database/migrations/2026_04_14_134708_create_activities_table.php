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
        Schema::create('activities', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->time('time');
            $table->string('type')->default('practice');
            $table->string('status')->default('scheduled');

            $table->foreignId('group_id')->constrained()->cascadeOnDelete();
            $table->foreignId('location_id')->nullable()->constrained()->restrictOnDelete();
            $table->string('other_location')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activities');
    }
};
