<?php

namespace App\Http\Controllers;

use App\Http\Requests\Empleado\EmpleadoRequest;
use App\Models\Empleado;
use App\Models\User;
use App\service\EmpleadoService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EmpleadoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    protected $cargos = [
        'Gerente General',
        'Supervisor de Ventas',
        'Analista de Sistemas',
        'Asistente Administrativo',
        'Jefe de Logística',
        'Estilista',
        'Peluquero',
        'Maquillador',
        "Empleado",
        'Vendedor',
        'Encargado',


    ];

    public function index()
    {
        //   const {auth}=usePage
        

        try {
        
            $users = User::query()->select('id', 'name')->get();
            

            $empleados = Empleado::query()->select('id', 'nombre', 'apellido',
                'cedula', 'telefono', 'direccion',
                'foto_url', 'cargo', 'user_id', 'email')
                ->paginate((new Empleado)->getPerPage());
            // return response()->json($empleados);

            return Inertia::render('Empleado/index', ['empleados' => $empleados]
            );

        } catch (\Exception $e) {
            info('empleados', ['user' => $e->getMessage()]);
            return redirect()->route('home')->with('error', 'Error al verificar permisos: '.$e->getMessage());
        }

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
        try {

            return Inertia::render('Empleado/create', [
                'cargos' => $this->cargos,
            ]);

        } catch (\Exception $e) {
            return redirect()->route('home')->with('error', 'Error al verificar permisos: '.$e->getMessage());
        }

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(EmpleadoRequest $request, EmpleadoService $empleadoService)
    {
        return $empleadoService->store($request, new Empleado);

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
        try {
            $empleado = Empleado::findOrFail($id);
         


            return Inertia::render('Empleado/edit', [
                'empleado' => $empleado,
                'cargos' => $this->cargos,
            ]);
        } catch (\Exception $e) {
              info('ruta',['ruta'=>$e->getMessage()]);

            return redirect()->route('empleados.index')->with('error', 'Error al cargar el empleado: '.$e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(EmpleadoRequest $request, string $id)
    {
        //
        info('update', ['id' => $id, 'request' =>$request->input('nombre') ]);
  try {
        //code...
          
         if ($request->hasFile('foto_url')) {
                $path = $request->file('foto_url')->store('empleados', 'public');

            } else {
                $path =null;
            }   
             info('update',['id'=>$id,'r'=>$request->nombre,
                         'path'=>$path]);
         
             $empleado=Empleado::find((int) $id);
            $empleado->nombre = $request->nombre;
            $empleado->apellido = $request->apellido;
            $empleado->cedula = $request->cedula;
             $empleado->email = $request->email;
            $empleado->telefono = $request->telefono;
            $empleado->direccion = $request->direccion;
            $empleado->foto_url = $path ? "storage/".$path:$empleado->foto_url;
            $empleado->cargo = $request->cargo;
            $empleado->save(); 
            return redirect()->route('empleados.index');

       } catch (\Throwable $th) {
        //throw $th;
        info('error',['error'=>$th->getMessage()]);
        return back()->with('errors',$th->getMessage());


    }
}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        try {
            $empleado = Empleado::findOrFail($id);
            $empleado->delete();

            return redirect()->route('empleados.index')->with('success', 'Empleado eliminado exitosamente.');
        } catch (\Exception $e) {
            return redirect()->route('empleados.index')->with('error', 'Error al eliminar empleado: '.$e->getMessage());
        }

    }
}
