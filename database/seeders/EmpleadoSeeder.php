<?php

namespace Database\Seeders;

use App\Models\Empleado;
use Illuminate\Database\Seeder;

class EmpleadoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $cargos = [
            'Gerente General',
            'Supervisor de Ventas',
            'Analista de Sistemas',
            'Asistente Administrativo',
            'Jefe de Logística',
            null, // Para algunos registros sin cargo
        ];

        for ($i = 0; $i < 100; $i++) {

            // Crear empleado relacionado
            Empleado::create([

                'nombre' => fake()->firstName(),
                'apellido' => fake()->lastName(),
                'cedula' => $this->generarCedulaUnica(),
                'telefono' => $this->formatearTelefono(fake()->phoneNumber()),
                'direccion' => fake()->address(),
                'foto_url' => fake()->optional(0.7)->imageUrl(200, 200, 'people'), // 70% de probabilidad de foto
                'cargo' => fake()->randomElement($cargos),
            ]);
        }
    }

    private function generarCedulaUnica(): string
    {
        do {
            $cedula = fake()->unique()->numerify('###########'); // 11 dígitos
        } while (Empleado::where('cedula', $cedula)->exists());

        return $cedula;
    }

    private function formatearTelefono(string $telefono): string
    {
        return substr(preg_replace('/[^0-9]/', '', $telefono), 0, 10);
    }
}
//
