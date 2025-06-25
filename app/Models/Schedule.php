<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    //
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'start_time',
        'end_time',
        'has_break',
        'break_start',
        'break_end',
        'is_flexible',
        'tolerance_minutes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'has_break' => 'boolean',
        'is_flexible' => 'boolean',
        'tolerance_minutes' => 'integer',
    ];

    protected $table = 'schedules';

    public function days()
    {
        return $this->hasMany(ScheduleDay::class);
    }

    // Ej: Obtener días laborales
    public function workingDays()
    {
        return $this->days()->where('is_working_day', true);
    }

    // Ej: Obtener días de descanso
    public function restDays()
    {
        return $this->days()->where('is_working_day', false);
    }
}
