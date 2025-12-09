import React from 'react'
import AppLayout from '@/layouts/app-layout'
import { usePage, router, Link } from '@inertiajs/react';
import type { Empleado, Paginated } from '@/types';
import { TfiAgenda, TfiCreditCard } from "react-icons/tfi";


interface Cita {
    id: number;
    empleado_id: number;
    fecha_hora: string;
    created_at: string;
    updated_at: string;
    // Add other properties as needed based on your data structure
}

export default function Index() {
    const { empleados, horas,citas } = usePage<{ 
        empleados: Paginated<Empleado>, 
        horas: string[],
        citas: Cita[]
    }>().props;
   
    const breadcrumbs=[
        {
            title:'Dashboard',
            href:'/dashboard'
        },
        {title:'Citas spad',
         href:route('spad.indexcita')
        }
    ]  

    const onClickCita=(e:React.MouseEvent<HTMLButtonElement>)=>{
        //alert(e.currentTarget.value)
        return router.get(route('spad.listacita',{empleado_id:e.currentTarget.value} ))

    }  

    const getCita=(id:number,horas:string)=>{
        const cita=citas?.find((cita)=>cita.empleado_id===id && cita.fecha_hora.split(' ')[1].substring(0,5)===horas) 
        if(cita){
               return true
            }
        return false

    }


  return(
    <AppLayout     breadcrumbs={breadcrumbs}     >
         <div>
            <h1 className="text-4xl font-extrabold text-amber-900 drop-shadow-lg mb-6 text-center">Citas SPAD</h1>
            <div className='my-4 '>
                <button className='bg-amber-900 text-amber-900 font-bold px-3 py-2
                 rounded shadow hover:bg-amber-400 transition flex items-center gap-2'
               
                 >{`Facturar`}
                 <TfiCreditCard />
                </button>
            </div>
           <div className="overflow-x-auto">
               <table className="min-w-full bg-white border border-amber-200">
                   <thead>
                       <tr className="bg-amber-100">
                           <th className="py-2 px-4 border-b border-amber-200 text-left text-amber-800 font-bold">Hora</th>
                           {empleados &&  empleados.data.map((empleado) => (
                               <th key={empleado.id} className="py-2 px-4 border-b border-amber-200 text-left text-amber-800 font-bold">
                                   {empleado.nombre} {empleado.apellido}
                               </th>
                           ))}
                       </tr>
                   </thead>
                   <tbody>
                       {horas && horas.length > 0 ? horas.map((hora, index) => (
                           <tr key={index} className="hover:bg-amber-50">
                               <td className="py-2 px-4 border-b border-amber-200 text-amber-900">{hora}</td>
                               {empleados && empleados.data.length > 0 
                                   ? empleados.data.map((empleado) => (
                                       <td key={empleado.id} className="py-2 px-4 border-b border-amber-200 ">
                                        <div className='flex gap-2'>
                                          <button
                                            value={`${hora}-${empleado.id}`}
                                            name={`${hora}`}
                                            onClick={onClickCita}
                                            className="bg-amber-300 text-amber-900 font-bold px-3 py-1 rounded shadow hover:bg-amber-400 transition text-sm"
                                           >
                                               <span className='text-amber-900'>{`Cita`} {getCita(empleado.id,hora) &&<TfiAgenda />}</span>
                                           </button>
                                          
                                         </div>

                                        


                                       
                                           
                                           
                                       </td>
                                   ))
                                   : null
                               }
                           </tr>
                       )) : (
                           <tr>
                               <td colSpan={empleados ? empleados.data.length + 1 : 1} className="py-4 px-4 text-center text-amber-800">
                                   No hay horas disponibles.
                               </td>
                           </tr>
                       )}
                   </tbody>
               </table>
               <div className="mt-4"></div>
               <div className="flex justify-center mt-4 gap-4">      
                  {empleados && empleados.links.map((link) => (
                      link.url ? (
                          <Link 
                              href={link.url} 
                              key={link.label} 
                              className={`px-3 py-1 rounded-md text-sm font-medium ${
                                  link.active
                                      ? 'bg-amber-600 text-white border-amber-600'
                                      : 'bg-white text-amber-700 border border-amber-300 hover:bg-amber-50'
                              }`}
                              dangerouslySetInnerHTML={{ __html: link.label }}
                          />
                      ) : (
                          <span 
                              key={link.label} 
                              className="px-3 py-1 text-amber-400 text-sm font-medium border-amber-600"
                              dangerouslySetInnerHTML={{ __html: link.label }}
                          />
                      )
                  ))} 
               </div>   
           </div>
        </div>     
    </AppLayout>
  )
}
