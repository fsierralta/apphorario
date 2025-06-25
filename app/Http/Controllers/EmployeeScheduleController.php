<?php

namespace App\Http\Controllers;

use App\Models\Empleado;
use App\Models\Schedule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class EmployeeScheduleController extends Controller
{
    /**
     * Asignar horario a empleado
     */
    public function assign(Request $request)
    {

        try {
            // code...
            info('horario', ['r' => $request]);
            $validated = $request->validate([
                'empleado_id' => 'required|exists:empleados,id',
                'schedule_id' => 'required|exists:schedules,id',
                'start_date' => 'required|date',
                'end_date' => 'nullable|date|after:start_date',
                'is_active' => 'boolean',
            ]);

            $empleado = Empleado::findOrFail($validated['empleado_id']);

            // Desactivar asignaciones anteriores si es necesario
            if ($request->input('deactivate_others', false)) {
                $empleado->schedules()->updateExistingPivot(null, [
                    'is_active' => false,
                ]);
            }
            // Asignar nuevo horario
            $attached = $empleado->schedules()->attach($validated['schedule_id'], [
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'] ?? null,
                'is_active' => $validated['is_active'] ?? true,
            ]);

            /*  // Asignar nuevo horario
             $attached = DB::table('employee_schedule')
                 ->insert(
                      [
                         'empleado_id'=>$validated['empleado_id'] ,
                         'schedule_id' => $validated['schedule_id'],
                         'start_date' => $validated['start_date'],
                         'end_date' => $validated['end_date'] ?? null,
                         'is_active' => $validated['is_active'] ?? true
                     ]
                 )
             */

            info('inserto', ['inserto' => $attached]);
            if ($attached === false) {
                throw new \Exception('No se pudo asignar el horario al empleado.');
            }
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

        return response()->json([$schedules,"empleado"=>$empleado]);
    }

    public function forEmployeeSchedules(){
        $empleados = Empleado::with([
        'schedules' => function ($q) {
            $q->with(['days']) // Asumiendo que la relación se llama 'days'
              ->orderByPivot('start_date', 'desc');
        }
    ])
    ->whereHas('schedules')
    ->select('id', 'name', 'email', 'is_active')
    ->get();
            ;
      //  info('empleados', ['empleado' => $empleados]);

                                  /*   $schedules = $empleado->schedules()
            ->orderByPivot('start_date', 'desc')
            ->paginate(10);
 */
        return response()->json(["empleado"=>$empleados]);


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
}
