<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de comisiones aplicadas</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 28px; color: #1f2937; }
        .reporte { max-width: 1100px; margin: 0 auto; }
        .header { border-bottom: 2px solid #059669; padding-bottom: 16px; margin-bottom: 18px; }
        h1 { color: #065f46; margin: 0 0 6px; font-size: 25px; }
        .periodo { color: #4b5563; font-size: 13px; }
        table { width: 100%; border-collapse: collapse; margin-top: 18px; }
        th, td { border: 1px solid #d1d5db; padding: 9px 10px; text-align: left; font-size: 12px; }
        th { background: #d1fae5; color: #064e3b; }
        td.amount, th.amount { text-align: right; }
        .total { margin: 16px 0 0 auto; width: 270px; border-collapse: collapse; }
        .total td { font-size: 15px; font-weight: bold; }
        .total td:last-child { text-align: right; color: #065f46; }
        .empty { text-align: center; padding: 24px; color: #6b7280; }
        @media print { body { padding: 0; } }
    </style>
</head>
<body onload="window.print()">
    <main class="reporte">
        <header class="header">
            <h1>Reporte de comisiones aplicadas</h1>
            <div class="periodo">
                Periodo:
                {{ $fechaInicio ?? 'Inicio' }} - {{ $fechaFin ?? 'Fin' }}
            </div>
        </header>

        <table>
            <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Empleado</th>
                    <th>Factura / servicio</th>
                    <th>Forma de pago</th>
                    <th>Motivo</th>
                    <th class="amount">Monto aplicado</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($cancelaciones as $cancelacion)
                    <tr>
                        <td>{{ $cancelacion->fecha_cancelacion?->format('d/m/Y') }}</td>
                        <td>{{ trim(($cancelacion->empleado?->nombre ?? '') . ' ' . ($cancelacion->empleado?->apellido ?? '')) ?: '-' }}</td>
                        <td>{{ $cancelacion->totalServicio?->nro_factura ?? '-' }}</td>
                        <td>{{ $cancelacion->formaPago?->nombre_forma_pago ?? '-' }}</td>
                        <td>{{ $cancelacion->motivo ?: 'Cancelación de comisión' }}</td>
                        <td class="amount">$ {{ number_format((float) $cancelacion->monto_cancelado, 2, '.', ',') }}</td>
                    </tr>
                @empty
                    <tr><td colspan="6" class="empty">No hay comisiones aplicadas en el periodo seleccionado.</td></tr>
                @endforelse
            </tbody>
        </table>

        <table class="total">
            <tr>
                <td>Total aplicado</td>
                <td>$ {{ number_format($total, 2, '.', ',') }}</td>
            </tr>
        </table>
    </main>
</body>
</html>