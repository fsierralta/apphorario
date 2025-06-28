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
        Schema::create('registro_horario', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->unsignedBigInteger('empleado_id');
            $table->unsignedBigInteger('schedule_id');
            $table->date('dia_trabajo');
            $table->foreign('empleado_id')->references('id')->on('empleados');    ;
            $table->foreign('schedule_id')->references('id')->on('schedules');
            $table->time('hora_registro');
            $table->enum('tipo', ['entrada', 'salida','descanso'])->default('entrada');
            $table->string('observacion')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('registro_horario');
    }
};
