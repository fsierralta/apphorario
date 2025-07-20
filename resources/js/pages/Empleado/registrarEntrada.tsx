import { usePage,router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Pagination from '@/components/pagination/pagination';
import { PaginationLink } from '@/types';
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
interface PropsData{
    links: PaginationLink[];
    data:Empleado[]
}


interface PageProps {
    empleados: PropsData;
    [key: string]: unknown;
}


export default function TimeTrackingIndex() {
    const { empleados } = usePage<PageProps>().props;
    console.log(empleados  )
    
    const actions = [
        { id: 'entrada', label: 'Entrada' },
        { id: 'descanso', label: 'Descanso' },
        { id: 'regreso_descanso', label: 'Regreso de Descanso' },
        { id: 'salida', label: 'Salida' }
    ];
  
    const empleadoFind=(id:number,action:string)=>{
        const elempleado=empleados.data.find((empleado) => empleado.id === id);
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
        router.post(route('showformhorario.register', { empleado: id, tipo: actionType }), {
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
            },
            preserveScroll: true,
            preserveState:true
        }); 


    };
return (
    <AppLayout>
        <div className="min-h-screen bg-gradient-to-br from-amber-100 via-amber-300 to-amber-500 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-extrabold text-amber-900 mb-8 text-center">Registro de Asistencia</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {empleados.data.map((empleado) => (
                        <Card
                            key={empleado.id}
                            className="bg-amber-100 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl"
                        >
                            <CardHeader className="text-amber-700 text-xl border-b border-amber-300 pb-2 text-center">
                                <CardTitle>Empleado</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="flex flex-col items-center gap-4 mb-6">
                                    <Avatar>
                                        <AvatarImage
                                            src={`/${empleado.foto_url}`}
                                            className="h-100 w-100 rounded-full object-cover border-2 border-amber-400"
                                            alt={`Foto de ${empleado.nombre}`}
                                        />
                                    </Avatar>
                                    <div className="text-center">
                                        <h2 className="text-lg font-bold text-amber-700">{empleado.nombre} {empleado.apellido}</h2>
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
                                            className="h-16 w-full text-base font-semibold bg-amber-300 hover:bg-amber-500 text-amber-900 rounded-lg shadow truncate break-words whitespace-normal text-center transition"
                                            onClick={() => handleAction(action.id, +empleado.id)}
                                            disabled={empleadoFind(empleado.id, action.id)}
                                        >
                                            {action.label}
                                        </Button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <div>
                    <Pagination links={empleados.links}/>
                </div>
            </div>
        </div>
    </AppLayout>
)
    

}