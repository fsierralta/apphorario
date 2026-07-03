<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
}
