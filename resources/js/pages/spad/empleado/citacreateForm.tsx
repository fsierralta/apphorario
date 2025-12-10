import AppLayout from "@/layouts/app-layout"
import { usePage, useForm, Link, router } from "@inertiajs/react"
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import {  useEffect, useState } from 'react';
import {ToastContainer} from "react-toastify";
import toastMessage from '@/helper/toastMessage';
import type { Employee } from "@/types/employee"
import DialogDemo from '@/pages/spad/cliente/clienteCreate';


interface PageProps extends InertiaPageProps {
    empleado: Employee
    hora: string[]
    errors: Record<string, any>
    flash: any
    clientes: {
        data: Array<{
            id: number
            nombre: string
            apellido: string
        }>
        links: Array<{
            url: string | null
            label: string
            active: boolean
        }>
    }
}

interface FormData {
    empleado_id: string
    nombre: string
    apellido: string
    cliente_id: string
    estado: string
    hora:string
    descripcion: string
    fecha_hora: string
     [key: string]: string | number | undefined
}

export default function CitacreateForm() {
    const { empleado, hora, flash,errors,clientes } = usePage<PageProps>().props
     const { data, setData,processing } = useForm<FormData>({
        empleado_id: empleado.id.toString(),
        nombre: empleado.nombre,
        apellido: empleado.apellido,
        cliente_id: '0',
        estado: 'pendiente',
        hora:'',
        descripcion: '',
        fecha_hora:" ",
        });
    // console.log(usePage().props)
    const [search, setSearch] = useState('');
    const horas = hora;
    console.log("error",errors);
                if (errors.nombre) toastMessage(errors.nombre,'error');
                if (errors.apellido) toastMessage(errors.apellido,'error');
                if (errors.cedula) toastMessage(errors.cedula,'error');
                if (errors.email) toastMessage(errors.email,'error');

    
    const onSearch = () => {
        router.get(route('spad.showcitaform', {
            search: search,
            empleado_id: `${data.empleado_id}`
        }), {
            preserveState: true,
            replace: true,
            only: ['clientes']
        });
    }

    const onSubmitForm = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        router.post(
            route('spad.storecita', {
                ...data,
                search: search,
            })
        );
    }
  
    
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const search = urlParams.get('search');
        const empleado_id = urlParams.get('empleado_id');
        if (search && empleado_id) {
            setSearch(search);
           // setData('empleado_id', empleado_id);
        }
    }, []); 

    useEffect(()=>{
        if(flash.success){
            toastMessage(flash.success,'success' );
        }
        if(flash.error){
            toastMessage(flash.error,'error');
        }
        if(flash.message){
            toastMessage(flash.message,'info');
        }   
    
    }, [flash]);    

    return (
        <AppLayout
           breadcrumbs={[
            { title: 'SPAD | Agendando Cita', 
               href: "#" 
            }]}  
        >
           <ToastContainer/>

            <div className="min-h-screen bg-black py-2 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full mx-auto bg-amber-50 rounded-xl shadow-lg 
                                overflow-hidden md:max-w-2xl p-8 border-2 border-amber-500">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-amber-700">Agendando Cita</h1>
                        <p className="mt-2 text-amber-800">Complete los datos de la cita</p>
                    </div>
                    
                    <form className="space-y-6"
                      onSubmit={onSubmitForm}
                    >
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="empleado_id" className="block text-sm font-medium text-amber-800 mb-1">ID Empleado</label>
                                <input 
                                    type="text" 
                                    value={data.empleado_id} 
                                    disabled
                                    className="w-full px-3 py-2 border border-amber-300 text-black bg-amber-600 rounded-md shadow-sm 
                                    focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"/>
                                    
                                    
                            </div>
                            
                            <div>
                                <label htmlFor="nombre" className="block text-sm font-medium text-amber-800 mb-1">Nombre y Apellidos</label>
                                <input 
                                    type="text" 
                                    value={`${data.nombre} ${data.apellido}`} 
                                    name="nombre"
                                    disabled
                                    className="w-full px-3 py-2 border border-amber-300  bg-amber-600 rounded-md shadow-sm 
                                  "

                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-amber-800 mb-1">Hora</label>
                                <select
                                    name="hora" 
                                    value={data.hora} 
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setData("hora", e.target.value)}
                                    className="w-full px-3 py-2 border border-amber-300 text-amber-900 bg-amber-600 rounded-md shadow-sm"
                                >
                                    <option value="">Seleccione una hora</option>
                                    { horas && horas.map((horaOption) => (
                                        <option key={horaOption} value={horaOption}>
                                            {horaOption}
                                        </option>
                                    ))}
                                </select>
                                <div>
                                    {errors.hora  &&
                                     <div className="text-red-500 text-sm mt-1">
                                                    {errors.hora}
                                                </div>}
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-medium text-amber-800 mb-3">Seleccionar Cliente</h3>
                                    
                                    <div className="flex space-x-2 mb-4">
                                        <div className="flex-1">
                                            <input 
                                                type="text" 
                                                name="search"
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                                 placeholder="Buscar por nombre..."
                                                className="w-full px-3 py-2 border border-amber-300 bg-amber-600 text-amber-900 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                            />
                                        </div>
                                        <button 
                                            type="button" 
                                            value={search}
                                            onClick={onSearch}
                                            className="px-4 py-2 bg-amber-600 text-white rounded-md
                                             mx-4 hover:bg-amber-700 focus:outline-none focus:ring-2

                                              focus:ring-amber-500 focus:ring-offset-2 transition-colors"
                                        >
                                            Buscar
                                        </button>  
                                        <div className="mx-2">
                                        <DialogDemo/>
                                        </div>
                                       
                                    </div>

                                    <div className="relative">
                                        <label htmlFor="cliente_id" className="block text-sm font-medium text-amber-800 mb-2">Cliente</label>
                                        <select 
                                            id="cliente_id"
                                            name="cliente_id" 
                                            value={data.cliente_id}
                                            onChange={(e) => setData('cliente_id', e.target.value)}
                                            className="w-full px-3 py-2 border border-amber-300
                                             bg-amber-600 text-amber-900 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 appearance-none"
                                        >
                                            <option value="0">Seleccione un cliente</option>
                                            {clientes?.data?.map((cliente) => (
                                                <option 
                                                    key={cliente.id} 
                                                    value={cliente.id}
                                                >
                                                    {cliente.nombre} {cliente.apellido}
                                                </option>
                                            ))}  
                                        </select>
                                        {errors.cliente_id && (
                                            <div className="text-red-500 text-sm mt-1">
                                                {errors.cliente_id}
                                            </div>
                                        )
                                            }

                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-amber-700 top-6">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <label htmlFor="descripcion" className="block text-sm font-medium text-amber-800 mb-2">Fecha</label>
                                            <input
                                               type="date"
                                                id="fecha_hora"
                                                name="fecha_hora"
                                                value={data.fecha_hora}
                                                onChange={(e) => setData('fecha_hora' , e.target.value)}
                                                className="w-full px-3 py-2 border border-amber-300
                                                 bg-amber-600 text-amber-900 rounded-md 
                                                 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                            />
                                            {errors.fecha_hora && (
                                                <div className="text-red-500 text-sm mt-1">
                                                    {errors.fecha_hora}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <label htmlFor="descripcion" className="block text-sm font-medium text-amber-800 mb-2"  >Nota </label>
                                            <textarea   
                                              name="descripcion"
                                              id="descripcion"      
                                              value={data.descripcion}
                                              onChange={(e) => setData('descripcion' , e.target.value)}  
                                              className="w-full bg-amber-600 text-amber-900 rounded-md 
                                              shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 "       
                                            />
                                            {errors.descripcion && (
                                                <div className="text-red-500 text-sm mt-1">
                                                    {errors.descripcion}
                                                </div>
                                            )}
                                            



                                            
                                        </div> 

                                    </div>
                                <div className="flex flex-wrap justify-center gap-2 mt-4">
                                    {clientes && clientes.links && clientes.links.map((link,idx) => (
                                        link.url ? (
                                            <Link
                                                key={idx}
                                                href={`${link.url}${link.url.includes('?') ? '&' : '?'}empleado_id=${data.hora}-${data.empleado_id}${search ? `&search=${encodeURIComponent(search)}` : ''}`}
                                                className={`px-3 py-1 rounded-md text-sm font-medium ${
                                                    link.active
                                                        ? 'bg-amber-600 text-white border-amber-600'
                                                        : 'bg-white text-amber-700 border border-amber-300 hover:bg-amber-50'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ) : (
                                            <span 
                                                key={idx}
                                                className="px-3 py-1 text-amber-400 text-sm font-medium"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        )
                                    ))}
                                </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex justify-end space-x-4 pt-4 gap-2">
                            <button
                                type="button"
                                onClick={() => router.get(route('spad.indexcita'))}
                                className="px-4 py-2 border border-amber-500 rounded-md shadow-sm text-sm font-medium text-amber-700 bg-red-300 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                            >
                                Volver
                            </button>

                            <button
                                type="submit"
                                 disabled={processing}

                                className="px-4 py-2  border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                            >
                                Agendar Cita
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </AppLayout>
    )
}
