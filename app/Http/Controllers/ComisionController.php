<?php

namespace App\Http\Controllers;

use App\Models\Comision;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ComisionController extends Controller
{
    public function index()
    {
        $comisiones = Comision::all();
        return Inertia::render('spad/comision/index', ['comisions' => $comisiones]);
    }

    public function create()
    {
        return Inertia::render('spad/comision/create');
    }

    public function store(Request $request)
    {

        $messenge = [
            'comision.required' => 'La comisión es requerida por favor digite una comisión',
            'comision.string' => 'La comisión debe ser una cadena de texto por favor digite una comisión',
            'comision.max' => 'La comisión no puede exceder los 255 caracteres por favor digite una comisión',
            'valor.required' => 'El valor es requerido por favor digite un valor',
            'valor.numeric' => 'El valor debe ser un número por favor digite un número',
            'valor.min' => 'El valor debe ser mayor o igual a 1 por favor digite un valor',
            'valor.max' => 'El valor debe ser menor o igual a 100 por favor digite un valor',
        ];

        $request->validate([
            'comision' => 'required|string|max:255',
            'valor' => 'required|numeric|min:1|max:100',
        ], $messenge);

        Comision::create($request->all());

        return redirect()->route('comision.index')->with('success', 'Comisión creada exitosamente.');
    }

    public function edit(Comision $comision)
    {
        return Inertia::render('spad/comision/edit', ['comision' => $comision]);
    }

    public function update(Request $request, Comision $comision)
    {
        $request->validate([
            'comision' => 'required|string|max:255',
            'valor' => 'required|numeric',
        ]);

        $comision->update($request->all());

        return redirect()->route('comision.index')->with('success', 'Comisión actualizada exitosamente.');
    }

    public function destroy(Comision $comision)
    {
        $comision->delete();

        return redirect()->route('comision.index')->with('success', 'Comisión eliminada exitosamente.');
    }
}