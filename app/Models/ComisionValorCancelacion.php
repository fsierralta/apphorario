<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ComisionValorCancelacion extends Model
{
    protected $table = 'comision_valor_cancelaciones';

    protected $fillable = [
        'total_servicio_id',
        'empleado_id',
        'forma_pago_id',
        'monto_cancelado',
        'motivo',
        'fecha_cancelacion',
        'estado',
    ];

    protected $casts = [
        'monto_cancelado' => 'float',
        'fecha_cancelacion' => 'date',
    ];

    public function totalServicio(): BelongsTo
    {
        return $this->belongsTo(TotalServicio::class, 'total_servicio_id');
    }

    public function empleado(): BelongsTo
    {
        return $this->belongsTo(Empleado::class, 'empleado_id');
    }

    public function formaPago(): BelongsTo
    {
        return $this->belongsTo(FormaPago::class, 'forma_pago_id');
    }
}
