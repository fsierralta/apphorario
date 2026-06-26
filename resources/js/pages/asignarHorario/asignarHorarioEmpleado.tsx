import { Head, router, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import {Bounce, ToastContainer,toast} from "react-toastify"
import { useEffect } from 'react';
interface Empleado {
    id: number;
    nombre: string;
    cedula: string;
    apellido: string;

}

interface HorarioEmpleado{
    id:number;
    name:string;
    start_time:string;
    end_time:string;


}

interface PageProps {
  empleados: Empleado[] ;
  schedules: HorarioEmpleado[] ;
  flash:{error:string |null,
         message:string|null,
         success:string|null


  }
  [key: string]: unknown;
}
const breadcrumbs: BreadcrumbItem[] = [
  
  { title: 'Asignar Horario', href: 'employee-schedules/show' }
];
const EmployeeScheduleAssigner = () => {
    const { empleados, schedules,flash } = usePage<PageProps>().props;
   /*  const empleados: Empleado[] = (pageProps.empleado?.empleados ?? []);
    const schedules: HorarioEmpleado[] = (pageProps.schedules?.schedules ?? []); */
    const { data, setData, processing, errors, reset } = useForm<{
        empleado_id: string;
        schedule_id: string;
        start_date: string;
        end_date: string;
        is_active: boolean;
        deactivate_others: boolean;
    }>({
        empleado_id: '',
        schedule_id: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        is_active: true,
        deactivate_others: true,
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        //turn

        router.post('/employee-schedules/assign', data, {
            onSuccess: () => reset(),
            onError:(error)=>console.log(error)
        });
    };
   
    const toastMessage = (type: string, msg: string) => {
        if (type === 'error') {
            toast.error(msg, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            })
        }

            if(type === 'success'){
                toast.success(msg, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                })
            }
        
            if(type === 'message'){
                toast.info(msg, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                })
            }

    }
   
    useEffect(() => {
        if (flash.error) {
            toastMessage('error', flash.error);
        }
        if(flash.message){
            toastMessage('success', flash.message);
        }

        if(flash.success){
            toastMessage('success', flash.success);
        }

    }, [flash]);

     return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="min-h-screen bg-gradient-to-br from-amber-100 via-amber-300 to-amber-500 flex items-center justify-center py-8 px-4">
                <ToastContainer />
                <div className="w-full max-w-2xl bg-white/80 rounded-xl shadow-xl p-8">
                    <Head title="Asignar Horario" />
                    <h2 className="mb-6 text-2xl font-extrabold text-amber-900 text-center">Asignar Horario a Empleado</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-amber-900">Empleado</label>
                                <select
                                    value={data.empleado_id}
                                    onChange={(e) => setData('empleado_id', e.target.value)}
                                    className="w-full rounded border
                                      border-amber-300 p-2
                                      bg-amber-500 focus:border-amber-500 focus:ring-amber-500"
                                    required
                                >
                                    <option value="">Seleccionar empleado</option>
                                    {empleados.length > 0 ? (
                                        empleados.map((emp: Empleado) => (
                                            <option key={emp.id} value={emp.id}
                                             className='text-black font-black'
                                            >
                                                {emp.nombre} {emp.apellido} ({emp.cedula})
                                            </option>
                                        ))
                                    ) : (
                                        <option>no hay valor</option>
                                    )}
                                </select>
                                {errors.empleado_id && <p className="text-sm text-red-500">{errors.empleado_id}</p>}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-amber-900">Horario</label>
                                <select
                                    value={data.schedule_id}
                                    onChange={(e) => setData('schedule_id', e.target.value)}
                                    className="w-full rounded border
                                     bg-amber-500 border-amber-300 p-2  focus:border-amber-500 focus:ring-amber-500"
                                    required
                                >
                                    <option value="">Seleccionar horario</option>
                                    {schedules.map((sch) => (
                                        <option key={sch.id} value={sch.id}
                                         className='text-black font-black'
                                        >
                                            {sch.id} {sch.name} ({sch.start_time} - {sch.end_time})
                                        </option>
                                    ))}
                                </select>
                                {errors.schedule_id && <p className="text-sm text-red-500">{errors.schedule_id}</p>}
                            </div>
                        </div>
                        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
                            <div>
                                <label className="mb-1 block text-sm 
                                font-semibold text-amber-900">Fecha de Inicio</label>
                                <input
                                    type="date"
                                    value={data.start_date}
                                    onChange={(e) => setData('start_date', e.target.value)}
                                    className="w-full rounded border
                                      border-amber-300 p-2 
                                      bg-amber-500
                                      focus:border-amber-500 focus:ring-amber-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-amber-900">Fecha de Fin (opcional)</label>
                                <input
                                    type="date"
                                    value={data.end_date}
                                    onChange={(e) => setData('end_date', e.target.value)}
                                    className="w-full rounded border border-amber-300 p-2
                                     text-black bg-amber-500 focus:border-amber-500 focus:ring-amber-500"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-amber-900">Opciones</label>
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="isActive"
                                            checked={data.is_active}
                                            onChange={(e) => setData('is_active', e.target.checked)}
                                            className="mr-2 accent-amber-500"
                                        />
                                        <label htmlFor="isActive" className="text-amber-900">
                                            Activar horario
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="deactivateOthers"
                                            checked={data.deactivate_others}
                                            onChange={(e) => setData('deactivate_others', e.target.checked)}
                                            className="mr-2 accent-amber-500"
                                        />
                                        <label htmlFor="deactivateOthers" className="text-amber-900">
                                            Desactivar otros horarios
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded bg-amber-300 px-6 py-2 text-amber-900 font-bold shadow hover:bg-amber-400 transition disabled:opacity-50"
                            >
                                {processing ? 'Asignando...' : 'Asignar Horario'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
};

export default EmployeeScheduleAssigner;
