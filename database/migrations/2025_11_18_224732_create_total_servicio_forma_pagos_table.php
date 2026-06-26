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
        Schema::create('total_servicio_forma_pagos', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->unsignedBigInteger('total_servicio_id');
            $table->unsignedBigInteger('forma_pago_id');
            $table->decimal('monto', 10, 2);
            $table->foreign('total_servicio_id')->references('id')->on('total_servicios')->onDelete('cascade');
            $table->foreign('forma_pago_id')->references('id')->on('forma_pagos')->onDelete('cascade');
            
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('total_servicio_forma_pagos');
    }
};
