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
        Schema::dropIfExists('total_servicios');
        Schema::dropIfExists('empleados');
        Schema::dropIfExists('users');
        Schema::dropIfExists('clientes');
        Schema::dropIfExists('servicios');

        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('role')->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
        });

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

        Schema::create('empleados', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('apellido');
            $table->unsignedBigInteger('user_id')->nullable();
            $table->timestamps();
        });

        Schema::create('total_servicios', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->decimal('total', 10, 2);
            $table->decimal('impuesto', 5, 2)->default(0);
            $table->decimal('descuento', 5, 2)->default(0);
            $table->decimal('subtotal', 10, 2)->default(0);
            $table->string('nro_factura')->unique();
            $table->unsignedBigInteger("empleado_id");
            $table->unsignedBigInteger("cliente_id");
            $table->decimal("comision_valor",10,2)->nullable();
            $table->date("fecha")->nullable();
            $table->string("comision_estado")->default("pendiente");
        });

        Schema::create('comisions', function (Blueprint $table) {
            $table->id();
            $table->string('comision');
            $table->float('valor', 2);
            $table->timestamps();
        });

        Schema::create('comision_empledos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('empleado_id');
            $table->unsignedBigInteger('comision_id');
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
            $table->unsignedBigInteger('total_servicio_id')->nullable();
        });
    }

    protected function tearDown(): void
    {
        Schema::dropIfExists('registro_servicios');
        Schema::dropIfExists('comision_empledos');
        Schema::dropIfExists('comisions');
        Schema::dropIfExists('total_servicios');
        Schema::dropIfExists('empleados');
        Schema::dropIfExists('users');
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

    public function test_controller_store_creates_total_servicio_and_registro_servicios(): void
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

        $empleado = \App\Models\Empleado::create([
            'nombre' => 'Juan',
            'apellido' => 'Gómez',
            'user_id' => 1,
        ]);

        $user = \App\Models\User::factory()->create(['id' => 1]);

        $response = $this->actingAs($user)->post(route('registro-servicio.store'), [
            'cliente_id' => $cliente->id,
            'fecha_servicio' => now()->toDateString(),
            'empleado_id' => $empleado->id,
            'items' => [
                [
                    'servicio_id' => $servicio->id,
                    'cantidad' => 2,
                    'precio' => 25.00,
                ]
            ]
        ]);

        $response->assertRedirect(route('registro-servicio.index'));

        // Assert TotalServicio was created
        $this->assertDatabaseHas('total_servicios', [
            'cliente_id' => $cliente->id,
            'empleado_id' => $empleado->id,
            'subtotal' => 50.00,
            'total' => 50.00,
        ]);

        // Retrieve the total servicio to check invoice number format
        $totalServicio = \App\Models\TotalServicio::first();
        $this->assertNotNull($totalServicio);
        $this->assertStringStartsWith('FAC-', $totalServicio->nro_factura);

        // Assert RegistroServicio was created and linked to TotalServicio
        $this->assertDatabaseHas('registro_servicios', [
            'servicio_id' => $servicio->id,
            'cliente_id' => $cliente->id,
            'cantidad' => 2,
            'precio' => 25.00,
            'total_servicio_id' => $totalServicio->id,
        ]);
    }

    public function test_controller_store_calculates_employee_commission_value(): void
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

        $empleado = \App\Models\Empleado::create([
            'nombre' => 'Juan',
            'apellido' => 'Gómez',
            'user_id' => 1,
        ]);

        $comision = \App\Models\Comision::create([
            'comision' => 'Venta',
            'valor' => 10,
        ]);

        \App\Models\ComisionEmpledo::create([
            'empleado_id' => $empleado->id,
            'comision_id' => $comision->id,
        ]);

        $user = \App\Models\User::factory()->create(['id' => 1]);

        $this->actingAs($user)->post(route('registro-servicio.store'), [
            'cliente_id' => $cliente->id,
            'fecha_servicio' => now()->toDateString(),
            'empleado_id' => $empleado->id,
            'items' => [
                [
                    'servicio_id' => $servicio->id,
                    'cantidad' => 2,
                    'precio' => 25.00,
                ]
            ]
        ]);

        $this->assertDatabaseHas('total_servicios', [
            'empleado_id' => $empleado->id,
            'subtotal' => 50.00,
            'comision_valor' => 5.00,
            'comision_estado' => 'pendiente',
        ]);
    }
}
