<?php

namespace App\service;

use App\Http\Requests\Empleado\EmpleadoRequest;
use App\Models\Empleado;
use Illuminate\Http\RedirectResponse;

class EmpleadoService
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function store(EmpleadoRequest $request, Empleado $empleado): RedirectResponse
    {
        try {
            info('re_all', ['rall' => $request->all()]);

            // Validar el archivo de imagen
            if ($request->hasFile('foto_url')) {
                $path = $request->file('foto_url')->store('empleados', 'public');

            } else {
                $path = null;
            }            // Crear el empleado
            info('foto_url', ['foto_url' => $path]);

            $empleado = new Empleado;
            $empleado->nombre = $request->nombre;
            $empleado->apellido = $request->apellido;
            $empleado->cedula = $request->cedula;
            $empleado->telefono = $request->telefono;
            $empleado->direccion = $request->direccion;
            $empleado->foto_url = $path ? 'storage/'.$path : null; // Guardar la ruta de la imagen
            $empleado->cargo = $request->cargo;
            $empleado->email = $request->email;
            $empleado->save();

            return redirect()->route('empleados.index')->with('success', 'Empleado creado exitosamente.');
        } catch (\Exception $e) {

            info('error', ['error' => $e->getMessage()]);

            return back()->with('error', 'Error al crear empleado: '.$e->getMessage())->withInput();
        }

    }
}
