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
        Schema::create('schedules', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('name'); // Ej: "Turno Mañana", "Horario Flexible"
            $table->time('start_time'); // Hora de entrada
            $table->time('end_time'); // Hora de salida
            $table->boolean('has_break')->default(false); // Si tiene descanso
            $table->time('break_start')->nullable(); // Inicio del descanso
            $table->time('break_end')->nullable(); // Fin del descanso
            $table->boolean('is_flexible')->default(false); // Horario flexible
            $table->integer('tolerance_minutes')->default(0); // Tolerancia de entrada
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shedules');
    }
};
