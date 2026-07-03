<?php

namespace App\Http\Controllers;

use App\Models\RegistroServicio;
use App\service\RegistroServicioService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class RegistroServicioController extends Controller
{
    public function __construct(private readonly RegistroServicioService $service)
    {
    }

    public function index()
    {
        $registroServicios = RegistroServicio::query()
            ->with(['servicio', 'cliente'])
            ->latest()
            ->paginate(10);

        return Inertia::render('spad/registro-servicio/index', [
            'registroServicios' => $registroServicios,
        ]);
    }

    public function create(Request $request)
    {
        return Inertia::render('spad/registro-servicio/create', [
            'servicios' => \App\Models\Servicio::query()->where('estado', 'activo')->get(),
            'clientes' => \App\Models\Cliente::query()->get(),
            'cliente_id' => $request->query('cliente_id'),
            'empleado_id' => $request->query('empleado_id'),
        ]);
    }

    public function store(Request $request)
    {
        log::info('Datos recibidos para crear registros de servicio: ', $request->all());
        $validated = $request->validate([
            'cliente_id' => 'required|exists:clientes,id',
            'fecha_servicio' => 'required|date|date_equals:'.now()->toDateString(),
            'items' => 'required|array|min:1',
            'items.*.servicio_id' => 'required|exists:servicios,id',
            'items.*.cantidad' => 'required|numeric|min:1',
            'items.*.precio' => 'required|numeric|min:0',
        ]);

        try {
            foreach ($validated['items'] as $item) {
                $this->service->create([
                    'servicio_id' => $item['servicio_id'],
                    'cliente_id' => $validated['cliente_id'],
                    'fecha_servicio' => $validated['fecha_servicio'],
                    'cantidad' => $item['cantidad'],
                    'precio' => $item['precio'],
                ]);
            }

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
            'servicios' => \App\Models\Servicio::query()->where('estado', 'activo')->get(),
            'clientes' => \App\Models\Cliente::query()->get(),
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
            $this->service->update($registroServicio, $validated);

            return redirect()->route('registro-servicio.index')->with('success', 'Registro actualizado correctamente.');
        } catch (\Throwable $e) {
            Log::error('Error al actualizar registro de servicio: '.$e->getMessage());

            return back()->with('error', 'No se pudo actualizar el registro.')->withInput();
        }
    }

    public function destroy(RegistroServicio $registroServicio)
    {
        try {
            $this->service->delete($registroServicio);

            return redirect()->route('registro-servicio.index')->with('success', 'Registro eliminado correctamente.');
        } catch (\Throwable $e) {
            Log::error('Error al eliminar registro de servicio: '.$e->getMessage());

            return back()->with('error', 'No se pudo eliminar el registro.');
        }
    }
}
