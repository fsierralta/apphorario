<?php
 use App\Http\Controllers\spad\GestionController;
 use App\Http\Middleware\AdminEmpleado;
 use Illuminate\Support\Facades\Route;



Route::middleware(['auth', 'verified',AdminEmpleado::class])->group(function () {
    // Define your SPAD routes here
    Route::get("/spad/cita", [GestionController::class,"indexCita"])->name('spad.indexcita');
    Route::get("/spad/cita/create", [GestionController::class,"createCita"])->name('spad.createcita');
    
});




