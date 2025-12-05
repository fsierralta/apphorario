<?php
 use App\Http\Controllers\spad\GestionController;
 use App\Http\Middleware\AdminEmpleado;
 use Illuminate\Support\Facades\Route;
 use App\HTTP\Controllers\ServicioController;
use App\Http\Controllers\CategoriaController;


Route::middleware(['auth', 'verified',AdminEmpleado::class])->group(function () {
    // Define your SPAD routes here
    Route::get("/spad/cita", [GestionController::class,"indexCita"])->name('spad.indexcita');
    Route::get("/spad/cita/create", [GestionController::class,"createCita"])->name('spad.createcita');
    Route::get("/spad/create/cita/{empleado_id}",[GestionController::class,"showCitaForm","showcitaform"])
            ->name('spad.showcitaform');
    Route::post("spad/store/cita",[GestionController::class,'storeCita'])->name('spad.storecita');
    Route::get("spad/lista/cita/{empleado_id}",[GestionController::class,'listaCita'])->name('spad.listacita');
    Route::delete("spad/cita/delete/{cita}",[GestionController::class,'destroyCita'] )->name('spad.destroycita');
    Route::post("spad/store/cliente",[GestionController::class,'storeCliente'] )->name('spad.storecliente');
    Route::get('/spad/servicios', [ServicioController::class, 'index'])->name('spad.indexservicio');    
    Route::get('/spad/servicio/create', [ServicioController::class, 'create'])->name('spad.createservicio');
    Route::post('/spad/servicio/store', [ServicioController::class, 'store'])->name('spad.storeservicio');
    Route::get('/spad/servicio/edit/{servicio}', [ServicioController::class, 'edit'])->name('spad.editservicio');
    Route::put('/spad/servicio/update/{id}', [ServicioController::class, 'update'])->name('spad.updateservicio');
    //-------------
    Route::get('/spad/categorias/{search?}', [CategoriaController::class, 'index'])
    ->name('spad.indexcategoria');
    Route::get('/spad/categoria/create', [CategoriaController::class, 'create'])->name('spad.createcategoria');
    Route::post('/spad/categoria/store', [CategoriaController::class, 'store'])->name('spad.storecategoria');
    Route::put('/spad/categoria/update/{categoria}', [CategoriaController::class, 'update'])->name('spad.updatecategoria');
    Route::get('/spad/categoria/edit/{categoria}', [CategoriaController::class, 'edit'])->name('spad.editcategoria');
    Route::delete('spad/categoria/delete/{categoria}', [CategoriaController::class, 'destroy'])->name('spad.deletecategoria');    




});

 






