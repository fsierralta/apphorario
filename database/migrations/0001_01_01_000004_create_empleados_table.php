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
        Schema::create('empleados', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('nombre')->comment('Nombre del empleado');
            $table->string('apellido')->comment('Apellido del empleado');
            $table->string('cedula')->unique()->index('cedula_index')->comment('Cédula del empleado');
            $table->string('telefono')->comment('Teléfono del empleado');
            $table->string('direccion')->comment('Dirección del empleado');
            $table->string('foto_url')->nullable()->comment('URL de la foto del empleado');
            $table->string('cargo')->nullable()->comment('Cargo del empleado');
            $table->string('email')->unique();
            

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('empleados');
    }
};
