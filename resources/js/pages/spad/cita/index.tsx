import React from 'react'
import AppLayout from '@/layouts/app-layout'
import { usePage,Link } from '@inertiajs/react';
import type { Employee } from '@/types/employee';

export default function Index() {
    const { empleados } = usePage<{ empleados: Employee[] }>().props;
    console.log(empleados);
     const breadcrumbs=[
        {
            title:'Dashboard',
            href:'/dashboard'
        },
        {title:'Citas spad',
         href:route('spad.indexcita')
        }
    ]    

  return(
    <AppLayout     breadcrumbs={breadcrumbs}     >
         <div>
            <h1 className="text-4xl font-extrabold text-amber-900 drop-shadow-lg mb-6 text-center">Citas SPAD</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {empleados && empleados.length > 0 ? (
                    empleados.map((empleado) => (
                        <div key={empleado.id} className="bg-white/80 rounded-xl shadow-lg p-6 flex flex-col items-center justify-center hover:shadow-xl transition">
                            <img
                                src={empleado.foto_url || '/default-avatar.png'}
                                alt={empleado.nombre}
                                className="w-24 h-24 rounded-full mb-4 object-cover"
                            />
                            <span className="text-amber-700 text-2xl font-bold mb-2">{empleado.nombre} {empleado.apellido}</span>
                            <p className="text-amber-800 text-center mb-4">Celular: {empleado.telefono}</p>
                            <div className='flex gap-2'>
                            <a href={"#"} className="bg-amber-300 text-amber-900 font-semibold px-4 py-2 rounded shadow hover:bg-amber-            
                            400 transition">Ver Citas</a> 
                            <Link href={route('spad.createcita')} className="bg-amber-300 text-amber-900 font-semibold px-4 py-2 rounded shadow hover:bg-amber-            
                            400 transition"> Crear Cita</Link> 
                            </div> 

                    </div>
                    ))
                    ) : (
                        <p className="text-amber-800 text-center">No hay empleados disponibles.</p> 
                    )}
           </div>
          
    </div>     
            

    </AppLayout>
  )
}
