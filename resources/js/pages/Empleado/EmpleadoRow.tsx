import React from 'react';
import { Link } from '@inertiajs/react';

interface Empleado {
  id: number;
  nombre: string;
  apellido: string;
  cedula: string;
  telefono: string;
  direccion: string;
  foto_url: string;
  cargo: string;
  email: string;
}

interface Props {
  empleado: Empleado;
}

const EmpleadoRow: React.FC<Props> = ({ empleado }) => (

  <tr className="border border-gray-300">
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border border-gray-300">{empleado.id}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border border-gray-300">{empleado.nombre}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border border-gray-300">{empleado.apellido}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border border-gray-300">{empleado.cedula}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border border-gray-300">{empleado.email}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border border-gray-300">{empleado.telefono}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border border-gray-300">{empleado.direccion}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border border-gray-300">
      {empleado.foto_url ? (
        <img
          src={empleado.foto_url}
          alt={`${empleado.nombre} ${empleado.apellido}`}
          className="h-10 w-10 rounded-full object-cover border"
        />
      ) : (
        <span className="text-gray-400 italic">Sin foto</span>
      )}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border border-gray-300">{empleado.cargo}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border border-gray-300 gap-4 flex justify-center items-center">
      <Link
        href={`/empleados/${empleado.id}/edit`}
       
      >
      <span className='text-black hover:underline bg-yellow-300 px-2 py-1 rounded'> Editar</span>  
      </Link>
      <Link
        href={`/empleados/${empleado.id}`}
        method="delete"
        
      >
       <span className='text-black hover:underline bg-red-600 px-2 py-1 rounded'> Eliminar</span> 
      </Link>
    </td>
  </tr>

 )
 


export default EmpleadoRow;