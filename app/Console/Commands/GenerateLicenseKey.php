<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
class GenerateLicenseKey extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:generate-license-key';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        //
        $licencia=[
            'licencia'=>'ControlHorario',
            'fecha_expiracion'=>Carbon::parse("2025-07-22")->addDays(365)->toDateString(),
            'activo'=>true,
        ];
        Log::info($licencia);

        $encriptada=$this->encryptLicencia($licencia);

         $this->info('encriptada');
         $this->line("LICENCIA_APP=\{$encriptada}");


    }

    public function encryptLicencia($licencia){
        
        return Crypt::encryptString(json_encode($licencia));
    }
}
