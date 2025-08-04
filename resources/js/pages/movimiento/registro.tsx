import { usePage,router, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/auth/auth-simple-layout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {  useEffect } from 'react';
import {ToastContainer} from 'react-toastify';
import toastMessage from '@/helper/toastMessage';
// Declaración para los registros de entrada recibidos desde el backend
interface arrayRegistroEntradas {
    id: number;
    tipo: string;
    created_at: string; // o Date según tu preferencia
    updated_at?: string;
    // agrega más campos si tu API los devuelve
}

interface Empleado {
    id: number;
    nombre: string;
    apellido: string;
    cedula: string;
    telefono: string;
    direccion: string;
    foto_url: string;
    cargo: string;
    user_id: number;
    email: string;
    registro_entradas:arrayRegistroEntradas[];
    [key: string]: unknown;
}
interface FlashProps {
    message?: string;
    error?: string;
    success?: string;
}

interface PageProps {
    empleados: Empleado[];
    [key: string]: unknown;
    flash: FlashProps;
}




export default function TimeTrackingIndex() {
    const { empleados,flash } = usePage<PageProps>().props;
    
    console.log(empleados)
    const actions = [
        { id: 'entrada', label: 'Entrada' },
        { id: 'descanso', label: 'Descanso' },
        { id: 'regreso_descanso', label: 'R.Descanso' },
        { id: 'salida', label: 'Salida' }
    ];
  
    const empleadoFind=(id:number,action:string)=>{
        const elempleado=empleados.find((empleado) => empleado.id === id);
        if(elempleado){
           // console.log(elempleado)
            const registro=elempleado.registro_entradas.find((registro) => registro.tipo === action);
            if(registro){
                return true;
            }else{
                return false;
            }

           
        }
        return false;
    }

    const handleAction = (actionType: string, id: number) => {
        // Lógica para registrar la acción
        console.log(`Registrando: ${actionType}- ${id}`);
        router.post(route('actividad.store', { empleado: id, tipo: actionType }), {
          empleado_id: id,
            tipo: actionType
        }, {
            onSuccess: () => {
                // Aquí puedes manejar la respuesta después de registrar la acción
                console.log(`Acción ${actionType} registrada para el empleado con ID ${id}`);
            },
            onError: (error) => {
                // Manejo de errores
                console.error(`Error al registrar la acción ${actionType}:`, error);
            }
        }); 


    };

    useEffect(() => {

        const dataMessage= Object.entries(flash) ;
        dataMessage.forEach(([key, value]) => {
            if (value) {
                toastMessage(value, key as 'success' | 'error' | 'warning' | 'info' | 'message');

       
        }
    });


       
    }, [flash]);



    return (
        <AppLayout
        title='Registro de Asistencia'
        description='Registro de asistencia de los empleados'
     
        
        >
         <ToastContainer/>
              <div className='justify-between items-center mx-auto'>
                <Link
                  href={route('logout')}
                  method='post'
                  className='bg-amber-300 rounded-md px-4 py-2 hover:bg-amber-700'
                >Salir</Link>
              </div>

                <div className="max-w-4xl mx-auto py-4 flex flex-col items-center">
                   
                    <div className="flex flex-wrap gap-4 justify-center w-full">
                    {empleados.map((empleado) => (
                        <Card
                            key={empleado.id}
                            className="bg-amber-100 shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl mb-2 w-full max-w-xs sm:min-w-[320px] sm:max-w-[480px]"
                        >
                            <CardHeader className="text-amber-700 text-lg border-b border-amber-300 pb-1 text-center">
                                <CardTitle>Asistencia</CardTitle>
                            </CardHeader>
                            <CardContent className="p-3">
                                <div className="flex flex-col items-center gap-2 mb-3">
                                    <Avatar>
                                        <AvatarImage
                                            src={`/${empleado.foto_url}`}
                                            className="h-12 w-12 rounded-full object-cover border-2 border-amber-400"
                                            alt={`Foto de ${empleado.nombre}`}
                                        />
                                    </Avatar>
                                    <div className="text-center">
                                        <h2 className="text-base font-bold text-amber-700">{empleado.nombre} {empleado.apellido}</h2>
                                        <p className="text-amber-600 font-semibold text-xs">Cédula: {empleado.cedula}</p>
                                        <p className="text-amber-500 text-xs">Cargo: {empleado.cargo}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    {actions.map((action) => (
                                        <Button
                                            key={action.id}
                                            size="sm"
                                            className="h-9 w-full text-xs font-semibold bg-amber-300 hover:bg-amber-500 text-amber-900 rounded shadow text-center transition whitespace-nowrap overflow-hidden text-ellipsis px-2"
                                            style={{maxWidth: '100%'}}
                                            onClick={() => handleAction(action.id, +empleado.id)}
                                            disabled={empleadoFind(empleado.id,action.id)}
                                        >
                                            {action.label.length > 14 ? action.label.slice(0, 12) + '…' : action.label}
                                        </Button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    </div>
                </div>
        </AppLayout>
    )

}