<?php

use App\Http\Controllers\ComisionController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('comisiones', [ComisionController::class, 'index'])->name('comision.index');
    Route::get('comision/create', [ComisionController::class, 'create'])->name('comision.create');
    Route::post('comision', [ComisionController::class, 'store'])->name('comision.store');
    Route::get('comision/{comision}/edit', [ComisionController::class, 'edit'])->name('comision.edit');
    Route::put('comision/{comision}', [ComisionController::class, 'update'])->name('comision.update');
    Route::delete('comisions/{comision}', [ComisionController::class, 'destroy'])->name('comisions.destroy');
});
