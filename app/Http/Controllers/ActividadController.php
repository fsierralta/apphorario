<?php

namespace App\Http\Controllers;

use App\Models\Empleado;
use App\Models\RegistroEntradas;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ActividadController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $empleados = Empleado::with(['schedules' => function ($q) {
            $q->with(['days'])
                ->orderByPivot('start_date', 'desc');
        },
            'registroEntradas' => function ($q) {
                $q->where('registro_fecha', now()->toDateString());
            }])
            ->where('user_id', '=', auth()->user()->id)
            ->get();

     //   info('empleado:', ['data' => $empleados, 'user' => auth()->user()]);

        return Inertia::render('movimiento/registro', [
            'empleados' => $empleados,
        ]);

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Empleado $empleado, $tipo)
    {
        // 1. Autorización: Verificar que el empleado corresponde al usuario autenticado.
        if ($empleado->user_id !== auth()->id()) {
            abort(403, 'No autorizado para esta acción.');
        }
      //  info('empleado:', ['data' => $empleado, 'user' => auth()->user()]);


        try {
            // 2. Obtener el horario activo del empleado de forma segura.
            $activeSchedule = $empleado->activeSchedule()->first();

            if (! $activeSchedule) {
                return back()->with('error', 'El empleado no tiene un horario activo asignado.');
            }

            // 3. Crear el registro de entrada/salida. firstOrCreate previene duplicados.
            RegistroEntradas::firstOrCreate(
                [
                    'empleado_id' => $empleado->id,
                    'registro_fecha' => now()->toDateString(),
                    'tipo' => $tipo,
                ],
                [
                    'schedule_id' => $activeSchedule->id,
                    'registro_hora' => now(),
                ]
            );

            return redirect()->route('actividad.index')->with("success", "Registrada su:".
                                                 strtoupper($tipo)." a las:"
                                                 .now()->format('H:i:s') );
        } catch (\Throwable $th) {
            info('error', ['error' => $th->getMessage()]);
            return back()->with('error', 'Ocurrió un error al registrar la actividad.'. ' ' . $th->getMessage());
        }

    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
