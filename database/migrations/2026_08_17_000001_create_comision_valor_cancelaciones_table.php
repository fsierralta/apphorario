<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('comision_valor_cancelaciones', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('total_servicio_id');
            $table->unsignedBigInteger('empleado_id');
            $table->unsignedBigInteger('forma_pago_id');
            $table->decimal('monto_cancelado', 10, 2);
            $table->text('motivo')->nullable();
            $table->date('fecha_cancelacion');
            $table->string('estado')->default('pendiente');
            $table->timestamps();

            $table->foreign('total_servicio_id')->references('id')->on('total_servicios')->onDelete('cascade');
            $table->foreign('empleado_id')->references('id')->on('empleados')->onDelete('cascade');
            $table->foreign('forma_pago_id')->references('id')->on('forma_pagos')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('comision_valor_cancelaciones');
    }
};
