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
        Schema::create('total_servicios', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->unsignedBigInteger('registro_servicio_id');
            $table->decimal('total', 10, 2);
            $table->foreign('registro_servicio_id')->references('id')->on('registro_servicios')->onDelete('cascade');
            $table->decimal('impuesto', 5, 2)->default(0);
            $table->decimal('descuento', 5, 2)->default(0);
            $table->decimal('subtotal', 10, 2)->default(0);
            $table->string('nro_factura')->unique();
            


        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('total_servicios');
    }
};
