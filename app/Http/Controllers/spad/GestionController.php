<?php

namespace App\Http\Controllers\spad;

use App\Citas\HorariosCitas;
use App\Http\Controllers\Controller;
use App\Models\Cita;
use App\Models\Cliente;
use App\Models\Empleado;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class GestionController extends Controller
{
    //
    public $horast = [];

    public function __construct()
    {
        $this->horast = new HorariosCitas()->genHorario();

    }

    public function indexCita(Request $request)
    {

        $citas = Cita::select('citas.*')
            ->join('empleados', 'citas.empleado_id', 'empleados.id')
            ->where('citas.estado', 'pendiente')
            ->whereDate('citas.fecha_hora', '=', Carbon::now()->toDateString())
            ->get();

        $empleados = Empleado::select('empleados.*')
            ->orderBy('empleados.id', 'asc')
            ->paginate(8); // Lógica para obtener los empleados desde la base de datos

        return Inertia::render('spad/cita/index', [
            'empleados' => $empleados,
            'horas' => $this->horast,
            'citas' => $citas,

        ]);
    }

    public function createCita(Request $request)
    {
        // Lógica para mostrar el formulario de creación de cita
        try {
            $clientes = Cliente::paginate(10); // Aquí puedes obtener los clientes desde la base de datos si es necesario
            $citaHorarios = new HorariosCitas;
            $citaHorarios->genHorario();
            $horast = $citaHorarios->horas;

            // info("horad",["data" => $horast]);

            return Inertia::render('spad/cita/create',
                [
                    'clientes' => $clientes,
                    'horas' => $horast,
                ]);
        } catch (Exception $e) {
            Log::error('Error:', ['message' => $e->getMessage()]);

            return redirect()->route('spad.indexcita');

        }

    }

    public function showCitaForm(Request $request, $empleado_id)
    {

        try {

            if (! $empleado_id) {
                return redirect()->route('spad.indexcita')->with(['error' => 'Debe seleccionar un empleado']);

            }
            if (! $request->has('search')) {
                $request->merge(['search' => '']);
            }
            $clientes = Cliente::query();

            if ($request->search) {
                $clientes->where('nombre', 'like', "%{$request->search}%");
            }

            $cl = $clientes->paginate(10); // Aquí puedes obtener los clientes desde la base de datos si es necesario

            $empleado = Empleado::findOrFail($empleado_id);

            return Inertia::render('spad/empleado/citacreateForm', ['empleado' => $empleado, 'hora' => $this->horast, 'clientes' => $cl]);

        } catch (Exception $error) {
            Log::error('error', ['error' => $error->getMessage().' linea:'.$error->getLine()]);

            return redirect()->route('spad.indexcita');
        }

    }

    public function storeCita(Request $request)
    {
        Log::info('store', ['store' => $request->all()]);
        $validate = $request->validate([
            'empleado_id' => 'required',
            'cliente_id' => 'required|exists:clientes,id',
            'hora' => 'required',
            'fecha_hora' => 'required|after_or_equal:today',
            'estado' => 'required',
            'descripcion' => 'required',
        ]);

        try {

            $cita = new Cita;
            $cita->empleado_id = (int) $request->empleado_id;
            $cita->cliente_id = (int) $request->cliente_id;
            $cita->fecha_hora = Carbon::parse($request->fecha_hora.' '.$request->hora);
            $cita->estado = $request->estado;
            $cita->descripcion = $request->descripcion;
            $cita->save();

            // session(["success"=>"Cita creada correctamente"]);
            return redirect()->route('spad.showcitaform', $request->empleado_id)->with(['success' => 'Cita creada correctamente']);

        } catch (Exception $error) {
            Log::error('error', ['error' => $error->getMessage().'linea'.$error->getLine()]);

            return redirect()->route('spad.indexcita')->with(['error' => 'Error al crear la cita']);

        }

    }

    public function listaCita($empleado_id)
    {

        try {

            $data = explode('-', $empleado_id);
            $empleado_id = $data[1];

            $empleado = Empleado::findOrFail($empleado_id);
            $listaCita = Empleado::select('empleados.*',
                'citas.id as cita_id',
                'citas.fecha_hora as  cita_fecha_hora',
                'citas.estado as      cita_estado',
                'citas.descripcion as cita_descripcion',
                'citas.cliente_id as  cita_cliente_id',
                'clientes.nombre as   cte_nombre',
                'clientes.apellido as cte_apellido',
                'clientes.telefono as cte_telefono')
                ->join('citas', 'citas.empleado_id', 'empleados.id')
                ->join('clientes', 'clientes.id', 'citas.cliente_id')
                ->where('citas.estado', 'pendiente')
                ->where('empleados.id', '=', $empleado_id)
                ->whereDate('citas.fecha_hora', '>=', Carbon::now()->toDateString())
                ->paginate(5);

            return Inertia::render('spad/empleado/listaCitas', [
                'empleado' => $empleado,
                'citas' => $listaCita,
            ]);
        } catch (Exception $error) {
            Log::error('error', ['error' => $error->getMessage().'linea'.$error->getLine()]);

            return redirect()->route('spad.indexcita', $empleado_id)->with(['error' => 'Error al mostrar  la cita']);
        }

    }

    public function destroyCita(Cita $cita)
    {

        try {
            if ($cita) {
                Log::info('cita', ['cita' => $cita]);
                $cita->delete();

                return back()->with(['success' => 'Cita eliminada correctamente']);

                // dd($cita);
            }

        } catch (Exception $e) {
            Log::error('error delete cita', ['error' => $e->getMessage().'Line:'.$e->getLine()]);

            return redirect()->route('spad.indexcita');

        }

    }

    public function storeCliente(Request $request)
    {
        Log::info('store cliente', ['store' => $request->all()]);
        $validate = $request->validate([
            'nombre' => 'required',
            'apellido' => 'required',
            'cedula' => 'required|unique:clientes,cedula',
            'telefono' => 'nullable',
            'email' => 'required|unique:clientes,email',
            'direccion' => 'nullable',
            'foto_url' => 'nullable|url',
        ]);

        try {

            $cliente = new Cliente;
            $cliente->nombre = $request->nombre;
            $cliente->apellido = $request->apellido;
            $cliente->cedula = $request->cedula;
            $cliente->telefono = $request->telefono;
            $cliente->email = $request->email;
            // $cliente->direccion=$request->direccion;
            // $cliente->foto_url=$request->foto_url;
            $cliente->save();
            session(['success' => 'Cita creada correctamente']);

            return back()->with(['success' => 'Cliente creado correctamente']);
        } catch (Exception $e) {
            session(['error' => $e->getMessage().' linea:'.$e->getLine()]);
            Log::error('error', ['error' => $e->getMessage().' linea:'.$e->getLine()]);

            return redirect()->route('spad.createcita')->with(['error' => 'Error al crear el cliente']);
        }

    }
}
