
<?php
use App\Http\Controllers\EmployeeScheduleController;
use App\Http\Middleware\AdminEmpleado;

Route::prefix('employee-schedules')->group(function () {
    Route::post('/assign', [EmployeeScheduleController::class, 'assign']);
    Route::put('/{assignment}', [EmployeeScheduleController::class, 'update']);
    Route::get('/employee/{empleado}', [EmployeeScheduleController::class, 'forEmployee']);
    Route::get('/eh', [EmployeeScheduleController::class, 'forEmployeeSchedules'])
   ->name('empleado.horario');
   Route::get('/showformhorario', [EmployeeScheduleController::class, 'showEmpleadoHorario'])
   ->name('showformhorario.show');
   Route::post('/showformhorario/{empleado}/tipo/{tipo}', [EmployeeScheduleController::class, 'showEmpleadoHorarioRegister'])
    ->name('showformhorario.register');
   Route::get('/schedule/{schedule}', [EmployeeScheduleController::class, 'forSchedule']);
   Route::get('/show', [EmployeeScheduleController::class, 'show'])
        ->name('asignar.show');

})->middleware(['auth', 'verified',AdminEmpleado::class]);
