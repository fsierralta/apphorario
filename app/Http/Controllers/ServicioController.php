<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Servicio;
use Inertia\Inertia;
class ServicioController extends Controller
{
    //
    public function index(Request $request)   {
        $query = Servicio::query();
        if(!$request->has('search')) {
            $request->merge(['search' => '']);

          
        }
        if($request->has('search') && !empty($request->input('search')  ))

        {
            $search = $request->input('search');
            $query->where('nombre_servicio', 'like', "%$search%");
               
        }

     
        $servicios = $query->paginate(10)
        ->withQueryString();


        
        return Inertia::render('spad/servicio/index', ["servicios"=>$servicios]);


    }

    public function create()
    {
        //
        Return Inertia::render('spad/servicio/create');

    }
    public function store(Request $request)
    {
        //
        $validated = $request->validate([
            'nombre_servicio' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'precio' => 'required|numeric|min:1',
            'foto_url' =>'nullable|image|max:2048|mimes:jpeg,png,jpg',
            'estado' => 'required|in:activo,inactivo',


        ]);
        if ($request->hasFile('foto_url')) {
            $path = $request->file('foto_url')->store('servicios', 'public');
            $validated['foto_url'] = $path;
        } else {
            $validated['foto_url'] = null;
        }   


        Servicio::create($validated);

        return redirect()->route('spad.indexservicio')->with('success', 'Servicio creado exitosamente.');
    }

    


}
