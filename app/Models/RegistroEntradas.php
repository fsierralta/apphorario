<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RegistroEntradas extends Model
{
    //
    protected $table="registroentradas";
    protected $fillable=[
         'empleado_id',
         'schedule_id',
         'registro_fecha',
         'registro_hora',
         'tipo',
         'observacion'




    ];
    
}
