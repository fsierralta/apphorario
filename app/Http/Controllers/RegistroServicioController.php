<?php

namespace App\Http\Controllers;

use App\Models\ComisionEmpledo;
use App\Models\RegistroServicio;
use App\service\RegistroServicioService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Models\TotalServicio;
use  Illuminate\Support\Facades\DB;
use App\Models\Empleado;
use App\Models\Cliente;
use App\Models\Servicio;   
use Carbon\Carbon;
class RegistroServicioController extends Controller
{
    public function __construct(private readonly RegistroServicioService $service)
    {
    }

    private function calcularComisionValor(int $empleadoId, float $subtotal): float
    {
        $comisionEmpleado = ComisionEmpledo::query()
            ->with('comision')
            ->where('empleado_id', $empleadoId)
            ->first();

        if (! $comisionEmpleado || ! $comisionEmpleado->comision) {
            return 0.00;
        }

        return round(($subtotal * (float) $comisionEmpleado->comision->valor) / 100, 2);
    }

    public function index(Request $request)
    {
       info('Datos recibidos para filtrar total servicios: ', $request->all());
       
        $fechaInicio = $request->filled('fecha_inicio')
            ? $request->query('fecha_inicio')
            : now()->toDateString();

        $fechaFin = $request->filled('fecha_fin')
            ? $request->query('fecha_fin')
            : now()->toDateString();

        $totalServicios = TotalServicio::query()
            ->join('empleados', 'total_servicios.empleado_id', '=', 'empleados.id')
            ->join('clientes', 'total_servicios.cliente_id', '=', 'clientes.id')
            ->select('total_servicios.*', 'empleados.nombre', 'empleados.apellido', 'clientes.nombre as cliente_name')
            ->whereBetween('total_servicios.fecha', [Carbon::parse($fechaInicio), Carbon::parse($fechaFin)])
            ->latest()
            ->paginate(10);

        $totalServicios->appends([
            'fecha_inicio' => $fechaInicio,
            'fecha_fin' => $fechaFin,
        ]);

        return Inertia::render('spad/total-servicio/index', [
            'totalServicios' => $totalServicios,
            'fechaInicio' => $fechaInicio,
            'fechaFin' => $fechaFin,
            'totalServiciosCount' => $totalServicios->sum('total'),

        ]);
    }

    public function detail($totalServicioId){
        $registroServicios = RegistroServicio::query()
        ->join('total_servicios', 'registro_servicios.total_servicio_id', '=', 'total_servicios.id')
        ->join('servicios', 'registro_servicios.servicio_id', '=', 'servicios.id')
        ->join('clientes', 'registro_servicios.cliente_id', '=', 'clientes.id')
        ->select('registro_servicios.*', 'total_servicios.nro_factura', 'servicios.nombre_servicio as servicio_name', 'clientes.nombre as cliente_name')
        ->where('total_servicio_id', $totalServicioId)
        ->get();

 

    return Inertia::render('spad/registro-servicio/detail', [
        'registroServicios' => $registroServicios,
    ]);


    }


   

    public function create(Request $request)
    {
        return Inertia::render('spad/registro-servicio/create', [
            'servicios' =>Servicio::query()->where('estado', 'activo')->get(),
            'clientes' => Cliente::query()->get(),
            'cliente_id' => $request->query('cliente_id'),
            'empleado_id' => $request->query('empleado_id'),
        ]);
    }

    public function store(Request $request)
    {
        Log::info('Datos recibidos para crear registros de servicio: ', $request->all());

        // Resolver empleado_id: first from request, otherwise from authenticated user's employee record.
        $empleadoId = $request->input('empleado_id');
        if (!$empleadoId) {
            $empleado = Empleado::where('user_id', auth()->id())->first();
            $empleadoId = $empleado ? $empleado->id : null;
        }
        $request->merge(['empleado_id' => $empleadoId]);

        $validated = $request->validate([
            'cliente_id' => 'required|exists:clientes,id',
            'fecha_servicio' => 'required|date',
            'empleado_id' => 'required|exists:empleados,id',
            'items' => 'required|array|min:1',
            'items.*.servicio_id' => 'required|exists:servicios,id',
            'items.*.cantidad' => 'required|numeric|min:1',
            'items.*.precio' => 'required|numeric|min:0',
        ]);

        try {
               DB::transaction(function () use ($validated) {
                // Calculate subtotal
                $subtotal = 0;
                foreach ($validated['items'] as $item) {
                    $subtotal += $item['cantidad'] * $item['precio'];
                }

                // Generate invoice number
                $nroFactura = 'FAC-' . now()->format('YmdHis') . '-' . rand(100, 999);
                $comisionValor = $this->calcularComisionValor((int) $validated['empleado_id'], (float) $subtotal);

                // Create TotalServicio
                $totalServicio =TotalServicio::create([
                    'cliente_id' => $validated['cliente_id'],
                    'empleado_id' => $validated['empleado_id'],
                    'fecha' => $validated['fecha_servicio'],
                    'subtotal' => $subtotal,
                    'impuesto' => 0,
                    'descuento' => 0,
                    'total' => $subtotal,
                    'nro_factura' => $nroFactura,
                    'comision_valor' => $comisionValor,
                    'comision_estado' => 'pendiente',
                ]);

                // Create individual RegistroServicio records associated with TotalServicio
                foreach ($validated['items'] as $item) {
                    $this->service->create([
                        'servicio_id' => $item['servicio_id'],
                        'cliente_id' => $validated['cliente_id'],
                        'fecha_servicio' => $validated['fecha_servicio'],
                        'cantidad' => $item['cantidad'],
                        'precio' => $item['precio'],
                        'total_servicio_id' => $totalServicio->id,
                    ]);
                }
            });

            return redirect()->route('registro-servicio.index')->with('success', 'Registros creados correctamente.');
        } catch (\Throwable $e) {
            Log::error('Error al crear registros de servicio: '.$e->getMessage());

            return back()->with('error', 'No se pudo crear el registro.')->withInput();
        }
    }

    public function edit(RegistroServicio $registroServicio)
    {
        return Inertia::render('spad/registro-servicio/edit', [
            'registroServicio' => $registroServicio,
            'servicios' => Servicio::query()->where('estado', 'activo')->get(),
            'clientes' => Cliente::query()->get(),
        ]);
    }

    public function update(Request $request, RegistroServicio $registroServicio)
    {
        $validated = $request->validate([
            'servicio_id' => 'required|exists:servicios,id',
            'cliente_id' => 'required|exists:clientes,id',
            'fecha_servicio' => 'required|date',
            'cantidad' => 'required|numeric|min:1',
            'precio' => 'required|numeric|min:0',
        ]);

        try {
            DB::transaction(function () use ($registroServicio, $validated) {
                // Update the registro
                $this->service->update($registroServicio, $validated);

                // If associated with a total_servicio, recalculate
                if ($registroServicio->total_servicio_id) {
                    $totalServicio = $registroServicio->totalServicio;
                    if ($totalServicio) {
                        // Sum up all associated registro_servicios
                        $subtotal = $totalServicio->registroServicios()->sum(\DB::raw('cantidad * precio'));
                        $comisionValor = $this->calcularComisionValor((int) $totalServicio->empleado_id, (float) $subtotal);

                        $totalServicio->update([
                            'subtotal' => $subtotal,
                            'total' => $subtotal + $totalServicio->impuesto - $totalServicio->descuento,
                            'comision_valor' => $comisionValor,
                        ]);
                    }
                }
            });

            return redirect()->route('registro-servicio.index')->with('success', 'Registro actualizado correctamente.');
        } catch (\Throwable $e) {
            Log::error('Error al actualizar registro de servicio: '.$e->getMessage());

            return back()->with('error', 'No se pudo actualizar el registro.')->withInput();
        }
    }

    public function destroy(RegistroServicio $registroServicio)
    {
        try {
            \Illuminate\Support\Facades\DB::transaction(function () use ($registroServicio) {
                $totalServicioId = $registroServicio->total_servicio_id;

                // Delete the registro
                $this->service->delete($registroServicio);

                // Recalculate or delete parent if no items left
                if ($totalServicioId) {
                    $totalServicio = TotalServicio::find($totalServicioId);
                    if ($totalServicio) {
                        if ($totalServicio->registroServicios()->count() === 0) {
                            $totalServicio->delete();
                        } else {
                            $subtotal = $totalServicio->registroServicios()->sum(\DB::raw('cantidad * precio'));
                            $comisionValor = $this->calcularComisionValor((int) $totalServicio->empleado_id, (float) $subtotal);

                            $totalServicio->update([
                                'subtotal' => $subtotal,
                                'total' => $subtotal + $totalServicio->impuesto - $totalServicio->descuento,
                                'comision_valor' => $comisionValor,
                            ]);
                        }
                    }
                }
            });

            return redirect()->route('registro-servicio.index')->with('success', 'Registro eliminado correctamente.');
        } catch (\Throwable $e) {
            Log::error('Error al eliminar registro de servicio: '.$e->getMessage());

            return back()->with('error', 'No se pudo eliminar el registro.');
        }
    }
}
