import { Head, Link, usePage } from '@inertiajs/react';

type PageProps = {
    auth?: {
        user?: unknown;
    };
};

export default function Welcome() {
    const { auth } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Bienvenido - Sistema de Control Horario" />
            <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-amber-100 via-amber-300 to-amber-500 p-6 text-[#1b1b18] dark:bg-[#0a0a0a]">
                <header className="mb-8 w-full max-w-2xl text-center">
                    <h1 className="text-4xl font-extrabold text-amber-900 drop-shadow-lg mb-2">Sistema de Control Horario</h1>
                    <p className="text-lg text-amber-800 font-medium mb-4">
                        Bienvenido al sistema que te ayuda a gestionar y controlar la asistencia, horarios y registros de tus empleados de forma eficiente y segura.
                    </p>
                    <nav className="flex justify-center gap-6 mt-4">
                        {auth?.user ? (
                            <div className=''>
                            <Link
                                href={route('dashboard')}
                                className="rounded bg-amber-700 px-6 py-2 text-white font-semibold shadow hover:bg-amber-800 transition"
                            >
                                Ir al Panel
                            </Link>
                            <Link
                            method='post'
                             href={route('logout')}
                               className="rounded bg-amber-700 px-6 py-2 text-white font-semibold shadow hover:bg-amber-800 transition"
                            >
                               Log
                               out
                            </Link>
                            </div>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="rounded bg-white px-6 py-2 text-amber-900 font-semibold shadow hover:bg-amber-200 transition"
                                >
                                    Iniciar sesión
                                </Link>
                                {/* <Link
                                    href={route('register')}
                                    className="rounded bg-amber-300 px-6 py-2 text-amber-900 font-semibold shadow hover:bg-amber-400 transition"
                                >
                                    Registrarse
                                </Link> */}
                            </>
                        )}
                    </nav>
                </header>
                <main className="flex flex-col items-center justify-center w-full max-w-2xl bg-white/80 rounded-xl shadow-xl p-8">
                    <img
                        src="/images/logo.png"
                        alt="Logo"
                        className="mb-6 w-full max-w-[180px] mx-auto drop-shadow-lg"
                    />
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-amber-900 mb-2">¿Qué puedes hacer?</h2>
                        <ul className="list-disc list-inside text-amber-800 text-lg mb-4">
                            <li>Registrar entradas, salidas y descansos de empleados</li>
                            <li>Consultar reportes de asistencia y horarios</li>
                            <li>Gestionar usuarios y permisos</li>
                            <li>Visualizar estadísticas y exportar datos</li>
                        </ul>
                        <p className="text-sm text-gray-700">
                            Optimiza la gestión de tu equipo y mantén el control de la jornada laboral de manera sencilla y profesional.
                        </p>
                    </div>
                </main>
                <footer className="mt-12 text-center w-full">
                    <hr className="my-4 border-amber-300" />
                    <p className="text-xs text-amber-900 font-semibold">
                        &copy; {new Date().getFullYear()} Freddy Sierralta. Todos los derechos reservados.
                    </p>
                </footer>
            </div>
        </>
    );
}
