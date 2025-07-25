<?php

namespace App\service;

use App\Http\Requests\Empleado\EmpleadoRequest;
use App\Models\Empleado;
use App\Models\User;
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
            $user=User::create(
                [
                  "name"=>strtoupper(str_replace(' ','',$request->input('nombre'))),
                  'email'=>strtolower(trim($request->input("email"))),
                  'password'=>bcrypt(trim($request->input("cedula"))),
                  'role'=>'empleado',
]

                );
                

            $empleado = new Empleado();
            $empleado->nombre = $request->input("nombre");
            $empleado->apellido = $request->input("apellido")  ;
            $empleado->cedula = $request->input('cedula');
            $empleado->telefono = $request->input('telefono');
            $empleado->direccion = $request->input('direccion');
            $empleado->foto_url = $path ? 'storage/'.$path : null; // Guardar la ruta de la imagen
            $empleado->cargo = $request->input('cargo');
            $empleado->email = $request->input('email');
            $empleado->user_id = $user->id; // Asignar el ID del usuario creado
            $empleado->save();
            return redirect()->route('empleados.index')->with('success', 'Empleado creado exitosamente.');
        } catch (\Exception $e) {

            info('error', ['error' => $e->getMessage()]);

            return back()->with('error', 'Error al crear empleado: '.$e->getMessage())->withInput();
        }

    }
}
