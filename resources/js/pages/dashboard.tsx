import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface PageProps {
    publicExpira?: string|null; // Fecha de expiración de la licencia
    [key: string]: unknown;
}

export default function Dashboard() {
    const {publicExpira } = usePage<PageProps>().props;
   

    // Aquí puedes agregar lógica para obtener estadísticas o datos del usuario

    console.log('Fecha de expiración:', publicExpira);
    return (
        
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Dashboard" />
                <div className="w-full max-w-6xl mx-auto flex flex-col items-center justify-center ">
                    <h1 className="text-4xl font-extrabold text-amber-900 drop-shadow-lg mb-6 text-center">Panel Principal</h1>
                    <p className="text-lg text-amber-800 font-medium mb-8 text-center">
                        Bienvenido al panel de control del sistema de horarios. Aquí puedes gestionar empleados, horarios, asistencia y visualizar reportes.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-8">
                        <div className="bg-white/80 rounded-xl shadow-lg p-6 flex flex-col items-center justify-center hover:shadow-xl transition">
                            <span className="text-amber-700 text-2xl font-bold mb-2">Empleados</span>
                            <p className="text-amber-800 text-center mb-4">Gestiona la información y registros de los empleados.</p>
                            <a href="/empleados" className="bg-amber-300 text-amber-900 font-semibold px-4 py-2 rounded shadow hover:bg-amber-400 transition">Ir a Empleados</a>
                        </div>
                        <div className="bg-white/80 rounded-xl shadow-lg p-6 flex flex-col items-center justify-center hover:shadow-xl transition">
                            <span className="text-amber-700 text-2xl font-bold mb-2">Horarios</span>
                            <p className="text-amber-800 text-center mb-4">Configura y asigna los horarios de trabajo.</p>
                            <a href="/schedules" className="bg-amber-300 text-amber-900 font-semibold px-4 py-2 rounded shadow hover:bg-amber-400 transition">Ir a Horarios</a>
                        </div>
                        <div className="bg-white/80 rounded-xl shadow-lg p-6 flex flex-col items-center justify-center hover:shadow-xl transition">
                            <span className="text-amber-700 text-2xl font-bold mb-2">Asistencia</span>
                            <p className="text-amber-800 text-center mb-4">Consulta y exporta los registros de asistencia.</p>
                            <a href="reportes/asistencia" className="bg-amber-300 text-amber-900 font-semibold px-4 py-2 rounded shadow hover:bg-amber-400 transition">Ir a Asistencia</a>
                        </div>
                    </div>
                    <div className="w-full bg-white/80 rounded-xl shadow-lg p-6 mb-8">
                        <h2 className="text-2xl font-bold text-amber-900 mb-2">Estadísticas rápidas</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-amber-100 rounded-lg p-4 text-center">
                                <span className="text-amber-900 font-bold text-xl">--</span>
                                <p className="text-amber-700">Empleados activos</p>
                            </div>
                            <div className="bg-amber-100 rounded-lg p-4 text-center">
                                <span className="text-amber-900 font-bold text-xl">--</span>
                                <p className="text-amber-700">Horarios asignados</p>
                            </div>
                            <div className="bg-amber-100 rounded-lg p-4 text-center">
                                <span className="text-amber-900 font-bold text-xl">--</span>
                                <p className="text-amber-700">Registros de asistencia</p>
                            </div>
                        </div>
                    </div>
                    <footer className="mt-8 text-center w-full">
                        <hr className="my-4 border-amber-300" />
                        <p className="text-xs text-amber-900 font-semibold">
                            &copy; {new Date().getFullYear()} Freddy Sierralta. Todos los derechos reservados.
                        </p>
                       
                        <p className="text-xs text-amber-900 font-semibold">
                            Fecha de expiración de la licencia: {publicExpira ?  publicExpira : 'No disponible'}
                        </p>
                      
                    </footer>
                </div>
            </AppLayout>
      
    );
}
