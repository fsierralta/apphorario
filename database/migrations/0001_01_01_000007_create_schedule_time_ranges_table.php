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
        Schema::create('schedule_time_ranges', function (Blueprint $table) {
            $table->id();
            $table->foreignId('schedule_day_id')->constrained();
            $table->time('start_time');
            $table->time('end_time');
            $table->string('type'); // work, break, meeting
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('schedule_time_ranges');
    }
};
