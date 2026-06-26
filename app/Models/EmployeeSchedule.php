<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class EmployeeSchedule extends Pivot
{
    //
    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_active' => 'boolean',
    ];

    /**
     * Determinar si la asignación está activa actualmente
     */
    public function getIsCurrentlyActiveAttribute(): bool
    {
        return $this->is_active &&
               $this->start_date <= now() &&
               (is_null($this->end_date) || $this->end_date >= now());
    }
}
