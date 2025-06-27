import React from 'react';
import AppLayout from '@/layouts/app-layout';
import Pagination from '@/components/pagination/pagination';
import { PaginationLink } from '@/types';
interface Day {
  id: number;
  day_of_week: number;
  is_working_day: boolean;
}

interface Schedule {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
  days: Day[];
  pivot: {
    start_date: string;
    end_date: string | null;
    is_active: boolean;
  };
}

interface Empleado {
  id: number;
  nombre: string;
  apellido: string;
  cedula: string;
  schedules: Schedule[];
}

interface EmpleadoHorarioDaysPaginated {
  links: PaginationLink[];
  data: Empleado[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface Props {
  empleados: EmpleadoHorarioDaysPaginated;
}

const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const EmpleadoHorarioDays: React.FC<Props> = ({ empleados }) => (


 
  <AppLayout>
  <div className="overflow-x-auto ">
    <table className="min-w-full border border-gray-300 rounded shadow">
      <thead className="bg-blue-600">
        <tr>
          <th className="px-2 py-2 text-white border">Empleado</th>
          <th className="px-2 py-2 text-white border">Cédula</th>
          <th className="px-2 py-2 text-white border">Horario</th>
          <th className="px-2 py-2 text-white border">Inicio</th>
          <th className="px-2 py-2 text-white border">Fin</th>
          <th className="px-2 py-2 text-white border">Días Laborales</th>
          <th className="px-2 py-2 text-white border">Días Descanso</th>
        </tr>
      </thead>
      <tbody>
        {empleados.data.map((empleado) =>
          empleado.schedules.map((schedule) => (
            <tr key={`${empleado.id}-${schedule.id}`}>
              <td className="border px-2 py-1">{empleado.nombre} {empleado.apellido}</td>
              <td className="border px-2 py-1">{empleado.cedula}</td>
              <td className="border px-2 py-1">{schedule.name}</td>
              <td className="border px-2 py-1">{schedule.start_time}</td>
              <td className="border px-2 py-1">{schedule.end_time}</td>
              <td className="border px-2 py-1">
                {schedule.days
                  .filter(day => day.is_working_day)
                  .map(day => diasSemana[day.day_of_week - 1])
                  .join(', ') || <span className="text-gray-400">Sin días</span>}
              </td>
              <td>
               { 
                schedule.days
                  .filter(day => !day.is_working_day)
                  .map(day => diasSemana[day.day_of_week - 1])
                  .join(', ') || <span className="text-gray-400">Sin días</span>
                  }

              </td>

            </tr>
          ))
        )}
      </tbody>
    </table>
    <div className='mt-4 flex justify-center mb-4'>
     <Pagination
     links={empleados.links }
      />
    </div>  
  </div>
 </AppLayout> 
  

);

export default EmpleadoHorarioDays;