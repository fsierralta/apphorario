<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CategoriaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        //
        $categorias = Categoria::query();
        if (! $request->has('search')) {
            $request->merge(['search' => '']);
        }
        if ($request->has('search') && ! empty($request->input('search')
        )) {
            $search = $request->input('search');
            $categorias->where('nombre', 'like', "%$search%");
        }
        $categorias = $categorias->paginate(10)
            ->withQueryString();

        return Inertia::render('spad/categoria/index', ['categorias' => $categorias]);

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $validated = $request->validate([
            'nombre' => 'required|string|max:255|unique:categorias,nombre',
            'descripcion' => 'nullable|string',
            'estado' => 'required|in:activo,inactivo',
            'foto_url' => 'nullable|image|max:2048|mimes:jpeg,png,jpg',

        ]);
        if ($request->hasFile('foto_url')) {
            $path = $request->file('foto_url')->store('categorias', 'public');
            $validated['foto_url'] = '/storage/'.$path;

        }
        Categoria::create($validated);

        return redirect()->route('spad.indexcategoria')
            ->with('success', 'Categoría creada exitosamente.');

    }

    /**
     * Display the specified resource.
     */
    public function show(Categoria $categoria)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Categoria $categoria)
    {
        //
        info('data categoria: '.$categoria->toJson());

        return $categoria->toJson();

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Categoria $categoria)
    {
        //
        $validated = $request->validate([
            'nombre' => 'required|string|max:255|unique:categorias,nombre,'.$categoria->id,
            'descripcion' => 'nullable|string',
            'estado' => 'required|in:activo,inactivo',
            'foto_url' => 'nullable|image|max:2048|mimes:jpeg,png,jpg',

        ]);
        if ($request->hasFile('foto_url')) {
            // delete previous image from storage (if present)
            if (! empty($categoria->foto_url)) {
                $old = $categoria->foto_url;
                // expected stored path is like '/storage/categorias/xxx.jpg' or 'storage/categorias/xxx.jpg'
                if (str_starts_with($old, '/storage/')) {
                    $oldPath = substr($old, 9); // remove leading '/storage/'
                } elseif (str_starts_with($old, 'storage/')) {
                    $oldPath = substr($old, 8);
                } else {
                    $oldPath = $old;
                }
                if ($oldPath && Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }

            $path = $request->file('foto_url')->store('categorias', 'public');
            $validated['foto_url'] = '/storage/'.$path;

        }
        $categoria->update($validated);

        return redirect()->route('spad.indexcategoria')
            ->with('success', 'Categoría actualizada exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Categoria $categoria)
    {
        //
        try {
            // delete image from storage (if present)
            if (! empty($categoria->foto_url)) {
                $old = $categoria->foto_url;
                // expected stored path is like '/storage/categorias/xxx.jpg' or 'storage/categorias/xxx.jpg'
                if (str_starts_with($old, '/storage/')) {
                    $oldPath = substr($old, 9); // remove leading '/storage/'
                } elseif (str_starts_with($old, 'storage/')) {
                    $oldPath = substr($old, 8);
                } else {
                    $oldPath = $old;
                }
                if ($oldPath && Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }
            $categoria->delete();

            return redirect()->route('spad.indexcategoria')
                ->with('success', 'Categoría eliminada exitosamente.');
        } catch (\Exception $e) {
            return redirect()->route('spad.indexcategoria')
                ->with('error', 'Error al eliminar la categoría: '.$e->getMessage());
        }

    }
}
