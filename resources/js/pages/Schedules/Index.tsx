import React from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import ScheduleForm from './ScheduleForm';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Horario } from '@/types';
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Inicio', href: '/' }
];
interface ScheduleDay {
  day_of_week: number|null;        // 1 = Lunes, 2 = Martes, ..., 7 = Domingo
  is_working_day: boolean|null;
}

interface ArregloHorario {
    schedules: Horario[];
    days:ScheduleDay[]|null
    [key: string]: unknown; // Index signature to satisfy PageProps constraint
}

export default function SchedulesIndex() {
    const { schedules } = usePage<ArregloHorario>().props;
    const [editingSchedule, setEditingSchedule] = useState<Horario | null>(null);
    const [showForm, setShowForm] = useState(false);


    const handleDelete = (id:number) => {
        if (confirm('¿Eliminar este horario?')) {
            router.delete(route('schedules.destroy', id));
        }
    };
    console.log(schedules)
    return (
     <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestión de Horarios" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">Horarios de Trabajo</h2>
                                <button 
                                    onClick={() => {
                                        setEditingSchedule(null);
                                        setShowForm(true);
                                    }}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                >
                                    + Nuevo Horario
                                </button>
                            </div>

                            {/* Lista de Horarios */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horario</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Días Laborales</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {schedules.map((schedule) => (
                                            <tr key={schedule.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-black">{schedule.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {schedule.start_time} - {schedule.end_time}
                                                    {schedule.has_break && (
                                                        <span className="block text-sm text-gray-500">
                                                            Descanso: {schedule.break_start} - {schedule.break_end}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex space-x-1">
                                                        {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                                                            const scheduleDay = schedule.days?.find(d => d.day_of_week === day);
                                                            const isWorking = scheduleDay?.is_working_day;
                                                            
                                                            return (
                                                                <div 
                                                                    key={day} 
                                                                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                                        isWorking 
                                                                            ? 'bg-green-500 text-white' 
                                                                            : 'bg-gray-200 text-gray-500'
                                                                    }`}
                                                                    title={getDayName(day)}
                                                                >
                                                                    {dayNameInitials[day as 1|2|3|4|5|6|7]}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button
                                                        onClick={() => {
                                                            setEditingSchedule(schedule);
                                                            setShowForm(true);
                                                        }}
                                                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (schedule.id !== null) handleDelete(schedule.id);
                                                        }}
                                                        className="text-red-600 hover:text-red-900"
                                                        disabled={schedule.id === null}
                                                    >
                                                        Eliminar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal para crear/editar */}
            {(showForm ) && (
                <ScheduleForm 
                    schedule={editingSchedule} 
                    onClose={() => setShowForm(false)} 
                />
            )}
     </AppLayout>
    );
}

// Helpers para días
const dayNameInitials:Record<1 | 2 | 3 | 4 | 5 | 6 | 7, string> = {
    1: 'L',
    2: 'M',
    3: 'X',
    4: 'J',
    5: 'V',
    6: 'S',
    7: 'D'
};

const getDayName = (day:number) => {
    const names = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    return names[day - 1];
};