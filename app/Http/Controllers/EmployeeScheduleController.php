<?php

namespace App\Http\Controllers;

use App\Models\Empleado;
use App\Models\RegistroEntradas;
use App\Models\Schedule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

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
    ])->whereHas('schedules')
    ->select('id', 'nombre', 'cedula', 'apellido')
    ->paginate(2); 
            
       

      //  return response()->json($empleados);                         
      return    Inertia::render('Empleado/EmpleadoHorarioIndex', [
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

    public function showEmpleadoHorario(){

        $empleados=Empleado::with(['schedules'=>function($q){
            $q->with(['days'])
            ->orderByPivot('start_date', 'desc');
        },
        "registroEntradas"=>function($q){
            $q->where('registro_fecha', now()->toDateString());
        }])
        ->get();

     //return response()->json($empleados);

        return Inertia::render("Empleado/registrarEntrada", [
            'empleados' => $empleados,
        ]);




    }

    public function showEmpleadoHorarioRegister(Empleado $empleado, $tipo)
    {
        // Obtener el horario del empleado
      //  info('empleado', ['empleado' => $empleado]);
        
        try {
            //code
            $empleado= Empleado::with(['schedules' => function ($query)  {
                                        $query->with('days')
                                        ->orderByPivot('start_date', 'desc');
                                        }
                                       
                                        ])->findOrFail($empleado->id);
       //   return response()->json($empleado);
            $registroEntrada=RegistroEntradas::firstOrCreate(
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
            info('registroEntrada', ['registroEntrada' => $registroEntrada]);

            return $this->showEmpleadoHorario();






        } catch (\Throwable $th) {
            //throw $th;
            info('error',['error'=>$th->getMessage()]);
        }
     


    }   
    public function showEmpleadoAsistencia(Request $request)
    {
      
      try {
          // Default to today's date if not provided
         $fechai = $request->has('fechai') ? Carbon::parse($request->fechai)->toDateString() : now()->toDateString();
         $fechaf = $request->has('fechaf') ? Carbon::parse($request->fechaf)->toDateString() : now()->toDateString();
         $empleado_id = (Int) $request->empleado_id;
         $tipo = $request->has('tipo') ?    $request->tipo : '';

        
       

        $empleadosQuery = Empleado::with([
            'schedules' => function ($q) {
                $q->with(['days'])
                ->wherePivot('is_active',true)
                ->orderByPivot('start_date', 'asc');
            },
            'registroEntradas' => function ($q) use ($fechai, $fechaf, $empleado_id,$tipo) {
                $q->whereBetween('registro_fecha', [$fechai,$fechaf])
                ->orderBy('registro_fecha', 'asc');
                if($tipo!==''){
                    $q->where('tipo','=',$tipo);
                }
                      
               
            }
        ]);

        if ($empleado_id !== 0) {
            $empleadosQuery->where('id', $empleado_id);
        }
     

      
        
       

        $empleados = $empleadosQuery->paginate(2);

         $empleados->appends([
            "fechai" => $fechai,
            "fechaf" => $fechaf,
            "empleado_id" => $empleado_id,
            "tipo" => $tipo


        ]);
  //  return response()->json($empleados);
         return Inertia::render('Empleado/Asistencia',[
            'empleados'=>$empleados,
            'fechai' => $fechai,
            'fechaf' => $fechaf,
            'empleado_id' => $empleado_id,

           
         ]);


         
      }
      catch (\Throwable $th){
        //throw $th;
        info('error',['error'=>$th->getMessage()]);
      }

      
         
 
    }

    public function reporteFallas($fechai,$fechaf,$empleado_id,$tipo){

        try {
            //code...
            $empleadosQuery = Empleado::with([
                    'schedules'=>function($q) use($fechai,$fechaf)
                                         {
                                                $q->with('days')
                                               ->orderByPivot('start_date', 'asc');
                                         },
                    'registroEntradas'=> function ($q) use($fechai, $fechaf,$empleado_id,$tipo)
                                        {
                                            $q->orderBy('registro_fecha','asc')
                                            ->whereBetween('registro_fecha',[$fechai,$fechaf]);

                                           
                                            if($tipo!==''){
                                                $q->where('tipo','=',$tipo);
                                            }

                                        }
                   
                    ]);
                      
             if ($empleado_id !== 0) {
                        $empleadosQuery->where('id', $empleado_id);
                }
            $empleados=$empleadosQuery->get();
            info('data',["data"=>$empleados]);
             // Filtrar empleados sin entradas
       
            $empleadosSinEntradas = $empleados->filter(function ($empleado) {
            return $empleado->registroEntradas->
                             countBy();
         });
       

        info('data', ["empleados_sin_entradas" => $empleadosSinEntradas]);
        
        return response()->json([
            'empleados_sin_entradas' => $empleadosSinEntradas,
            'total_empleados' => $empleados->count(),
          
        ]);

       //     return response()->json($empleados);
        } catch (\Throwable $th) {
            //throw $th;
            info('erro',['errr'=>$th->getMessage()]);
        }


    
    
        }
    }
