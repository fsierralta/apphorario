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
  <tr className="border border-amber-300 bg-white/80 hover:bg-amber-100 transition">
    <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-900 font-semibold border border-amber-300">{empleado.id}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-900 border border-amber-300">{empleado.nombre}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-900 border border-amber-300">{empleado.apellido}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-900 border border-amber-300">{empleado.cedula}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-900 border border-amber-300">{empleado.email}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-900 border border-amber-300">{empleado.telefono}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-900 border border-amber-300">{empleado.direccion}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm border border-amber-300">
      {empleado.foto_url ? (
        <img
          src={empleado.foto_url}
          alt={`${empleado.nombre} ${empleado.apellido}`}
          className="h-10 w-10 rounded-full object-cover border-2 border-amber-400 mx-auto"
        />
      ) : (
        <span className="text-amber-400 italic">Sin foto</span>
      )}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-900 border border-amber-300">{empleado.cargo}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm border border-amber-300">
      <Link
        href={`/empleados/${empleado.id}/edit`}
        className="bg-amber-300 text-amber-900 font-semibold px-3 py-1 rounded shadow hover:bg-amber-400 transition"
      >
        Editar
      </Link>
      <Link
        href={`/empleados/${empleado.id}`}
        method="delete"
        className="bg-red-100 text-red-700 font-semibold px-3 py-1 rounded shadow hover:bg-red-200 transition ml-2"
      >
        Eliminar
      </Link>
    </td>
  </tr>
);

export default EmpleadoRow;