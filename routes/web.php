<?php

use App\Http\Controllers\ActividadController;
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





Route::get('/actividad',[ActividadController::class,"index"])
    ->middleware(['auth', 'verified'])
    ->name('actividad.index');

Route::post('/actividad/{empleado}/{tipo}', [ActividadController::class, 'store'])
    ->middleware(['auth', 'verified'])
    ->name('actividad.store');  



require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/empleado.php';
require __DIR__.'/schedule.php';
require __DIR__.'/empleadoSchedule.php';


