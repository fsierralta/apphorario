<?php

namespace App\Http\Requests\Empleado;

use Illuminate\Foundation\Http\FormRequest;

class EmpleadoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            //
            'nombre' => 'required|string|max:255',
            'apellido' => 'required|string|max:255',
            'cedula' => 'required|string|max:20|unique:empleados,cedula,'.$this->route('empleado'),
            'telefono' => 'required|string|max:20',
            'direccion' => 'required|string|max:255',
            'foto_url' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'cargo' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255|unique:empleados,email,'.$this->route('empleado'),

        ];
    }
}
