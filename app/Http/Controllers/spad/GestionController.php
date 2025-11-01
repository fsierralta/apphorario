<?php

namespace App\Http\Controllers\spad;

use App\Http\Controllers\Controller;
use App\Models\Empleado;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Cliente;
use App\Models\Cita;
use App\Citas\HorariosCitas;

class GestionController extends Controller
{
    //
    public function indexCita(Request $request)
    {
        $empleados = Empleado::all(["nombre","apellido","cedula","id","foto_url","telefono"]);// Lógica para obtener los empleados desde la base de datos
        return Inertia::render('spad/cita/index',[
            'empleados' => $empleados
            ]);
    }
    public function createCita(Request $request)
    {
        // Lógica para mostrar el formulario de creación de cita
        try 
        {
        $clientes =Cliente::paginate(10); // Aquí puedes obtener los clientes desde la base de datos si es necesario
        $citaHorarios=new HorariosCitas();
        $citaHorarios->genHorario();
        $horast=$citaHorarios->horas;

       // info("horad",["data" => $horast]);

        
    
        return Inertia::render('spad/cita/create',
        [
            'clientes' => $clientes,
            'horas' => $horast
        ] );
        }
        catch (\Exception $e)
        {   
          info("Error:",["message"=>$e->getMessage()]);
            
            return redirect()->route('spad.indexcita');

        }

    }   


}
