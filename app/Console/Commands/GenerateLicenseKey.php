<?php

namespace App\Console\Commands;

use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Log;

class GenerateLicenseKey extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:generate-license-key {fecha} {days}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    private $startDate;
    private $endDate;
    public function handle()
    {
        //
        $fecha1=$this->argument('fecha');
        $fecha2=intval($this->argument('days'));
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $fecha1)) {
            $this->error('La fecha debe tener el formato YYYY-MM-DD');
            return 1;
        }
        
       $this->rangeDate($fecha1,$fecha2);
       
       
    }

    public function encryptLicencia($licencia,$endDate)

    {
      

        $encriptada = Crypt::encryptString(json_encode($licencia));

        $this->info('encriptada');
        $this->line("LICENCIA_APP=\{$encriptada}");

        return $encriptada;
    }

    public function rangeDate($startDate, $days=365){
      
         
        $this->startDate = Carbon::parse($startDate)->toDateString();
        $this->endDate = Carbon::parse($startDate)->addDays($days)->toDateString();
        Log::info(["startDate"=>$startDate,"endDate"=>$endDate]);

        $licencia = [
            'licencia' => 'ControlHorario',
            'fecha_expiracion' => $this->endDate,
            'activo' => true,
        ];
          
        $this->encryptLicencia($licencia,$endDate);
    }
}
