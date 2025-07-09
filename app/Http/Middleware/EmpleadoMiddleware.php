<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EmpleadoMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
       if(!auth()->user()->hasRole('empleado')) {
         return redirect()->route('home');

        }
          return $next($request);
         
            // Aquí puedes agregar lógica específica para empleados si es necesario
        }
        // Si no es empleado, redirigir a la página de inicio o a una página de error
       
    

    
}
