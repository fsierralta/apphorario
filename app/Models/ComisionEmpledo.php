<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ComisionEmpledo extends Model
{
    protected $table = 'comision_empledos';

    protected $fillable = [
        'empleado_id',
        'comision_id',
    ];

    public function empleado(): BelongsTo
    {
        return $this->belongsTo(Empleado::class, 'empleado_id');
    }

    public function comision(): BelongsTo
    {
        return $this->belongsTo(Comision::class, 'comision_id');
    }
}
