<?php

namespace App\Http\Controllers;

use App\Http\Requests\Empleado\EmpleadoRequest;
use App\Models\Empleado;
use App\Models\User;
use App\service\EmpleadoService;
use Illuminate\Http\Request;
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
    ];

    public function index()
    {
        //   const {auth}=usePage
        try {
            // Verificar si el usuario tiene el rol de admin
            // Define la cantidad de elementos por página usando la propiedad protegida
            $users = User::query()->select('id', 'name')->get();

            $empleados = Empleado::query()->select('id', 'nombre', 'apellido',
                'cedula', 'telefono', 'direccion',
                'foto_url', 'cargo', 'user_id', 'email')
                ->paginate((new Empleado)->getPerPage());
            // return response()->json($empleados);

            return Inertia::render('Empleado/index', ['empleados' => $empleados]
            );

        } catch (\Exception $e) {
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
            return redirect()->route('empleados.index')->with('error', 'Error al cargar el empleado: '.$e->getMessage());
        }
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
        try {
            $empleado = Empleado::findOrFail($id);
            $empleado->delete();

            return redirect()->route('empleados.index')->with('success', 'Empleado eliminado exitosamente.');
        } catch (\Exception $e) {
            return redirect()->route('empleados.index')->with('error', 'Error al eliminar empleado: '.$e->getMessage());
        }

    }
}
