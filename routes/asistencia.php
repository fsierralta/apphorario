<?php

use App\Http\Middleware\AdminEmpleado;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EmployeeScheduleController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/asistencia', [EmployeeScheduleController::class, 'showEmpleadoAsistencia'])
        ->name('asistencia.index');
});
