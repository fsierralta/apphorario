<?php

namespace App\Http\Controllers;

use App\Models\ComisionEmpledo;
use App\Models\Empleado;
use App\Models\Comision;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ComisionEmpledoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $comisionEmpleados = ComisionEmpledo::with(['empleado', 'comision'])->get();
        return Inertia::render('spad/comision_empledo/index', [
            'comisionEmpleados' => $comisionEmpleados
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $empleados = Empleado::all();
        $comisiones = Comision::all();
        return Inertia::render('spad/comision_empledo/create', [
            'empleados' => $empleados,
            'comisiones' => $comisiones
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'empleado_id' => 'required|exists:empleados,id',
            'comision_id' => 'required|exists:comisions,id',
            
        ]);

        $exists = ComisionEmpledo::where('empleado_id', $request->empleado_id)
            ->where('comision_id', $request->comision_id)
            ->exists();

        if ($exists) {
            return back()->withErrors([
                'comision_id' => 'Este empleado ya tiene asignada esta comisión.'
            ]);
        }

        ComisionEmpledo::create($request->all());

        return redirect()->route('spad.indexcomision_empledo')
            ->with('success', 'Comisión asignada con éxito.');
    }

    /**
     * Display the specified resource.
     */
    public function show(ComisionEmpledo $comision_empledo)
    {
        // Not used
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ComisionEmpledo $comision_empledo)
    {
        $empleados = Empleado::all();
        $comisiones = Comision::all();
        return Inertia::render('spad/comision_empledo/edit', [
            'comisionEmpledo' => $comision_empledo,
            'empleados' => $empleados,
            'comisiones' => $comisiones
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ComisionEmpledo $comision_empledo)
    {
        $request->validate([
            'empleado_id' => 'required|exists:empleados,id',
            'comision_id' => 'required|exists:comisions,id',
        ]);

        $exists = ComisionEmpledo::where('empleado_id', $request->empleado_id)
            ->where('comision_id', $request->comision_id)
            ->where('id', '!=', $comision_empledo->id)
            ->exists();

        if ($exists) {
            return back()->withErrors([
                'comision_id' => 'Este empleado ya tiene asignada esta comisión.'
            ]);
        }

        $comision_empledo->update($request->all());

        return redirect()->route('spad.indexcomision_empledo')
            ->with('success', 'Asignación de comisión actualizada con éxito.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ComisionEmpledo $comision_empledo)
    {
        $comision_empledo->delete();

        return redirect()->route('spad.indexcomision_empledo')
            ->with('success', 'Asignación de comisión eliminada con éxito.');
    }
}
