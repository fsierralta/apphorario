<?php

namespace App\Providers;

use Carbon\Carbon;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {

        try {
            $licenciaCruda = env('LICENCIA_APP');
            $datos = json_decode(Crypt::decryptString($licenciaCruda), true);
            $expira = Carbon::parse($datos['fecha_expiracion']);

            if ($expira->isPast()) {
                abort(403, 'La licencia de esta aplicación ha expirado.');
            }
        } catch (\Exception $e) {
            Log::error('Error al verificar licencia: '.$e->getMessage());
            abort(403, 'Licencia inválida o ausente.');
        }
        // Share the expiration date with Inertia
        $publicExpira=env('LICENCIA_APP_VIEW');
        Inertia::share([
            'publicExpira' => $publicExpira ? $this->publicExpira() : null,
          
        ]);

        

    }
    public function publicExpira(){
        try {
            $licenciaCruda = env('LICENCIA_APP');
            $datos = json_decode(Crypt::decryptString($licenciaCruda), true);
            $expira = Carbon::parse($datos['fecha_expiracion'])->format('d-m-Y');
            return $expira;
        } catch (\Exception $e) {
            Log::error('Error al obtener fecha de expiración: '.$e->getMessage());
            return null;
        }   
    }
}
