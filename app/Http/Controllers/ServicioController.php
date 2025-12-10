<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use App\Models\Servicio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ServicioController extends Controller
{
    //
    public function index(Request $request)
    {
        $query = Servicio::query();
        if (! $request->has('search')) {
            $request->merge(['search' => '']);

        }
        if ($request->has('search') && ! empty($request->input('search'))) {
            $search = $request->input('search');
            $query->where('nombre_servicio', 'like', "%$search%");

        }
        $query->join('categorias', 'servicios.categoria_id', '=', 'categorias.id')
            ->select('categorias.nombre as categoria_nombre', 'categorias.id as categoriaId', 'servicios.*');

        $servicios = $query->paginate(10)
            ->withQueryString();

        return Inertia::render('spad/servicio/index', ['servicios' => $servicios]);

    }

    public function create()
    {
        //
        return Inertia::render('spad/servicio/create',
            ['categorias' => Categoria::all()->where('estado', 'activo')]);
    }

    public function store(Request $request)
    {
        //
        $validated = $request->validate([
            'nombre_servicio' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'precio' => 'required|numeric|min:1',
            'foto_url' => 'nullable|image|max:2048|mimes:jpeg,png,jpg',
            'estado' => 'required|in:activo,inactivo',
            'categoria_id' => 'required|exists:categorias,id',

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

    public function edit(Servicio $servicio)
    {
        //
        $categorias = Categoria::all()->where('estado', 'activo');
        info('data servicio: '.$servicio->toJson());

        return ['servicio' => $servicio,
            'categorias' => $categorias];

    }

    public function update(Request $request, $id)
    {
        //

        $servicio = Servicio::findOrFail($id);
        $validated = $request->validate([
            'nombre_servicio' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'precio' => 'required|numeric|min:1',
            'foto_url' => 'nullable|image|max:2048|mimes:jpeg,png,jpg',
            'estado' => 'required|in:activo,inactivo',
            'categoria_id' => 'required|exists:categorias,id',
        ]);
        if ($request->hasFile('foto_url')) {
            $path = $request->file('foto_url')->store('servicios', 'public');
            $validated['foto_url'] = $path;
        }

        try {

            $servicio->categoria_id = $request->input('categoria_id');
            $servicio->nombre_servicio = $request->input('nombre_servicio');
            $servicio->descripcion = $request->input('descripcion');
            $servicio->precio = $request->input('precio');
            $servicio->estado = $request->input('estado');
            $servicio->foto_url = $path ?? $servicio->foto_url;
            $servicio->save();

            // $servicio->update($validated);
            return redirect()->route('spad.indexservicio')->with('success', 'Servicio actualizado exitosamente.');

        } catch (\Exception $e) {
            Log::error('Error updating servicio: '.$e->getMessage());

            return redirect()->back()->with('error', 'Hubo un error al actualizar el servicio.');
        }

    }
}
