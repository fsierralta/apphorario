<?php

namespace App\Citas;

use Carbon\Carbon;
class HorariosCitas
{
    /**
     * Create a new class instance.
     */
      protected $table = 'citas';
    public  $horas=[];
    private $horaInicio="8:00:00";
    private $horaFin="19:00:00";
    private $duracion="1:30:00";
    public function __construct()
    {
        //
    }
    public  function genHorario()
     {
        // Generar el horario basado en la hora de inicio, hora de fin y duración
        $this->horas = [];
        $horaActual = Carbon::createFromFormat('H:i:s', $this->horaInicio);
        $horaFin = Carbon::createFromFormat('H:i:s', $this->horaFin
);
        $durationTime = Carbon::parse($this->duracion);
        $duracionEnMinutos = $durationTime->hour * 60 + $durationTime->minute;
        while ($horaActual->lessThan($horaFin)) {
            $this->horas[] = $horaActual->format('H:i');
             info("horas",["data" => $this->horas]  );
            $horaActual->addMinutes($duracionEnMinutos);
        }
        
         return $this->horas;

       
     }

}
