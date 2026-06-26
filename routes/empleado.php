<?php

use App\Http\Controllers\EmpleadoController;
use App\Http\Middleware\AdminEmpleado;


Route::middleware(['auth','verified',AdminEmpleado::class])
->group(function(){
Route::get('empleados', [EmpleadoController::class, 'index'])
          ->name('empleados.index');

Route::get('empleados/create', [EmpleadoController::class, 'create'])
       ->name('empleados.create');

Route::post('empleados', [EmpleadoController::class, 'store'])
       ->name('empleados.store');

Route::delete('empleados/{empleado}', [EmpleadoController::class, 'destroy'])
       ->name('empleados.destroy');

Route::get('empleados/{empleado}/edit', [EmpleadoController::class, 'edit'])
    ->name('empleados.edit');

Route::post('empleados/{empleado}', [EmpleadoController::class, 'update'])
    ->name('empleados.update');
});

