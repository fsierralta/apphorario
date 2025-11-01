<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Cita extends Model
{
    //
  

    protected $fillable = [
        'empleado_id',
        'cliente_id',
        'fecha_hora',
        'descripcion',
        'estado',
     ];  
  
     
    }
