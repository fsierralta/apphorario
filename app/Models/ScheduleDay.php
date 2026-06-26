<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ScheduleDay extends Model
{
    //
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'schedule_id',
        'day_of_week',
        'is_working_day',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $table = 'schedule_days';

    protected $casts = [
        'day_of_week' => 'integer',
        'is_working_day' => 'boolean',
    ];

    public function schedule()
    {
        return $this->belongsTo(Schedule::class);
    }

    // Helper para nombres de días
    public function getDayNameAttribute(): string
    {
        return match ($this->day_of_week) {
            1 => 'Lunes',
            2 => 'Martes',
            3 => 'Miércoles',
            4 => 'Jueves',
            5 => 'Viernes',
            6 => 'Sábado',
            7 => 'Domingo',
            default => 'Inválido'
        };
    }
}
