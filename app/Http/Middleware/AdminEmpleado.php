<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Symfony\Component\HttpFoundation\Response;

class AdminEmpleado
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        
        
        if (!auth()->user()->hasRole('admin')) {
            return Redirect::route('home');
        }
        
        return $next($request);
        // Si no es admin, redirigir a la página de inicio o a una página de error
      //  return Redirect::route('home')->with('error', 'No tienes permiso para acceder a esta sección.');

       


        
}
}