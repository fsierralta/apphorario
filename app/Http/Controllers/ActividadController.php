<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Empleado;
use App\Models\RegistroEntradas;

class ActividadController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
          $empleados=Empleado::with(['schedules'=>function($q){
            $q->with(['days'])
            ->orderByPivot('start_date', 'desc');
        },
        "registroEntradas"=>function($q){
            $q->where('registro_fecha', now()->toDateString());
        }])
        ->where("user_id","=",auth()->user()->id)
        ->get();

     info("empleado:",["data"=>$empleados,"user"=>auth()->user()]);

        return Inertia::render("movimiento/registro", [
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
        //
      
        
          try {
            //code
            $empleado= $empleado->with(['schedules' => function ($query)  {
                                        $query->with('days')
                                        ->orderByPivot('start_date', 'desc');
                                        }
                                       
                                        ])->findOrFail($empleado->id);
      //    return response()->json($empleado);
        info('empleado', ['empleado' => $empleado]);
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
            return redirect()->route('actividad.index');





        } catch (\Throwable $th) {
            //throw $th;
            info('error',['error'=>$th->getMessage()]);
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
