<?php
 use App\Http\Controllers\spad\GestionController;
 use App\Http\Middleware\AdminEmpleado;
 use Illuminate\Support\Facades\Route;



Route::middleware(['auth', 'verified',AdminEmpleado::class])->group(function () {
    // Define your SPAD routes here
    Route::get("/spad/cita", [GestionController::class,"indexCita"])->name('spad.indexcita');
    Route::get("/spad/cita/create", [GestionController::class,"createCita"])->name('spad.createcita');
    Route::get("/spad/create/cita/{empleado_id}",[GestionController::class,"showCitaForm","showcitaform"])
            ->name('spad.showcitaform');
    Route::post("spad/store/cita",[GestionController::class,'storeCita'])->name('spad.storecita');
    Route::get("spad/lista/cita/{empleado_id}",[GestionController::class,'listaCita'])->name('spad.listacita');
    Route::delete("spad/cita/delete/{cita}",[GestionController::class,'destroyCita'] )->name('spad.destroycita');
});





