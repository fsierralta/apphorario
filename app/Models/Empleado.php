<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Empleado extends Model
{
    //
    protected $fillable = [
        'nombre',
        'apellido',
        'cedula',
        'telefono',
        'direccion',
        'foto_url',
        'cargo',
        'user_id',
        'email',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $perPage = 10;

    public function schedules(): BelongsToMany
    {
        return $this->belongsToMany(Schedule::class, 'employee_schedule')
            ->using(EmployeeSchedule::class)
            ->withPivot('start_date', 'end_date', 'is_active')
            ->withTimestamps();
    }

    /**
     * Horario activo actual
     */
    public function activeSchedule()
    {
        return $this->schedules()
            ->wherePivot('is_active', true);
            // ->wherePivot('start_date', '<=', now())
            // ->wherePivot('end_date', '>=', now());

           
    }

    /**
     * Empleados asignados a este horario
     */
    public function empleados(): BelongsToMany
    {
        return $this->belongsToMany(Empleado::class, 'employee_schedule')
            ->using(EmployeeSchedule::class)
            ->withPivot('start_date', 'end_date', 'is_active')
            ->withTimestamps();
    }

    /**
     * Empleados con este horario activo actualmente
     */
    public function activeEmpleados($fechai, $fechaf)
    {

        return $this->empleados()
            ->wherePivot('is_active', true)
            ->where('start_date', '<=', $fechai)
            ->where(function ($query) use ($fechaf) {
                $query->whereNull('end_date')
                    ->orWhere('end_date', '>=', $fechaf);

            });

    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }

    public function registroEntradas(): HasMany
    {
        return $this->hasMany(RegistroEntradas::class, 'empleado_id', 'id');
    }
}
