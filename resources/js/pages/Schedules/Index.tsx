import React, { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import ScheduleForm from './ScheduleForm';
import SchedulesTable from './SchedulesTable';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Horario } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Inicio', href: '/' }
];

interface ScheduleDay {
  day_of_week: number | null;
  is_working_day: boolean | null;
}

interface ArregloHorario {
    schedules: Horario[];
    days: ScheduleDay[] | null;
    [key: string]: unknown;
}

export default function SchedulesIndex() {
    const { schedules } = usePage<ArregloHorario>().props;
    const [editingSchedule, setEditingSchedule] = useState<Horario | null>(null);
    const [showForm, setShowForm] = useState(false);

    const handleDelete = (id: number) => {
        if (confirm('¿Eliminar este horario?')) {
            router.delete(route('schedules.destroy', id));
        }
    };

    const handleEdit = (schedule: Horario) => {
        setEditingSchedule(schedule);
        setShowForm(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestión de Horarios" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl  text-black font-bold">Horarios de Trabajo</h2>
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

                            <SchedulesTable 
                                schedules={schedules}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {showForm && (
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