import { Link, usePage, Head } from '@inertiajs/react';
import {type BreadcrumbItem, type PaginationLink } from '@/types';
import AppLayout from '@/layouts/app-layout';
import Pagination from '@/components/pagination/pagination';
import EmpleadoRow from './EmpleadoRow';
import EmpleadoTableHead from './EmpleadoTableHead';
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
}

interface PageProps {
  data: Empleado[];
  links: PaginationLink[];
  [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Inicio', href: '/' },
  { title: 'Empleados', href: '/empleados' }
];

const Index = () => {

  const { empleados} = usePage<PageProps>().props;
  const empleadosTyped = empleados as { data: Empleado[]; links: PaginationLink[] };
  const data: Empleado[] = empleadosTyped.data || []; // Cambia esto según la estructura de tu respuesta 
  const links: PaginationLink[] = empleadosTyped.links || []; // Cambia esto según la estructura de tu respuesta 
  console.log(empleados);
 



  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      
      <div className="space-y-6  ">
        <div className="flex justify-between items-center mx-30 mb-2 ">
            <Head title="Empleado" />

          
            <Link
                href="/empleados/create"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition ml-12"
            >
                Nuevo Empleado
            </Link>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[80%] border mx-auto border-gray-300 rounded-lg shadow-md">
          <EmpleadoTableHead/>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-4 text-gray-500 border border-gray-300">No hay empleados registrados.</td>
              </tr>
            ) : (
              data.map((empleado,index) => (
                <EmpleadoRow empleado={empleado}
                  key={index}
                />
             
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className='m-4 min-h-80'>
        <Pagination links={links} />
      </div>
    </AppLayout>
  );
};

export default Index;
