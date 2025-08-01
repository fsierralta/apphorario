<?php

namespace App\service;

use App\Http\Requests\Empleado\EmpleadoRequest;
use App\Models\Empleado;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class EmpleadoService
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function store(EmpleadoRequest $request): RedirectResponse
    {
        DB::beginTransaction();
        try {
            $data = $request->validated();

            // Manejar la subida del archivo de imagen
            if ($request->hasFile('foto_url')) {
                $path = $request->file('foto_url')->store('empleados', 'public');
                $data['foto_url'] = 'storage/'.$path;
            }
            
            // Crear el usuario
            $user = User::create([
                'name' => strtoupper(str_replace(' ', '', $data['nombre'])),
                'email' => strtolower(trim($data['email'])),
                'password' => bcrypt(trim($data['cedula'])),
                'role' => 'empleado',
            ]);
            
            // Asignar el user_id y crear el empleado
            $data['user_id'] = $user->id;
            Empleado::create($data);
            
            DB::commit();

            return redirect()->route('empleados.index')->with('success', 'Empleado creado exitosamente.');
        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Error al crear empleado: '.$e->getMessage(), [
                'exception' => $e,
                'request' => $request->except('password', 'foto_url'),
            ]);

            return back()->with('error', 'Ocurrió un error al crear el empleado. Por favor, inténtelo de nuevo.')->withInput();
        }

    }
}
