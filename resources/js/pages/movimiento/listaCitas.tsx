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
            href:route('actividad.index')

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
                                    src={`/${empleado.foto_url}`} 
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


            {/* Mobile view */}
            <div className="md:hidden px-4">
                {citas && citas.data && citas.data.length > 0 ? (
                    citas.data.map((cita, idx) => (
                        <div key={cita.cita_id || idx} className="bg-white rounded-lg shadow-md p-4 mb-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-bold text-lg">{cita.cte_nombre} {cita.cte_apellido}</span>
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    cita.cita_estado === 'completada' ? 'bg-green-100 text-green-800' :
                                    cita.cita_estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                    {cita.cita_estado}
                                </span>
                            </div>
                            <div className="text-sm text-gray-600">
                                <p><span className="font-semibold">ID Cita:</span> {cita.cita_id}</p>
                                <p><span className="font-semibold">Fecha:</span> {cita.cita_fecha_hora}</p>
                                <p className="truncate"><span className="font-semibold">Nota:</span> {cita.cita_descripcion}</p>
                                <p><span className="font-semibold">Cliente ID:</span> {cita.cita_cliente_id}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white rounded-lg shadow-md p-4 text-center">
                        <p>No hay Datos</p>
                    </div>
                )}
            </div>

            {/* Desktop view */}
            <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg overflow-hidden ">
                    <thead className="bg-amber-400">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estatus</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nota</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente ID</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {citas && citas.data && citas.data.length > 0 ? (
                            citas.data.map((cita, idx) => (
                                <tr key={cita.cita_id || idx} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cita.cita_id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cita.cte_nombre} {cita.cte_apellido}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cita.cita_fecha_hora}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            cita.cita_estado === 'completada' ? 'bg-green-100 text-green-800' :
                                            cita.cita_estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {cita.cita_estado}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{cita.cita_descripcion}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cita.cita_cliente_id}</td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan={6} className="text-center py-4"><p>No hay Datos</p></td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            <div className="my-4">
                {citas && citas.links && citas.links.length > 0 && (
                    <div className="flex justify-center mt-4">
                        <Pagination links={citas.links} />
                    </div>
                )}
            </div>
        </AppLayout>
    )   
}

