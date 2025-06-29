<?php

use App\Http\Controllers\EmpleadoController;
use App\Http\Controllers\EmployeeScheduleController;
use App\Http\Controllers\ScheduleController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::get('empleados', [EmpleadoController::class, 'index'])
     ->middleware(['auth', 'verified'])
      ->name('empleados.index');

Route::get('empleados/create', [EmpleadoController::class, 'create'])
    ->middleware(['auth', 'verified'])
    ->name('empleados.create');

Route::post('empleados', [EmpleadoController::class, 'store'])
    ->middleware(['auth', 'verified'])
    ->name('empleados.store');

Route::delete('empleados/{empleado}', [EmpleadoController::class, 'destroy'])
        ->middleware(['auth', 'verified'])
        ->name('empleados.destroy');

Route::get('empleados/{empleado}/edit', [EmpleadoController::class, 'edit'])
    ->middleware(['auth', 'verified'])
    ->name('empleados.edit');

Route::put('empleados/{empleado}', [EmpleadoController::class, 'update'])
    ->middleware(['auth', 'verified'])
    ->name('empleados.update');

Route::get('generate-qr/{text}', function ($text) {
    // Genera un QR como SVG (o PNG, EPS, etc.)

    try {
        // code...

        // Sanitizar $text para evitar inyecciones o caracteres no válidos
        $sanitizedText = filter_var($text, FILTER_SANITIZE_URL);
        info('Generando QR con el texto: ', ['data' => $sanitizedText]);

        // Opcional: Validar que sea una cadena válida para una URL
        if (empty($sanitizedText)) {
            return response()->json([
                'error' => 'Texto inválido para generar el QR.',
            ], 400);
        }

        $data = 'https://'.$sanitizedText;

        // Generar QR como imagen en base64
        $qrBase64 = base64_encode(
            QrCode::format('png')->size(200)->generate($data)
        );

        return response()->json([
            'url' => $data,
            'qr' => 'data:image/png;base64,'.$qrBase64,
        ]);

    } catch (\Throwable $th) {
        // throw $th;
        return response()->json([
            'error' => 'Error al generar el QR: '.$th->getMessage(),
        ]);
    }

})->name('g.qr');

Route::get('qr', function () {
    return Inertia::render('Qrgenerador/qr');
})->name('qr');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/schedules', [ScheduleController::class, 'index'])->name('schedules.index');
    Route::post('/schedules', [ScheduleController::class, 'store'])->name('schedules.store');
    Route::put('/schedules/{schedule}', [ScheduleController::class, 'update'])->name('schedules.update');
    Route::delete('/schedules/{schedule}', [ScheduleController::class, 'destroy'])->name('schedules.destroy');
});

Route::prefix('employee-schedules')->group(function () {
    Route::post('/assign', [EmployeeScheduleController::class, 'assign']);
    Route::put('/{assignment}', [EmployeeScheduleController::class, 'update']);
    Route::get('/employee/{empleado}', [EmployeeScheduleController::class, 'forEmployee']);
     Route::get('/eh', [EmployeeScheduleController::class, 'forEmployeeSchedules'])
   ->name('empleado.horario');

  
    Route::get('/schedule/{schedule}', [EmployeeScheduleController::class, 'forSchedule']);
    Route::get('/show', [EmployeeScheduleController::class, 'show'])
        ->name('asignar.show');

})->middleware(['auth', 'verified']);



require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
