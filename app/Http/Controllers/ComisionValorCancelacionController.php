<?php

namespace App\Http\Controllers;

use App\Models\ComisionValorCancelacion;
use App\Models\ControlRecibo;
use App\Models\Empleado;
use App\Models\FormaPago;
use App\Models\TotalServicio;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ComisionValorCancelacionController extends Controller
{
    public function index(Request $request)
    {
        $fechaInicio = $request->filled('fecha_inicio') ? $request->query('fecha_inicio') : now();
        $fechaFin = $request->filled('fecha_fin') ? $request->query('fecha_fin') : now()        ;
       info('Datos recibidos para filtrar cancelaciones de comisión: ', $request->all());
        $query = ComisionValorCancelacion::query()
            ->with(['totalServicio', 'empleado', 'formaPago'])
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('motivo', 'like', "%{$search}%")
                        ->orWhere('estado', 'like', "%{$search}%")
                        ->orWhereHas('empleado', function ($empleadoQuery) use ($search) {
                            $empleadoQuery->where('nombre', 'like', "%{$search}%")
                                ->orWhere('apellido', 'like', "%{$search}%");
                        })
                        ->orWhereHas('formaPago', function ($formaPagoQuery) use ($search) {
                            $formaPagoQuery->where('nombre_forma_pago', 'like', "%{$search}%");
                        });
                });
            })
            ->when($fechaInicio, fn ($query) => $query->whereDate('fecha_cancelacion', '>=', Carbon::parse($fechaInicio)))
            ->when($fechaFin, fn ($query) => $query->whereDate('fecha_cancelacion', '<=', Carbon::parse($fechaFin)))
            ->latest();

        $cancelaciones = $query->paginate(10)->withQueryString();
        $totales = (clone $query)
            ->selectRaw('COUNT(*) as registros, COALESCE(SUM(monto_cancelado), 0) as monto_cancelado')
            ->first();

        return Inertia::render('spad/comision-valor-cancelacion/index', [
            'cancelaciones' => $cancelaciones,
            'totales' => [
                'registros' => (int) ($totales->registros ?? 0),
                'monto_cancelado' => (float) ($totales->monto_cancelado ?? 0),
            ],
            'fechaInicio' => $fechaInicio,
            'fechaFin' => $fechaFin,
        ]);
    }

    public function create()
    {
        return Inertia::render('spad/comision-valor-cancelacion/create', [
            'totalServicios' => TotalServicio::query()->with(['cliente', 'empleado', 'cancelaciones'])->orderBy('fecha', 'desc')
            ->where("comision_estado", "pendiente")
            ->where("comision_valor", ">", 0)
            ->get()->map(function ($totalServicio) {
                $fecha = $totalServicio->fecha ? Carbon::parse($totalServicio->fecha)->toDateString() : null;
                $comisionRestante = max(0, (float) $totalServicio->comision_valor - (float) $totalServicio->cancelaciones()->sum('monto_cancelado'));

                return [
                    'id' => $totalServicio->id,
                    'nro_factura' => $totalServicio->nro_factura,
                    'fecha' => $fecha,
                    'empleado_id' => $totalServicio->empleado_id,
                    'comision_valor' => (float) $totalServicio->comision_valor,
                    'comision_restante' => $comisionRestante,
                    'comision_estado' => $totalServicio->comision_estado,
                    'empleado' => $totalServicio->empleado ? [
                        'id' => $totalServicio->empleado->id,
                        'nombre' => $totalServicio->empleado->nombre,
                        'apellido' => $totalServicio->empleado->apellido,
                    ] : null,
                ];
            }),
            'empleados' => Empleado::query()->orderBy('nombre')->get(),
            'formasPago' => FormaPago::query()->orderBy('nombre_forma_pago')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'total_servicio_id' => 'required|exists:total_servicios,id',
            'empleado_id' => 'required|exists:empleados,id',
            'forma_pago_id' => 'required|exists:forma_pagos,id',
            'monto_cancelado' => 'required|numeric|min:0.01',
            'motivo' => 'nullable|string|max:500',
            'fecha_cancelacion' => 'required|date',
            'estado' => 'required|string|in:pendiente,aplicado,revertido',
        ]);

        $totalServicio = TotalServicio::findOrFail($validated['total_servicio_id']);
        $montoActualCancelado = (float) $totalServicio->cancelaciones()->sum('monto_cancelado');
        $montoDisponible = max(0, (float) $totalServicio->comision_valor - $montoActualCancelado);

        if ((float) $validated['monto_cancelado'] > $montoDisponible + 0.01) {
            return back()->withErrors([
                'monto_cancelado' => 'El monto a cancelar excede el saldo restante de la comisión. No puede quedar pendiente por cancelar.',
            ])->withInput();
        }

        if (abs($montoDisponible - (float) $validated['monto_cancelado']) < 0.01) {
            $validated['estado'] = 'aplicado';
        }

        ComisionValorCancelacion::create($validated);
        $this->syncEstadoComision($totalServicio);

        return redirect()->route('spad.indexcomisionvalorcancelacion')->with('success', 'Cancelación de comisión registrada correctamente.');
    }

    public function edit(ComisionValorCancelacion $comisionValorCancelacion)
    {
        $comisionValorCancelacion->load(['totalServicio', 'empleado', 'formaPago']);

        return Inertia::render('spad/comision-valor-cancelacion/edit', [
            'cancelacion' => $comisionValorCancelacion,
            'totalServicios' => TotalServicio::query()->with('cliente', 'empleado')->orderBy('fecha', 'desc')->get(),
            'empleados' => Empleado::query()->orderBy('nombre')->get(),
            'formasPago' => FormaPago::query()->orderBy('nombre_forma_pago')->get(),
        ]);
    }

    public function update(Request $request, ComisionValorCancelacion $comisionValorCancelacion)
    {
        $validated = $request->validate([
            'total_servicio_id' => 'required|exists:total_servicios,id',
            'empleado_id' => 'required|exists:empleados,id',
            'forma_pago_id' => 'required|exists:forma_pagos,id',
            'monto_cancelado' => 'required|numeric|min:0.01',
            'motivo' => 'nullable|string|max:500',
            'fecha_cancelacion' => 'required|date',
            'estado' => 'required|string|in:pendiente,aplicado,revertido',
        ]);

        $totalServicio = TotalServicio::findOrFail($validated['total_servicio_id']);
        $montoActualCancelado = (float) $totalServicio->cancelaciones()->whereKeyNot($comisionValorCancelacion->getKey())->sum('monto_cancelado');
        $montoDisponible = max(0, (float) $totalServicio->comision_valor - $montoActualCancelado);

        if ((float) $validated['monto_cancelado'] > $montoDisponible + 0.01) {
            return back()->withErrors([
                'monto_cancelado' => 'El monto a cancelar excede el saldo restante de la comisión. No puede quedar pendiente por cancelar.',
            ])->withInput();
        }

        if (abs($montoDisponible - (float) $validated['monto_cancelado']) < 0.01) {
            $validated['estado'] = 'aplicado';
        }

        $comisionValorCancelacion->update($validated);
        $this->syncEstadoComision($totalServicio);

        return redirect()->route('spad.indexcomisionvalorcancelacion')->with('success', 'Cancelación de comisión actualizada correctamente.');
    }

    public function destroy(ComisionValorCancelacion $comisionValorCancelacion)
    {
        $totalServicio = $comisionValorCancelacion->totalServicio;
        $comisionValorCancelacion->delete();

        if ($totalServicio) {
            $this->syncEstadoComision($totalServicio);
        }

        return redirect()->route('spad.indexcomisionvalorcancelacion')->with('success', 'Cancelación de comisión eliminada correctamente.');
    }

    public function reciboPdf(ComisionValorCancelacion $comisionValorCancelacion)
    {
        $comisionValorCancelacion->load(['totalServicio', 'empleado', 'formaPago']);

        $nroFactura = $comisionValorCancelacion->totalServicio?->nro_factura ?? 'FAC-SIN-NUMERO';
        $numeroRecibo = ControlRecibo::firstOrCreate(
            ['nrofactura' => $nroFactura],
            ['numero_recibo' => 'RC-' . str_pad((string) $comisionValorCancelacion->id, 6, '0', STR_PAD_LEFT)]
        );

        if (empty($numeroRecibo->numero_recibo)) {
            $numeroRecibo->update([
                'numero_recibo' => 'RC-' . str_pad((string) $comisionValorCancelacion->id, 6, '0', STR_PAD_LEFT),
            ]);
        }

        return response()->view('spad.comision-valor-cancelacion.recibo', [
            'cancelacion' => $comisionValorCancelacion,
            'controlRecibo' => $numeroRecibo,
            'fecha' => Carbon::parse($comisionValorCancelacion->fecha_cancelacion ?? now())->format('d/m/Y'),
            'empleadoNombre' => $comisionValorCancelacion->empleado
                ? trim(($comisionValorCancelacion->empleado->nombre ?? '') . ' ' . ($comisionValorCancelacion->empleado->apellido ?? ''))
                : '-',
        ])->header('Content-Type', 'text/html; charset=utf-8');
    }

    protected function syncEstadoComision(TotalServicio $totalServicio): void
    {
        $totalCancelado = (float) $totalServicio->cancelaciones()->sum('monto_cancelado');
        $comisionTotal = (float) $totalServicio->comision_valor;

        if ($comisionTotal <= 0) {
            $totalServicio->update(['comision_estado' => 'pendiente']);
            return;
        }

        if ($totalCancelado >= $comisionTotal) {
            $totalServicio->update(['comision_estado' => 'cancelado']);
            return;
        }

        $totalServicio->update(['comision_estado' => 'pendiente']);
    }
}
