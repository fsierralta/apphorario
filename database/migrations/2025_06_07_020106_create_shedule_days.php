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
        Schema::create('schedule_days', function (Blueprint $table) {
            $table->id();
            $table->foreignId('schedule_id')->constrained()->onDelete('cascade');

            // Días de la semana (ISO 8601: 1=Lunes, 7=Domingo)
            $table->tinyInteger('day_of_week')->unsigned();

            $table->boolean('is_working_day')->default(true); // Trabaja o descansa
            $table->timestamps();

            $table->unique(['schedule_id', 'day_of_week']); // Evitar duplicados

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shedule_days');
    }
};
