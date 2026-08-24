<?php

namespace Tests\Feature;

use App\Models\ComisionValorCancelacion;
use App\Models\Empleado;
use App\Models\FormaPago;
use App\Models\TotalServicio;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class ComisionValorCancelacionCrudTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        Schema::dropIfExists('comision_valor_cancelaciones');
        Schema::dropIfExists('total_servicios');
        Schema::dropIfExists('forma_pagos');
        Schema::dropIfExists('empleados');
        Schema::dropIfExists('clientes');
        Schema::dropIfExists('users');

        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('remember_token', 100)->nullable();
            $table->string('role')->default('user');
            $table->timestamps();
        });

        Schema::create('clientes', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->timestamps();
        });

        Schema::create('empleados', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->timestamps();
        });

        Schema::create('forma_pagos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre_forma_pago');
            $table->timestamps();
        });

        Schema::create('total_servicios', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('empleado_id');
            $table->unsignedBigInteger('cliente_id');
            $table->decimal('total', 10, 2)->default(0);
            $table->decimal('comision_valor', 10, 2)->default(0);
            $table->string('nro_factura')->nullable();
            $table->date('fecha')->nullable();
            $table->timestamps();
        });

        Schema::create('comision_valor_cancelaciones', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('total_servicio_id');
            $table->unsignedBigInteger('empleado_id');
            $table->unsignedBigInteger('forma_pago_id');
            $table->decimal('monto_cancelado', 10, 2);
            $table->text('motivo')->nullable();
            $table->date('fecha_cancelacion');
            $table->string('estado')->default('pendiente');
            $table->timestamps();
        });
    }

    public function test_can_store_and_fetch_a_commission_cancellation(): void
    {
        $empleado = Empleado::create(['nombre' => 'Ana']);
        $formaPago = FormaPago::create(['nombre_forma_pago' => 'Efectivo']);
        $totalServicio = TotalServicio::create([
            'empleado_id' => $empleado->id,
            'cliente_id' => 1,
            'total' => 150.00,
            'comision_valor' => 15.00,
            'nro_factura' => 'FAC-001',
            'fecha' => '2026-08-17',
        ]);

        $cancellation = ComisionValorCancelacion::create([
            'total_servicio_id' => $totalServicio->id,
            'empleado_id' => $empleado->id,
            'forma_pago_id' => $formaPago->id,
            'monto_cancelado' => 5.00,
            'motivo' => 'Descuento por devolución',
            'fecha_cancelacion' => '2026-08-17',
            'estado' => 'aplicado',
        ]);

        $this->assertDatabaseHas('comision_valor_cancelaciones', [
            'id' => $cancellation->id,
            'total_servicio_id' => $totalServicio->id,
            'monto_cancelado' => '5.00',
            'estado' => 'aplicado',
        ]);

        $this->assertSame(5.00, round((float) $totalServicio->cancelaciones()->first()->monto_cancelado, 2));
    }

    public function test_it_rejects_cancellation_when_the_remaining_commission_is_zero(): void
    {
        $empleado = Empleado::create(['nombre' => 'Ana']);
        $formaPago = FormaPago::create(['nombre_forma_pago' => 'Efectivo']);
        $totalServicio = TotalServicio::create([
            'empleado_id' => $empleado->id,
            'cliente_id' => 1,
            'total' => 150.00,
            'comision_valor' => 15.00,
            'nro_factura' => 'FAC-002',
            'fecha' => '2026-08-17',
        ]);

        ComisionValorCancelacion::create([
            'total_servicio_id' => $totalServicio->id,
            'empleado_id' => $empleado->id,
            'forma_pago_id' => $formaPago->id,
            'monto_cancelado' => 15.00,
            'motivo' => 'Cancelación total',
            'fecha_cancelacion' => '2026-08-17',
            'estado' => 'aplicado',
        ]);

        $request = new \Illuminate\Http\Request([
            'total_servicio_id' => $totalServicio->id,
            'empleado_id' => $empleado->id,
            'forma_pago_id' => $formaPago->id,
            'monto_cancelado' => 1.00,
            'motivo' => 'Intento extra',
            'fecha_cancelacion' => '2026-08-17',
            'estado' => 'aplicado',
        ]);

        $response = app(\App\Http\Controllers\ComisionValorCancelacionController::class)->store($request);

        $this->assertInstanceOf(\Illuminate\Http\RedirectResponse::class, $response);
        $this->assertNotNull($response->getSession()->get('errors'));
        $this->assertDatabaseCount('comision_valor_cancelaciones', 1);
    }

    public function test_it_filters_by_date_range_and_totals_the_filtered_results(): void
    {
        $user = \App\Models\User::factory()->create(['role' => 'admin']);
        $this->actingAs($user);

        $empleado = Empleado::create(['nombre' => 'Ana']);
        $formaPago = FormaPago::create(['nombre_forma_pago' => 'Efectivo']);

        $inRangeService = TotalServicio::create([
            'empleado_id' => $empleado->id,
            'cliente_id' => 1,
            'total' => 200.00,
            'comision_valor' => 25.00,
            'nro_factura' => 'FAC-003',
            'fecha' => '2026-08-10',
        ]);

        $outOfRangeService = TotalServicio::create([
            'empleado_id' => $empleado->id,
            'cliente_id' => 1,
            'total' => 300.00,
            'comision_valor' => 35.00,
            'nro_factura' => 'FAC-004',
            'fecha' => '2026-09-10',
        ]);

        ComisionValorCancelacion::create([
            'total_servicio_id' => $inRangeService->id,
            'empleado_id' => $empleado->id,
            'forma_pago_id' => $formaPago->id,
            'monto_cancelado' => 10.00,
            'motivo' => 'Primera cancelación',
            'fecha_cancelacion' => '2026-08-12',
            'estado' => 'aplicado',
        ]);

        ComisionValorCancelacion::create([
            'total_servicio_id' => $inRangeService->id,
            'empleado_id' => $empleado->id,
            'forma_pago_id' => $formaPago->id,
            'monto_cancelado' => 15.00,
            'motivo' => 'Segunda cancelación',
            'fecha_cancelacion' => '2026-08-20',
            'estado' => 'pendiente',
        ]);

        ComisionValorCancelacion::create([
            'total_servicio_id' => $outOfRangeService->id,
            'empleado_id' => $empleado->id,
            'forma_pago_id' => $formaPago->id,
            'monto_cancelado' => 50.00,
            'motivo' => 'Fuera de rango',
            'fecha_cancelacion' => '2026-09-15',
            'estado' => 'aplicado',
        ]);

        $request = new \Illuminate\Http\Request([
            'fecha_inicio' => '2026-08-01',
            'fecha_fin' => '2026-08-31',
        ]);
        $request->headers->set('X-Inertia', 'true');

        $response = app(\App\Http\Controllers\ComisionValorCancelacionController::class)->index($request);
        $httpResponse = $response->toResponse($request);
        $payload = json_decode($httpResponse->getContent(), true);

        $this->assertSame('spad/comision-valor-cancelacion/index', $payload['component']);
        $this->assertSame(2, $payload['props']['totales']['registros']);
        $this->assertSame(25.0, (float) $payload['props']['totales']['monto_cancelado']);
        $this->assertSame('Primera cancelación', $payload['props']['cancelaciones']['data'][0]['motivo']);
    }

    public function test_the_pdf_report_only_includes_applied_cancellations_in_the_date_range(): void
    {
        $empleado = Empleado::create(['nombre' => 'Ana']);
        $formaPago = FormaPago::create(['nombre_forma_pago' => 'Efectivo']);
        $totalServicio = TotalServicio::create([
            'empleado_id' => $empleado->id,
            'cliente_id' => 1,
            'total' => 200.00,
            'comision_valor' => 25.00,
            'nro_factura' => 'FAC-005',
            'fecha' => '2026-08-10',
        ]);

        ComisionValorCancelacion::create([
            'total_servicio_id' => $totalServicio->id,
            'empleado_id' => $empleado->id,
            'forma_pago_id' => $formaPago->id,
            'monto_cancelado' => 10.00,
            'motivo' => 'Aplicada dentro del rango',
            'fecha_cancelacion' => '2026-08-12',
            'estado' => 'aplicado',
        ]);

        ComisionValorCancelacion::create([
            'total_servicio_id' => $totalServicio->id,
            'empleado_id' => $empleado->id,
            'forma_pago_id' => $formaPago->id,
            'monto_cancelado' => 15.00,
            'motivo' => 'Pendiente dentro del rango',
            'fecha_cancelacion' => '2026-08-20',
            'estado' => 'pendiente',
        ]);

        $request = new \Illuminate\Http\Request([
            'fecha_inicio' => '2026-08-01',
            'fecha_fin' => '2026-08-31',
        ]);

        $response = app(\App\Http\Controllers\ComisionValorCancelacionController::class)->reportePdf($request);

        $this->assertSame('text/html; charset=utf-8', $response->headers->get('Content-Type'));
        $this->assertStringContainsString('Aplicada dentro del rango', $response->getContent());
        $this->assertStringNotContainsString('Pendiente dentro del rango', $response->getContent());
        $this->assertStringContainsString('$ 10.00', $response->getContent());
    }
}
