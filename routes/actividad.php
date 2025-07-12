<?php
use App\Http\Middleware\EmpleadoMiddleware;
use App\Http\Controllers\ActividadController;

Route::middleware(['auth', 'verified',EmpleadoMiddleware::class])->group(function(){
    Route::get('/actividad',[ActividadController::class,"index"])
     ->name('actividad.index');

Route::post('/actividad/{empleado}/{tipo}', [ActividadController::class, 'store'])
    ->name('actividad.store');  

});