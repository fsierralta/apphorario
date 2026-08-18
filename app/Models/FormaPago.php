<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FormaPago extends Model
{
    /** @use HasFactory<\Database\Factories\FormaPagoFactory> */
    use HasFactory;

    protected $fillable = [
        'nombre_forma_pago',
        'descripcion',
        'nombre_corto',
    ];

    public function comisionValorCancelaciones(): HasMany
    {
        return $this->hasMany(ComisionValorCancelacion::class, 'forma_pago_id');
    }
}
