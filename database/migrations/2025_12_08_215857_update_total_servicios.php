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
        Schema::table('total_servicios', function (Blueprint $table) {
            //
            $table->unsignedBigInteger("empleado_id");
            $table->unsignedBigInteger("comision_valor");
            $table->date("fecha")->default(now());
            

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('total_servicios', function (Blueprint $table) {
            //
        });
    }
};
