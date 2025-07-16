import React from 'react';
import { Horario } from '@/types';

interface SchedulesTableProps {
    schedules: Horario[];
    onEdit?: (schedule: Horario) => void;
    onDelete?: (id: number) => void;
}

const dayNameInitials: Record<1 | 2 | 3 | 4 | 5 | 6 | 7, string> = {
    1: 'L',
    2: 'M',
    3: 'X',
    4: 'J',
    5: 'V',
    6: 'S',
    7: 'D'
};

const getDayName = (day: number): string => {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return days[day % 7];
};

export default function SchedulesTable({ 
    schedules, 
    onEdit = () => {}, 
    onDelete = () => {} 
}: SchedulesTableProps) {
    return (
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
                                    onClick={() => onEdit(schedule)}
                                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => schedule.id !== null && onDelete(schedule.id)}
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
    );
}
