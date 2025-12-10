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
        $request->validate([
            'comision' => 'required|string|max:255',
            'valor' => 'required|numeric',
        ]);

        Comision::create($request->all());

        return redirect()->route('comision.index');
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

        return redirect()->route('comision.index');
    }

    public function destroy(Comision $comision)
    {
        $comision->delete();

        return redirect()->route('comision.index');
    }
}