<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recibo de pago</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 32px;
            color: #1f2937;
            background: #fff;
        }
        .recibo {
            max-width: 760px;
            margin: 0 auto;
            border: 1px solid #d1d5db;
            border-radius: 12px;
            padding: 28px;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #f59e0b;
            padding-bottom: 18px;
            margin-bottom: 20px;
        }
        .title {
            font-size: 26px;
            font-weight: bold;
            color: #92400e;
            margin: 0;
        }
        .numero {
            font-size: 16px;
            font-weight: bold;
            color: #111827;
            text-align: right;
        }
        .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 18px;
            margin-bottom: 24px;
        }
        .label {
            font-size: 12px;
            text-transform: uppercase;
            color: #6b7280;
            letter-spacing: 0.04em;
            margin-bottom: 4px;
        }
        .value {
            font-size: 16px;
            font-weight: 600;
        }
        .table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 12px;
        }
        .table th, .table td {
            border: 1px solid #e5e7eb;
            padding: 12px;
            text-align: left;
        }
        .table th {
            background: #fff7ed;
            color: #9a5b00;
        }
        .totales {
            width: 100%;
            margin-top: 16px;
        }
        .totales td {
            padding: 8px 12px;
            border: 1px solid #e5e7eb;
        }
        .firma {
            margin-top: 42px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            gap: 20px;
        }
        .firma-box {
            width: 45%;
            border-top: 2px solid #111827;
            padding-top: 10px;
            text-align: center;
            font-weight: bold;
            color: #111827;
        }
        .small {
            font-size: 12px;
            color: #6b7280;
        }
        @media print {
            body { padding: 0; }
            .recibo { border: none; box-shadow: none; }
        }
    </style>
</head>
<body onload="window.print()">
    <div class="recibo">
        <div class="header">
            <div>
                <h1 class="title">Recibo de pago</h1>
                <div class="small">Comisión cancelada</div>
            </div>
            <div class="numero">
                <div class="small">Nº recibo</div>
                <div>{{ $controlRecibo->numero_recibo }}</div>
            </div>
        </div>

        <div class="grid">
            <div>
                <div class="label">Empleado</div>
                <div class="value">{{ $empleadoNombre }}</div>
            </div>
            <div>
                <div class="label">Fecha</div>
                <div class="value">{{ $fecha }}</div>
            </div>
            <div>
                <div class="label">Factura / servicio</div>
                <div class="value">{{ $cancelacion->totalServicio?->nro_factura ?? 'N/A' }}</div>
            </div>
            <div>
                <div class="label">Forma de pago</div>
                <div class="value">{{ $cancelacion->formaPago?->nombre_forma_pago ?? '-' }}</div>
            </div>
        </div>

        <table class="table">
            <thead>
                <tr>
                    <th>Concepto</th>
                    <th>Monto</th>
                    <th>Estado</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{{ $cancelacion->motivo ?: 'Cancelación de comisión' }}</td>
                    <td>$ {{ number_format((float) $cancelacion->monto_cancelado, 2, '.', ',') }}</td>
                    <td>{{ ucfirst($cancelacion->estado ?? 'pendiente') }}</td>
                </tr>
            </tbody>
        </table>

        <table class="totales" align="right">
            <tr>
                <td style="font-weight: bold; width: 70%; text-align:right;">Total cancelado</td>
                <td style="font-weight: bold; text-align: right;">$ {{ number_format((float) $cancelacion->monto_cancelado, 2, '.', ',') }}</td>
            </tr>
        </table>

        <div class="firma">
            <div class="firma-box">
                <div>Recibido por</div>
            </div>
            <div class="firma-box">
                <div>Firma autorizada</div>
            </div>
        </div>
    </div>
</body>
</html>
