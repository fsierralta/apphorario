import { EmpleadoHorarioDaysPaginated } from '@/types/index';

interface Props {
  empleados: EmpleadoHorarioDaysPaginated;
}

const EmpleadoHorarioDays = ({ empleados }: Props) => (
  <div>
    {empleados.data.map(empleado => (
      <div key={empleado.id} className="mb-6 border p-4 rounded">
        <h2 className="font-bold">{empleado.nombre} {empleado.apellido} ({empleado.cedula})</h2>
        <ul>
          {empleado.schedules.map(schedule => (
            <li key={schedule.id} className="mb-2">
              <div>
                <span className="font-semibold">{schedule.name}</span> ({schedule.start_time} - {schedule.end_time})
              </div>
              <div>
                Días laborales:&nbsp;
                {schedule.days
                  .filter(day => day.is_working_day)
                  .map(day => day.day_of_week)
                  .join(', ')}
              </div>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
);

export default EmpleadoHorarioDays;