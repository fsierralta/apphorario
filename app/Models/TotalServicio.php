<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TotalServicio extends Model
{
    protected $fillable = [
        'total',
        'impuesto',
        'descuento',
        'subtotal',
        'nro_factura',
        'empleado_id',
        'cliente_id',
        'comision_valor',
        'fecha',
        'comision_estado',
    ];

    /**
     * Get the service records grouped by this total.
     */
    public function registroServicios(): HasMany
    {
        return $this->hasMany(RegistroServicio::class, 'total_servicio_id');
    }

    /**
     * Get the employee that created this total.
     */
    public function empleado(): BelongsTo
    {
        return $this->belongsTo(Empleado::class, 'empleado_id');
    }

    /**
     * Get the client associated with this total.
     */
    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class);
    }
}
