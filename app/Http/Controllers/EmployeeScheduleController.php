<?php

namespace App\Http\Controllers;

use App\Exports\AttendanceExport;
use App\Models\Empleado;
use App\Models\RegistroEntradas;
use App\Models\Schedule;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class EmployeeScheduleController extends Controller
{
    /**
     * Asignar horario a empleado
     */
    public function assign(Request $request)
    {

        try {
            // code...
           // info('horario', ['r' => $request->toArray()]);
            $validated = $request->validate([
                'empleado_id' => 'required|exists:empleados,id',
                'schedule_id' => 'required|exists:schedules,id',
                'start_date' => 'required|date',
                'end_date' => 'required|date|after:start_date',
                'is_active' => 'boolean',
                'deactivate_others' => 'required|boolean',

            ]);

            $empleado = Empleado::findOrFail($validated['empleado_id']);

            // Desactivar asignaciones anteriores si es necesario
            if ($request->input('deactivate_others')) {
                if ($empleado->schedules()->where('schedule_id', '!=', $validated['schedule_id'])->exists()) {
                    $schedulesToDeactivate = $empleado->schedules()->where('schedule_id', '!=', $validated['schedule_id'])->get();
                    

                    foreach ($schedulesToDeactivate as $schedule) {
                        $empleado->schedules()->updateExistingPivot($schedule->id, ['is_active' => false]);
                    }
                }

            }

            // Asignar nuevo horario
            if ($empleado->schedules()->where('schedule_id', $validated['schedule_id'])->exists()) {
                $empleado->schedules()->updateExistingPivot($validated['schedule_id'], [
                    'start_date' => $validated['start_date'],
                    'end_date' => $validated['end_date'] ?? null,
                    'is_active' => $validated['is_active'] ?? true,
                ]);

            } else {
                $empleado->schedules()->attach($validated['schedule_id'], [
                    'start_date' => $validated['start_date'],
                    'end_date' => $validated['end_date'] ?? null,
                    'is_active' => $validated['is_active'] ?? true,
                ]);

            }

            return back()->with(['message' => 'Horario asignado correctamente']);

        } catch (\Throwable $th) {
            // throw $th;
            info('error', ['error' => $th->getMessage()]);

            return back()->with(['error' => $th->getMessage()]);
        }
    }

    /**
     * Actualizar asignación existente
     */
    public function update(Request $request, $assignmentId)
    {
        $validated = $request->validate([
            'start_date' => 'date',
            'end_date' => 'nullable|date|after:start_date',
            'is_active' => 'boolean',
        ]);

        // Buscar la asignación a través de la tabla pivote
        $assignment = DB::table('employee_schedule')
            ->where('id', $assignmentId)
            ->first();

        if (! $assignment) {
            return response()->json(['message' => 'Asignación no encontrada'], 404);
        }

        DB::table('employee_schedule')
            ->where('id', $assignmentId)
            ->update($validated);

        return response()->json(['message' => 'Asignación actualizada']);
    }

    /**
     * Listar asignaciones de un empleado
     */
    public function forEmployee(Empleado $empleado)
    {

        $schedules = $empleado->schedules()
            ->orderByPivot('start_date', 'desc')
            ->paginate(10);

        return response()->json([$schedules, 'empleado' => $empleado]);
    }

    public function forEmployeeSchedules()
    {
        $empleados = Empleado::with([
            'schedules' => function ($q) {
                $q->with(['days']) // Asumiendo que la relación se llama 'days'
                    ->orderByPivot('start_date', 'desc');
            },
        ])->whereHas('schedules')
            ->select('id', 'nombre', 'cedula', 'apellido')
            ->paginate(2);

        //  return response()->json($empleados);
        return Inertia::render('Empleado/EmpleadoHorarioIndex', [
            'empleados' => $empleados,
        ]);

    }

    /**
     * Listar empleados con un horario específico
     */
    public function forSchedule(Schedule $schedule)
    {
        $empleados = $schedule->empleados()
            ->orderByPivot('start_date', 'desc')
            ->paginate(10);

        return response()->json($empleados);
    }

    public function show()
    {
        $empleados = Empleado::all();
        $schedules = Schedule::all();

        return Inertia::render('asignarHorario/asignarHorarioEmpleado', [
            'empleados' => $empleados,
            'schedules' => $schedules,
        ]);
    }

    public function showEmpleadoHorario(Request $request)
    {
       $search = $request->has('search') ? $request->input('search'):"";
        if(!$request->has('page')){
               $request->merge(['page' => 1]);
               
         }
       //  info( 'page', ['page' => $request->input('page')]);   
       

        
        $empleados = Empleado::with(['schedules' => function ($q) {
            $q->with(['days'])
                ->orderByPivot('start_date', 'desc');
        },
            'registroEntradas' => function ($q) {
                $q->where('registro_fecha', now()->toDateString());
            }]);

        if ($search) {
            $empleados->where('nombre', 'like', '%'.$search.'%')
                ->orWhere('apellido', 'like', '%'.$search.'%')
                ->orWhere('cedula', 'like', '%'.$search.'%')
                ->orWhere('cargo', 'like', '%'.$search.'%');
        }
        $empleados = $empleados->paginate(3)
            ->withQueryString();

        // return response()->json($empleados);

        return Inertia::render('Empleado/registrarEntrada', [
            'empleados' => $empleados,
        ]);

    }

    public function showEmpleadoHorarioRegister(Request $request,Empleado $empleado, $tipo)
    {
        // Obtener el horario del empleado
         // info('empleado', ['empleado' => $empleado, "PAGE" => $request->input('page')]);

        try {
            // code
            $empleado = Empleado::with(['schedules' => function ($query) {
                $query->with('days')
                    ->orderByPivot('start_date', 'desc');
            },

            ])->findOrFail($empleado->id);
            //   return response()->json($empleado);
            $registroEntrada = RegistroEntradas::firstOrCreate(
                [
                    'empleado_id' => $empleado->id,
                    'registro_fecha' => now()->toDateString(),
                    'tipo' => $tipo,
                ],
                [
                    'schedule_id' => $empleado->schedules->first()->id ?? null,
                    'registro_hora' => now(),
                    'evento' => 1, // o el número de evento correspondiente
                    'observacion' => null,
                ]
            );

            return redirect()->route('showformhorario.show', ['page' => $request->input('page')])
                ->with('success', "Registro exitoso: {$empleado->nombre} {$empleado->apellido}");

        } catch (\Throwable $th) {
            // throw $th;
            info('error', ['error' => $th->getMessage()]);
        }

    }

    public function showEmpleadoAsistencia(Request $request)
    {

        try {
            // Default to today's date if not provided
            $fechai = $request->has('fechai') ? Carbon::parse($request->input('fechai'))->toDateString() : now()->toDateString();
            $fechaf = $request->has('fechaf') ? Carbon::parse($request->input('fechaf'))->toDateString() : now()->toDateString();
            $empleado_id = (int) $request->input('empleado_id');
            $tipo = $request->has('tipo') ? $request->input('tipo') : '';

            $empleadosQuery = Empleado::with([
                'schedules' => function ($q) use ($fechai, $fechaf, $tipo) {
                    $q->with(['days', 'entradas' => function ($query) use ($fechai, $fechaf, $tipo) {
                        $query->whereBetween('registro_fecha', [$fechai, $fechaf]);

                        if ($tipo !== '') {
                            $query->where('tipo', '=', $tipo);
                        }
                    },
                    ])
                        ->wherePivot('is_active', true)
                        ->orderByPivot('start_date', 'asc');
                },

            ]);

            if ($empleado_id !== 0) {
                $empleadosQuery->where('id', $empleado_id);
            }

            $empleados = $empleadosQuery->paginate(2);

            $empleados->appends([
                'fechai' => $fechai,
                'fechaf' => $fechaf,
                'empleado_id' => $empleado_id,
                'tipo' => $tipo,

            ]);

            //  return response()->json($empleados);
            return Inertia::render('Empleado/Asistencia', [
                'empleados' => $empleados,
                'fechai' => $fechai,
                'fechaf' => $fechaf,
                'empleado_id' => $empleado_id,

            ]);

        } catch (\Throwable $th) {
            // throw $th;
            info('error', ['error' => $th->getMessage()]);
        }

    }

    public function reporteFallas($fechai, $fechaf, $empleado_id, $tipo)
    {

        try {
            // code...
            $empleadosQuery = Empleado::with([
                'schedules' => function ($q) use ($fechai, $fechaf) {
                    $q->with(['days', 'entradas' => function ($query) use ($fechai, $fechaf) {
                        $query->whereBetween('registro_fecha', [$fechai, $fechaf]);
                        if ($tipo !== '') {
                            $query->where('tipo', '=', $tipo);
                        }
                    },
                    ])
                        ->orderByPivot('start_date', 'asc');
                },
                'registroEntradas' => function ($q) use ($fechai, $fechaf, $tipo) {
                    $q->orderBy('registro_fecha', 'asc')
                        ->whereBetween('registro_fecha', [$fechai, $fechaf]);

                    if ($tipo !== '') {
                        $q->where('tipo', '=', $tipo);
                    }

                },

            ]);

            if ($empleado_id !== 0) {
                $empleadosQuery->where('id', $empleado_id);
            }
            $empleados = $empleadosQuery->get();
            info('data', ['data' => $empleados]);
            // Filtrar empleados sin entradas

            $empleadosSinEntradas = $empleados->filter(function ($empleado) {
                return $empleado->registroEntradas->
                                 countBy();
            });

            info('data', ['empleados_sin_entradas' => $empleadosSinEntradas]);

            return response()->json([
                'empleados_sin_entradas' => $empleadosSinEntradas,
                'total_empleados' => $empleados->count(),

            ]);

            //     return response()->json($empleados);
        } catch (\Throwable $th) {
            // throw $th;
            info('erro', ['errr' => $th->getMessage()]);
        }

    }

    // //

    // In your controller
    public function report(Request $request)
    {
        info($request->all());
        $fechai = $request->has('fechai') ? Carbon::parse($request->input('fechai'))->toDateString() : now()->toDateString();
        $fechaf = $request->has('fechaf') ? Carbon::parse($request->input('fechaf'))->toDateString() : now()->toDateString();
        $empleado_id = (int) $request->input('empleado_id');
        $tipo = $request->has('tipo') ? $request->input('tipo') : null;
        $query = DB::table('empleados')
            ->select([
                'empleados.id',
                'empleados.nombre',
                'empleados.apellido',
                'empleados.cedula',
                'empleados.cargo',
                'registroentradas.registro_fecha',
                'registroentradas.schedule_id',
                DB::raw("MIN(CASE WHEN registroentradas.tipo = 'entrada' THEN registroentradas.registro_hora END) as hora_entrada"),
                DB::raw("MAX(CASE WHEN registroentradas.tipo = 'salida' THEN registroentradas.registro_hora END) as hora_salida"),
                DB::raw("MIN(CASE WHEN registroentradas.tipo = 'descanso' THEN registroentradas.registro_hora END) as inicio_descanso"),
                DB::raw("MAX(CASE WHEN registroentradas.tipo = 'regreso_descanso' THEN registroentradas.registro_hora END) as fin_descanso"),
                'schedules.name as horario',
            ])
            ->join('employee_schedule', 'empleados.id', '=', 'employee_schedule.empleado_id')
            ->join('schedules', 'schedules.id', '=', 'employee_schedule.schedule_id')
            ->join('registroentradas', function ($join) {
                $join->on('registroentradas.empleado_id', '=', 'empleados.id')
                    ->on('registroentradas.schedule_id', '=', 'employee_schedule.schedule_id');
            })
            ->where('employee_schedule.is_active', true)
            ->groupBy([
                'empleados.id',
                'empleados.nombre',
                'empleados.apellido',
                'empleados.cedula',
                'empleados.cargo',
                'registroentradas.registro_fecha',
                'registroentradas.schedule_id',
                'schedules.name',
            ]);

        // Apply filters
        if ($request->has('fechai')) {
            $query->whereDate('registroentradas.registro_fecha', '>=', Carbon::parse($fechai)->format('Y-m-d'));
        }

        if ($request->has('fechaf')) {
            $query->whereDate('registroentradas.registro_fecha', '<=', Carbon::parse($fechaf)->format('Y-m-d'));
        }

        if ($empleado_id !== 0) {
            $query->where('empleados.id', $empleado_id);
        }

        if (isset($tipo) && $tipo !== '') {
            $query->where('registroentradas.tipo', $tipo);
        }

        // Get employees for the filter dropdown
        $employees = DB::table('empleados')
            ->select('id', 'nombre', 'apellido')
            ->orderBy('id')
            ->get();

        // Check if export is requested
        if ($request->has('export')) {
            $data = $query->orderBy('registroentradas.registro_fecha', 'asc')->get();

            return Excel::download(new AttendanceExport($data), 'reporte_asistencia.xlsx');
        }

        $attendance = $query->orderBy('registroentradas.registro_fecha', 'asc')
            ->paginate(5)
            ->withQueryString()
            ->through(function ($item) {
                return $item;
            });

        // info("data",["data"=>dd($attendance)]);

        return Inertia::render('Reports/AttendanceReport', [
            'attendance' => [
                'data' => $attendance->items(),
                'current_page' => $attendance->currentPage(),
                'last_page' => $attendance->lastPage(),
                'per_page' => $attendance->perPage(),
                'total' => $attendance->total(),
                'links' => $attendance->linkCollection()->toArray(),
            ],
            'employees' => $employees,
            'filters' => $request->all(['fechai', 'fechaf', 'empleado_id', 'tipo']),
        ]);
    }
}
