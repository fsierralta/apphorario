import Pagination from "@/components/pagination/pagination";
import AppLayout from "@/layouts/app-layout";
import { router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { FaSignInAlt, FaSignOutAlt, FaCoffee, FaArrowRight } from "react-icons/fa";

//import route from 'ziggy-js';

// --- Tipos -----------------------------------------------------------------
interface Link {
    url: string | null;
    label: string;
    active: boolean;
}

interface ScheduleDay {
    id: number;
    day_of_week: number;
    is_working_day: boolean;
    created_at: string;
    updated_at: string;
}

interface Schedule {
    id: number;
    name: string;
    start_time: string;
    end_time: string;
    has_break: boolean;
    break_start: string | null;
    break_end: string | null;
    is_flexible: boolean;
    tolerance_minutes: number;
    pivot: {
        empleado_id: number;
        schedule_id: number;
        start_date: string;
        end_date: string | null;
        is_active: boolean;
        created_at: string;
        updated_at: string;
    };
    days: ScheduleDay[];
}

export interface Empleado {
    id: number;
    nombre: string;
    apellido: string;
    cedula: string;
    registro_entradas: Array<{
        id: number;
        registro_fecha: string;
        registro_hora: string;
        evento: number;
        tipo:string
    }>;
    schedules: Array<{
        id: number;
        nombre: string;
        pivot: {
            start_date: string;
            end_date: string | null;
            is_active: boolean;
        };
        days: Array<{
            id: number;
            day_name: string;
            start_time: string;
            end_time: string;
        }>;
    }>;
};

const tipoIcono = {
    entrada: <FaSignInAlt className="inline mr-1 text-green-600" title="Entrada" />,
    salida: <FaSignOutAlt className="inline mr-1 text-red-600" title="Salida" />,
    descanso: <FaCoffee className="inline mr-1 text-yellow-600" title="Descanso" />,
    regreso_descanso: <FaArrowRight className="inline mr-1 text-blue-600" title="Regreso de Descanso" />,
};

export default function Asistencia({ empleados,fechai,fechaf }: { empleados: Empleado[]; fechai: string; fechaf: string; }) {
    const [fechaInicio, setFechaInicio] = useState<string>(fechai );
    const [fechaFin, setFechaFin] = useState<string>(fechaf);
    const [empleadoId, setEmpleadoId] = useState<number>(0);
    const [cargando, setCargando] = useState<boolean>(false);
    const [datos, setDatos] = useState<Empleado[]>([]);
    console.log(empleados);
    
    useEffect(() => {
        setDatos(empleados);
    }, [empleados]);

    const buscarAsistencias = () => {
        setCargando(true);
        console.log(fechaInicio, fechaFin, empleadoId);
        
        router.get(
            route('asistencia.index', { fechai: fechaInicio, fechaf: fechaFin, empleado_id: empleadoId }),
            {},
            {
                preserveState: true,
                onSuccess: () => setCargando(false),
            }
        );
    };

   

    return (
        <AppLayout  
            breadcrumbs={[
                { title: 'Asistencia', href: route('asistencia.index') },
            ]}
          >
           
        <div className="py-12">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 ">
                <div className="bg-white shadow-sm sm:rounded-lg p-6">
                    <h2 className="text-2xl font-semibold mb-6 text-indigo-700">Control de Asistencia</h2>
                    
                    {/* Filtros */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Fecha Inicio</label>
                            <input
                                type="date"
                                className="mt-1 block w-full rounded-md 
                                border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500
                                 text-gray-900
                                "
                                value={fechaInicio}
                                onChange={(e) => setFechaInicio(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Fecha Fin</label>
                            <input
                                type="date"
                                className="mt-1 block w-full rounded-md border-gray-300
                                 shadow-sm focus:border-indigo-500 focus:ring-indigo-500
                                 text-gray-900"
                                value={fechaFin}
                                onChange={(e) => setFechaFin(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">ID Empleado (0 = Todos)</label>
                            <input
                                type="number"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                                focus:border-indigo-500 focus:ring-indigo-500
                                text-gray-900
                                "
                                value={empleadoId}
                                onChange={(e) => setEmpleadoId(parseInt(e.target.value) || 0)}
                            />
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={buscarAsistencias}
                                disabled={cargando}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
                            >
                                {cargando ? 'Buscando...' : 'Buscar'}
                            </button>
                        </div>
                    </div>

                    {/* Tabla de resultados */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
                            <thead className="bg-indigo-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">Empleado</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">Cédula</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">Horario</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">Asistencias</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {datos.map((empleado) => (
                                    <tr key={empleado.id} className="hover:bg-indigo-50 transition">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-semibold text-gray-900">
                                                {empleado.nombre} {empleado.apellido}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-700">{empleado.cedula}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {empleado.schedules[0] ? (
                                                <div className="text-sm text-indigo-700 font-medium">
                                                    {empleado.schedules[0].nombre}
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-400">Sin horario</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {empleado.registro_entradas.length > 0 ? (
                                                <ul className="space-y-1 max-h-40 overflow-y-auto pr-2">
                                                    {empleado.registro_entradas.map((registro) => (
                                                        <li key={registro.id} className="flex items-center text-sm text-gray-700">
                                                            <span className="mr-2">
                                                                {tipoIcono[registro.tipo as keyof typeof tipoIcono] ?? null}
                                                            </span>
                                                            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded mr-2">
                                                                {registro.registro_fecha}
                                                            </span>
                                                            <span className="font-mono text-xs bg-gray-50 px-2 py-1 rounded mr-2">
                                                                {registro.registro_hora.slice(11, 16)}
                                                            </span>
                                                            <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                                                ${
                                                                    registro.tipo === "entrada"
                                                                        ? "bg-green-100 text-green-800"
                                                                        : registro.tipo === "salida"
                                                                        ? "bg-red-100 text-red-800"
                                                                        : registro.tipo === "descanso"
                                                                        ? "bg-yellow-100 text-yellow-800"
                                                                        : "bg-blue-100 text-blue-800"
                                                                }
                                                            `}>
                                                                {registro.tipo.replace("_", " ")}
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <span className="text-sm text-gray-400">Sin registros</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                    </div>
                </div>
            </div>
        </div>
        </AppLayout>  
    );
}
