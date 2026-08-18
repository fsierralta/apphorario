<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ControlRecibo extends Model
{
    protected $table = 'control_recibos';

    protected $fillable = [
        'numero_recibo',
        'nrofactura',
    ];
}
