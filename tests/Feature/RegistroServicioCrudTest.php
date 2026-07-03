<?php

namespace Tests\Feature;

use App\Models\Cliente;
use App\Models\RegistroServicio;
use App\Models\Servicio;
use App\service\RegistroServicioService;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class RegistroServicioCrudTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        Schema::dropIfExists('registro_servicios');
        Schema::dropIfExists('clientes');
        Schema::dropIfExists('servicios');

        Schema::create('servicios', function (Blueprint $table) {
            $table->id();
            $table->string('nombre_servicio');
            $table->text('descripcion')->nullable();
            $table->decimal('precio', 10, 2)->default(0);
            $table->string('estado')->default('activo');
            $table->timestamps();
        });

        Schema::create('clientes', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('apellido');
            $table->timestamps();
        });

        Schema::create('registro_servicios', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->unsignedBigInteger('servicio_id');
            $table->date('fecha_servicio');
            $table->unsignedBigInteger('cliente_id');
            $table->decimal('cantidad')->default(1);
            $table->decimal('precio', 10, 2);
        });
    }

    protected function tearDown(): void
    {
        Schema::dropIfExists('registro_servicios');
        Schema::dropIfExists('clientes');
        Schema::dropIfExists('servicios');

        parent::tearDown();
    }

    public function test_can_create_update_and_delete_a_registro_servicio(): void
    {
        $servicio = Servicio::create([
            'nombre_servicio' => 'Corte de cabello',
            'descripcion' => 'Servicio básico',
            'precio' => 25.00,
            'estado' => 'activo',
        ]);

        $cliente = Cliente::create([
            'nombre' => 'Ana',
            'apellido' => 'Pérez',
        ]);

        $service = new RegistroServicioService();

        $registro = $service->create([
            'servicio_id' => $servicio->id,
            'cliente_id' => $cliente->id,
            'fecha_servicio' => '2026-07-02',
            'cantidad' => 1,
            'precio' => 25.00,
        ]);

        $this->assertInstanceOf(RegistroServicio::class, $registro);
        $this->assertDatabaseHas('registro_servicios', [
            'servicio_id' => $servicio->id,
            'cliente_id' => $cliente->id,
            'precio' => '25.00',
        ]);

        $updated = $service->update($registro, [
            'servicio_id' => $servicio->id,
            'cliente_id' => $cliente->id,
            'fecha_servicio' => '2026-07-03',
            'cantidad' => 2,
            'precio' => 50.00,
        ]);

        $this->assertSame('2026-07-03', $updated->fecha_servicio->toDateString());
        $this->assertSame('50', (string) $updated->precio);

        $this->assertTrue($service->delete($updated));
        $this->assertDatabaseMissing('registro_servicios', [
            'id' => $updated->id,
        ]);
    }
}
