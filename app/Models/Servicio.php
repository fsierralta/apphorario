<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Servicio extends Model
{
    /** @use HasFactory<\Database\Factories\ServicioFactory> */
    use HasFactory;

    protected $fillable = [

        'nombre_servicio',
        'descripcion',
        'precio',
        'foto_url',
        'estado',

    ];
}
