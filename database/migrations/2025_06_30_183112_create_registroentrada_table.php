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
        Schema::create('registroentradas', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->unsignedBigInteger('empleado_id');
            $table->unsignedBigInteger('schedule_id');
            $table->foreign('empleado_id')->references('id')->on('empleados')->onDelete('cascade');
            $table->foreign('schedule_id')->references('id')->on('schedules')->onDelete('cascade');
            $table->date('registro_fecha'); // NUEVO: solo la fecha
            $table->dateTime('registro_hora'); // hora exacta del evento
            $table->enum('tipo', ['entrada', 'salida', 'descanso', 'regreso_descanso'])->default('entrada');
            $table->unsignedTinyInteger('evento')->default(1); // NUEVO: número de evento del día
            $table->string('observacion')->nullable(); // NUEVO: comentarios
        });
         

    }   

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('registroentrada');
    }
};
