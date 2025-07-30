import  { FormEventHandler } from 'react';
import { useForm,usePage } from '@inertiajs/react';

import { BreadcrumbItem, Horario } from '@/types';

interface Props{
    schedule:Horario|null;
    onClose:()=>void
}
type Day = {
    day_of_week: number;
    is_working_day: boolean;
};

type ScheduleFormData = {
    name: string;
    start_time: string;
    end_time: string;
    has_break: boolean;
    break_start: string;
    break_end: string;
    tolerance_minutes: number;
    days: Day[];
};

export default function ScheduleForm({ schedule, onClose }: Props) {
    const { data, setData, post, put, processing, errors } = useForm<ScheduleFormData>({
        name: schedule?.name || '',
        start_time: schedule?.start_time || '08:00',
        end_time: schedule?.end_time || '17:00',
        has_break: schedule?.has_break || false,
        break_start: schedule?.break_start || '12:00',
        break_end: schedule?.break_end || '13:00',
        tolerance_minutes: schedule?.tolerance_minutes || 15,
        days: schedule?.days || Array(7).fill(null).map((_, i) => ({
            day_of_week: i + 1,
            is_working_day: i < 5 // Por defecto L-V laborables
        }))
    });
  
    const handleSubmit:FormEventHandler = (e) => {
        e.preventDefault();
        
        if (schedule) {
            put(route('schedules.update', { id: schedule.id }), {
                onSuccess: () => onClose(),
            });
        } else {
            post(route('schedules.store'), {
                onSuccess: () => onClose(),
            });
        }
    };

    const toggleDay = (index:number) => {
        const newDays = [...data.days];
        newDays[index] = {
            ...newDays[index],
            is_working_day: !newDays[index].is_working_day
        };
        setData('days', newDays);
    };

    return (
      
            <div className="fixed inset-0   flex items-center justify-center p-4 z-50">
            <div className="bg-blue-400 rounded-lg shadow-xl w-full max-w-2xl">
                <div className="p-6  rounded-md">
                    <h2 className="text-xl font-bold mb-4">
                        {schedule ? 'Editar Horario' : 'Crear Nuevo Horario'}
                    </h2>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Nombre del Horario
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                 className="mt-1 block w-full rounded-md
                                  border-gray-300 shadow-sm
                                   focus:border-indigo-500 focus:ring-indigo-500"
                                /> 
                               {errors.name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Tolerancia (minutos)
                                </label>
                                <input
                                    type="number"
                                    value={data.tolerance_minutes}
                                    onChange={e => setData('tolerance_minutes', Number(e.target.value))}
                                    className="mt-1 block w-full rounded-md
                                       text-black
                                     border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                                {errors.tolerance_minutes && (
                                    <p className="mt-1 text-sm text-red-600">{errors.tolerance_minutes}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Hora de Entrada
                                </label>
                                <input
                                    type="time"
                                    value={data.start_time}
                                    onChange={e => setData('start_time', e.target.value)}
                                    className="mt-1 block 
                                       text-black
                                    w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                                {errors.start_time && (
                                    <p className="mt-1 text-sm text-red-600">{errors.start_time}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Hora de Salida
                                </label>
                                <input
                                    type="time"
                                    value={data.end_time}
                                    onChange={e => setData('end_time', e.target.value)}
                                    className="mt-1 block w-full 
                                     text-black
                                    rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                                {errors.end_time && (
                                    <p className="mt-1 text-sm text-red-600">{errors.end_time}</p>
                                )}
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="flex items-center">
                                <input
                                    id="has_break"
                                    type="checkbox"
                                    checked={data.has_break}
                                    onChange={e => setData('has_break', e.target.checked)}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label htmlFor="has_break" className="ml-2 block text-sm text-gray-900">
                                    Incluir tiempo de descanso
                                </label>
                            </div>
                        </div>

                        {data.has_break && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Inicio Descanso
                                    </label>
                                    <input
                                        type="time"
                                        value={data.break_start}
                                        onChange={e => setData('break_start', e.target.value)}
                                        className="mt-1 block w-full
                                            text-black
                                         rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                    {errors.break_start && (
                                        <p className="mt-1 text-sm text-red-600">{errors.break_start}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Fin Descanso
                                    </label>
                                    <input
                                        type="time"
                                        value={data.break_end}
                                        onChange={e => setData('break_end', e.target.value)}
                                        className="mt-1 block w-full
                                         text-black
                                         rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                    {errors.break_end && (
                                        <p className="mt-1 text-sm text-red-600">{errors.break_end}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Días Laborales
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {data.days.map((day, index) => (
                                    <button
                                        key={day.day_of_week}
                                        type="button"
                                        onClick={() => toggleDay(index)}
                                        className={`px-4 py-2 rounded-md ${
                                            day.is_working_day
                                                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                    >
                                        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'][day.day_of_week - 1]}
                                    </button>
                                ))}
                            </div>
                            {errors.days && (
                                <p className="mt-1 text-sm text-red-600">{errors.days}</p>
                            )}
                        </div>

                        <div className="flex justify-end space-x-3 gap-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 rounded-md  text-black font-bold hover:bg-gray-50"
                            >
                                Cancelar 
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {processing ? 'Guardando...' : 'Guardar Horario'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            </div>
    
    );
    
}