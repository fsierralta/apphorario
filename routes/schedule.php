<?php
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\API\ScheduleController as ApiScheduleController;
use App\Http\Middleware\AdminEmpleado;

// Web routes (protected by auth and admin middleware)
Route::middleware(['auth', 'verified', AdminEmpleado::class])->group(function () {
    Route::get('/schedules', [ScheduleController::class, 'index'])->name('schedules.index');
    Route::post('/schedules', [ScheduleController::class, 'store'])->name('schedules.store');
    Route::put('/schedules/{schedule}', [ScheduleController::class, 'update'])->name('schedules.update');
    Route::delete('/schedules/{schedule}', [ScheduleController::class, 'destroy'])->name('schedules.destroy');
});

// API routes (protected by auth middleware)
Route::middleware(['auth'])->group(function () {
    Route::get('/api/schedules/{schedule}', [ApiScheduleController::class, 'show'])->name('api.schedules.show');
});
