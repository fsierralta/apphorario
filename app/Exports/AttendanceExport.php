<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class AttendanceExport implements FromCollection, WithHeadings, ShouldAutoSize, WithStyles
{
    protected $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function collection()
    {
        return collect($this->data)->map(function ($item) {
            return [
                'Empleado' => $item->nombre . ' ' . $item->apellido,
                'Cédula' => $item->cedula,
                'Cargo' => $item->cargo,
                'Fecha' => \Carbon\Carbon::parse($item->registro_fecha)->format('d/m/Y'),
                'Hora Entrada' => $item->hora_entrada ?? '-',
                'Hora Salida' => $item->hora_salida ?? '-',
                'Inicio Descanso' => $item->inicio_descanso ?? '-',
                'Fin Descanso' => $item->fin_descanso ?? '-',
                'Horario' => $item->horario,
            ];
        });
    }

    public function headings(): array
    {
        return [
            'Empleado',
            'Cédula',
            'Cargo',
            'Fecha',
            'Hora Entrada',
            'Hora Salida',
            'Inicio Descanso',
            'Fin Descanso',
            'Horario'
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            // Style the first row as bold text
            1 => ['font' => ['bold' => true]],
            
            // Style the header row
            'A1:I1' => [
                'fill' => [
                    'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                    'startColor' => ['argb' => 'FFD9EAD3'],
                ],
            ],
        ];
    }
}