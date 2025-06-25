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
        Schema::create('employee_schedule', function (Blueprint $table) {
            $table->id();
            $table->foreignId('empleado_id')->constrained('empleados')->onDelete('cascade');
            $table->foreignId('schedule_id')->constrained('schedules')->onDelete('cascade');
            $table->date('start_date')->comment('Fecha de inicio del horario asignado');
            $table->date('end_date')->nullable()->comment('Fecha de finalización (para horarios temporales)');
            $table->boolean('is_active')->default(true)->comment('¿Está activa la asignación?');
            $table->timestamps();
            $table->unique(['empleado_id', 'schedule_id', 'start_date'], 'employee_schedule_unique');
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employee_schedule');
    }
};
