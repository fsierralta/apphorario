<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RegistroEntradaSalida extends Model
{
    use HasFactory;

    protected $table = 'registroentradas';

    protected $fillable = [
        'empleado_id',
        'schedule_id',
        'entrada',
    ];

    public function empleado()
    {
        return $this->belongsTo(Empleado::class);
    }

    public function schedule()
    {
        return $this->belongsTo(Schedule::class);
    }
}
