<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RegistroServicio extends Model
{
    /** @use HasFactory<\Database\Factories\RegistroServicioFactory> */
    use HasFactory;

    protected $fillable = [
        'servicio_id',
        'cliente_id',
        'fecha_servicio',
        'cantidad',
        'precio',
        'total_servicio_id',
        'impuesto',
        'descuento',
        'subtotal',
        'total',
        'comision_valor',
        'comision_estado',
        'empleado_id',
        'nro_factura',
        'fecha',
        
    ];

    protected $casts = [
        'fecha_servicio' => 'date',
    ];

    public function servicio()
    {
        return $this->belongsTo(Servicio::class);
    }

    public function cliente()
    {
        return $this->belongsTo(Cliente::class);
    }

    /**
     * Get the total service summary/invoice associated with this record.
     */
    public function totalServicio(): BelongsTo
    {
        return $this->belongsTo(TotalServicio::class, 'total_servicio_id');
    }
}
