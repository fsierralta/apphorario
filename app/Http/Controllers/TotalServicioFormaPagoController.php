<?php

namespace App\Http\Controllers;

use App\Models\FormaPago;
use App\Models\TotalServicio;
use App\Models\TotalServicioFormaPago;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TotalServicioFormaPagoController extends Controller
{
    public function index(TotalServicio $totalServicio)
    {
        $totalServicio->load('pagos.formaPago');

        return Inertia::render('spad/total-servicio/pagos', [
            'totalServicio' => [
                'id' => $totalServicio->id,
                'nro_factura' => $totalServicio->nro_factura,
                'total' => (float) $totalServicio->total,
                'cliente_name' => $totalServicio->cliente?->nombre,
                'empleado_id' => $totalServicio->empleado_id,
            ],
            'formasPago' => FormaPago::query()->orderBy('nombre_forma_pago')->get(),
            'pagos' => $totalServicio->pagos->map(fn (TotalServicioFormaPago $pago) => [
                'id' => $pago->id,
                'forma_pago_id' => $pago->forma_pago_id,
                'monto' => (float) $pago->monto,
                'forma_pago_nombre' => $pago->formaPago?->nombre_forma_pago,
            ])->values()->all(),
        ]);
    }

    public function store(Request $request, TotalServicio $totalServicio)
    {
        $validated = $request->validate([
            'pagos' => 'required|array|min:1',
            'pagos.*.forma_pago_id' => 'required|exists:forma_pagos,id',
            'pagos.*.monto' => 'required|numeric|min:0.01',
            'empleado_id' => 'nullable|exists:empleados,id',
        ]);

        $totalPagado = collect($validated['pagos'])->sum(fn (array $pago) => (float) $pago['monto']);
        $totalEsperado = (float) $totalServicio->total;

        if (abs(round($totalPagado, 2) - round($totalEsperado, 2)) > 0.01) {
            return back()->withErrors([
                'pagos' => 'La suma de las formas de pago debe ser igual al total del servicio.',
            ])->withInput();
        }

        $empleadoId = $validated['empleado_id'] ?? $totalServicio->empleado_id;

        $totalServicio->pagos()->delete();

        $totalServicio->pagos()->createMany(
            collect($validated['pagos'])->map(fn (array $pago) => [
                'forma_pago_id' => $pago['forma_pago_id'],
                'monto' => (float) $pago['monto'],
                'empleado_id' => $empleadoId,
                'comision_valor' => 0,
                'fecha' => $totalServicio->fecha ?? now()->toDateString(),
                'nro_factura' => $totalServicio->nro_factura,
            ])->all()
        );

        return redirect()->route('registro-servicio.index')->with('success', 'Los pagos fueron registrados correctamente.');
    }
}
