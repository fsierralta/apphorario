<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FormaPago extends Model
{
    /** @use HasFactory<\Database\Factories\FormaPagoFactory> */
    use HasFactory;
    protected $fillable=[
        "nombre_forma_pago",
        "descripcion",
        "nombre_corto"
    ];
}
