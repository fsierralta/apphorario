import AppLayout from '@/layouts/app-layout'
import { usePage,Link } from '@inertiajs/react';
import type { EmpleadoCita, PaginatedEmpleadoCitas} from '@/types';
import Pagination from '@/components/pagination/pagination';


export default function ListaCita()     {
     const { empleado, citas } = usePage<{
         empleado: EmpleadoCita;
         citas: PaginatedEmpleadoCitas;
     }>().props;
      console.log(empleado)
      console.log(citas)
      
    return(
        <AppLayout
         breadcrumbs={[
            {
            title:'Regresar',
            href:route('spad.indexcita')

         },
          {
            title:'Cita del Empleado',
            href:"#"

         }


        ]}

         
>
          
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                {empleado && (
                    <div className="bg-amber-400 shadow-sm rounded-lg p-4 mb-6">
                        <div className="flex items-center space-x-4">
                            {empleado.foto_url && (
                                <img 
                                    className="h-12 w-12 rounded-full object-cover border border-gray-200" 
                                    src={empleado.foto_url} 
                                    alt={`${empleado.nombre} ${empleado.apellido}`}
                                />
                            )}
                            <div>
                                <h2 className="text-lg font-medium text-gray-900">
                                    {empleado.nombre} {empleado.apellido}
                                </h2>
                                <p className="text-sm text-gray-500">ID: {empleado.id}</p>
                            </div>
                        </div>
                    </div>
                )}
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Lista de Citas</h2>
            </div>


            <div className="overflow-x-auto">
                <div className="flex justify-end">
                    <Link 
                    href={route('spad.showcitaform',empleado.id)}
                    className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded my-4"
                    >Crear cita</Link>
                </div>

                <table className="min-w-full bg-white rounded-lg overflow-hidden ">
                    <thead className="bg-amber-400">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nombre
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Fecha
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Estatus
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nota
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Cliente ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>

                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {citas && citas.data && citas.data.length > 0 ? (
                            citas.data.map((cita, idx) => (
                                <tr key={cita.cita_id || idx} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {cita.cita_id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {cita.cte_nombre} {cita.cte_apellido}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {cita.cita_fecha_hora}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            cita.cita_estado === 'completada' ? 'bg-green-100 text-green-800' :
                                            cita.cita_estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {cita.cita_estado}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                        {cita.cita_descripcion}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {cita.cita_cliente_id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 gap-2">
                                        <div className="flex gap-2">
                                        <Link href={'#'} 
                                          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                                        >
                                            Editar
                                        </Link>
                                     
                                  
                                        <Link
                                        method='delete'
                                         href={route('spad.destroycita',{cita:cita.cita_id})}
                                         className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                                            >   


                                            Eliminar
                                        </Link>
                                        </div>
                                    </td>   
                                       

                          </tr>
                        ))
                    ) : (
                        <tr><td colSpan={6}><p>No hay Datos</p></td></tr>
                    )

                    }
                    
                </tbody>

            
            </table>   
            <div className="my-4">
                {citas && citas.links && citas.links.length > 0 && (
                    <div className="flex justify-center mt-4">
                        <Pagination links={citas.links} />
                    </div>
                )}

            </div>


           
        </div>

        </AppLayout>
       
    )   


}

