<?php

namespace App\Providers;

use Carbon\Carbon;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\ServiceProvider;

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

    }
}
