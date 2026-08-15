<?php

namespace App\Http\Controllers;

use App\Models\FormaPago;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FormaPagoController extends Controller
{
    public function index(Request $request)
    {
        $formasPago = FormaPago::query();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $formasPago->where(function ($query) use ($search) {
                $query->where('nombre_forma_pago', 'like', "%{$search}%")
                    ->orWhere('nombre_corto', 'like', "%{$search}%")
                    ->orWhere('descripcion', 'like', "%{$search}%");
            });
        }

        $formasPago = $formasPago->latest()->paginate(10)->withQueryString();

        return Inertia::render('spad/formaPago/index', [
            'formasPago' => $formasPago,
        ]);
    }

    public function create()
    {
        return Inertia::render('spad/formaPago/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre_forma_pago' => 'required|string|max:255|unique:forma_pagos,nombre_forma_pago',
            'descripcion' => 'nullable|string|max:500',
            'nombre_corto' => 'nullable|string|max:100',
        ]);

        FormaPago::create($validated);

        return redirect()->route('spad.indexformapago')->with('success', 'Forma de pago creada correctamente.');
    }

    public function edit(FormaPago $formaPago)
    {
        return Inertia::render('spad/formaPago/edit', [
            'formaPago' => $formaPago,
        ]);
    }

    public function update(Request $request, FormaPago $formaPago)
    {
        $validated = $request->validate([
            'nombre_forma_pago' => 'required|string|max:255|unique:forma_pagos,nombre_forma_pago,' . $formaPago->id,
            'descripcion' => 'nullable|string|max:500',
            'nombre_corto' => 'nullable|string|max:100',
        ]);

        $formaPago->update($validated);

        return redirect()->route('spad.indexformapago')->with('success', 'Forma de pago actualizada correctamente.');
    }

    public function destroy(FormaPago $formaPago)
    {
        $formaPago->delete();

        return redirect()->route('spad.indexformapago')->with('success', 'Forma de pago eliminada correctamente.');
    }
}
