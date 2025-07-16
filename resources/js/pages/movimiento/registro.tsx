import { usePage,router, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/auth/auth-simple-layout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarImage } from "@/components/ui/avatar";

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

interface PageProps {
    empleados: Empleado[];
    [key: string]: unknown;
}




export default function TimeTrackingIndex() {
    const { empleados } = usePage<PageProps>().props;
    
    
    const actions = [
        { id: 'entrada', label: 'Entrada' },
        { id: 'descanso', label: 'Descanso' },
        { id: 'regreso_descanso', label: 'Regreso de Descanso' },
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

    return (
        <AppLayout
        title='Registro de Asistencia'
        description='Registro de asistencia de los empleados'
     
        
        >
              <div>
                <Link
                  href={route('logout')}
                  method='post'
                  className='bg-amber-300 rounded-md px-4 py-2 hover:bg-amber-700'
                >Salir</Link>
              </div>

                <div className="max-w-3xl mx-auto py-8 flex gap-4 mt-8 ">
                    {empleados.map((empleado) => (
                        <Card
                            key={empleado.id}
                            className="bg-amber-100 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl mb-8"
                        >
                            <CardHeader className="text-amber-700 text-2xl border-b border-amber-300 pb-2">
                                <CardTitle>Registro de Asistencia</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-6 mb-6">
                                    <Avatar>
                                        <AvatarImage
                                            src={`/${empleado.foto_url}`}
                                            className="h-16 w-16 rounded-full object-cover border-2 border-amber-400"
                                            alt={`Foto de ${empleado.nombre}`}
                                        />
                                    </Avatar>
                                    <div>
                                        <h2 className="text-xl font-bold text-amber-700">{empleado.nombre} {empleado.apellido}</h2>
                                        <p className="text-amber-600 font-semibold">Cédula: {empleado.cedula}</p>
                                        <p className="text-amber-500 text-sm">Cargo: {empleado.cargo}</p>
                                        <p className="text-muted-foreground text-xs">ID: {empleado.id}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    {actions.map((action) => (
                                        <Button
                                            key={action.id}
                                            size="lg"
                                            className="h-20 w-full text-base font-semibold bg-amber-300 hover:bg-amber-500 text-amber-900 rounded-lg shadow truncate break-words whitespace-normal text-center transition"
                                            onClick={() => handleAction(action.id, +empleado.id)}
                                            disabled={empleadoFind(empleado.id,action.id)}
                                        >
                                            {action.label}
                                        </Button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                ))}
                </div>
        </AppLayout>
    )

}