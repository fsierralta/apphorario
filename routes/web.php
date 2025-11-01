<?php


use App\Http\Controllers\EmployeeScheduleController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Middleware\AdminEmpleado;
Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified',AdminEmpleado::class])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});



require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/empleado.php';
require __DIR__.'/schedule.php';
require __DIR__.'/empleadoSchedule.php';
require __DIR__.'/actividad.php';
require __DIR__.'/qr.php';
require __DIR__.'/asistencia.php';
require __DIR__.'/spad.php';
