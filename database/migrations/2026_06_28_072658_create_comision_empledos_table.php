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
        Schema::create('comision_empledos', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->unsignedBigInteger('empleado_id');
            $table->unsignedBigInteger('comision_id');
            $table->foreign('empleado_id')->references('id')->on('empleados')->onDelete('cascade');
            $table->foreign('comision_id')->references('id')->on('comisions')->onDelete('cascade');
            $table->index('empleado_id');
            $table->index('comision_id');
            $table->unique(['empleado_id', 'comision_id']);
            

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comision_empledos');
    }
};
