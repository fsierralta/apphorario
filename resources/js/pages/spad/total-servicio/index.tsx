import AppLayout from '@/layouts/app-layout';
import { Link, router, usePage } from '@inertiajs/react';
import type { BreadcrumbItem, PageProps, PaginationLink } from '@/types';
import { useState } from 'react';

interface TotalServicioItem {
    id: number;
    nro_factura: string;
    total: string;
    fecha: string;
    nombre: string;
    apellido: string;
    cliente_name: string;
    empleado_id: number;
    totalServiciosCount?: number;
}

interface TotalServicioPaginated {
    data: TotalServicioItem[];
    links: PaginationLink[];
}

export default function TotalServicioIndex() {
    const { totalServicios, fechaInicio: initialFechaInicio, fechaFin: initialFechaFin, totalServiciosCount } = usePage<PageProps<{ totalServicios: TotalServicioPaginated; fechaInicio?: string; fechaFin?: string; totalServiciosCount?: number }>>().props;
    const [fechaInicio, setFechaInicio] = useState<string>(initialFechaInicio ?? new Date().toISOString().split('T')[0]);
    const [fechaFin, setFechaFin] = useState<string>(initialFechaFin ?? new Date().toISOString().split('T')[0]);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Total de Servicios', href: '#' },
    ];

    const aplicarFiltro = () => {
        router.get(
            route('registro-servicio.index'),
            { fecha_inicio: fechaInicio, fecha_fin: fechaFin },
            { preserveState: true, preserveScroll: true },
        );
    };
    
    const limpiarFiltro = () => {
        const hoy = new Date().toISOString().split('T')[0];
        setFechaInicio(hoy);
        setFechaFin(hoy);

        router.get(route('registro-servicio.index'), {
            fecha_inicio: hoy,
            fecha_fin: hoy,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="p-4">
                <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <h1 className="text-2xl font-bold text-amber-700">Total de Servicios</h1>
                    <Link
                        href={route('registro-servicio.create')}
                        className="inline-flex items-center rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
                    >
                        Servicios
                    </Link>
                </div>

                <div className="mb-4 grid gap-3 rounded-lg border border-amber-200 bg-white p-4 md:grid-cols-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-amber-900">Fecha inicio</label>
                        <input
                            type="date"
                            value={fechaInicio}
                            onChange={(e) => setFechaInicio(e.target.value)}
                            className="w-full rounded-md border border-amber-300 bg-amber-600 px-3 py-2 text-sm text-amber-900 focus:border-amber-500 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-amber-900">Fecha fin</label>
                        <input
                            type="date"
                            value={fechaFin}
                            onChange={(e) => setFechaFin(e.target.value)}
                            className="w-full rounded-md border border-amber-300 bg-amber-600 px-3 py-2 text-sm text-amber-900 focus:border-amber-500 focus:outline-none"
                        />
                    </div>
                    <div className="flex items-end gap-2">
                        <button
                            type="button"
                            onClick={aplicarFiltro}
                            className="inline-flex h-10 items-center justify-center rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
                        >
                            Filtrar
                        </button>
                        <button
                            type="button"
                            onClick={limpiarFiltro}
                            className="inline-flex h-10 items-center justify-center rounded-md border border-amber-300 bg-amber-600 px-4 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-700"
                        >
                            Limpiar
                        </button>
                    </div>
                </div>

                <div className="overflow-hidden rounded-lg border border-amber-200 bg-amber-500 shadow-sm">
                    <table className="min-w-full divide-y divide-amber-100">
                        <thead className="bg-amber-100">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-amber-900">ID</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-amber-900">Empleado</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-amber-900">Cliente</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-amber-900">Total</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-amber-900">Factura</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-amber-900">Monto</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-amber-900">Fecha</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-amber-900">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {totalServicios.data.map((item: TotalServicioItem) => (
                                <tr key={item.id} className="hover:bg-amber-500">
                                    <td className="px-4 py-3 text-sm">{item.id}</td>
                                    <td className="px-4 py-3 text-sm">{`${item.nombre} ${item.apellido}`}</td>
                                    <td className="px-4 py-3 text-sm">{item.cliente_name} </td>
                                    <td className="px-4 py-3 text-sm font-semibold text-amber-900">{item.total ?? '-'}</td>
                                    <td className="px-4 py-3 text-sm font-semibold text-amber-900">{item.nro_factura ?? '-'}</td>
                                    <td className="px-4 py-3 text-sm font-semibold text-amber-900">{item.total ?? '-'}</td>
                                    <td className="px-4 py-3 text-sm">{new Date(item.fecha).toLocaleDateString()}</td>
                                    <td className="px-4 py-3 text-sm">
                                        <Link
                                            href={route('registro-servicio.detail', { totalServicio: item.id })}
                                            className="rounded bg-amber-300 px-3 py-1.5 text-white hover:bg-amber-400"
                                        >
                                            Detalle
                                        </Link>
                                        <Link
                                            href={route('registro-servicio.create',{cliente_id: item.id,empleado_id: item.empleado_id})}
                                            className=" ml-4 inline-flex items-center rounded-md bg-amber-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-amber-700"
                                        >
                                            Servicios
                                        </Link>
                                        <Link
                                            href={route('total-servicio.pagos.index', { totalServicio: item.id })}
                                            className="ml-2 inline-flex items-center rounded-md bg-emerald-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700"
                                        >
                                            Pagos
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-amber-100">
                            <tr>
                                <td colSpan={3} className="px-4 py-3 text-left text-sm font-semibold text-amber-900">Total Servicios:</td>
                                <td colSpan={5} className="px-4 py-3 text-left text-sm font-semibold text-amber-900">{totalServiciosCount?.toFixed(2)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {totalServicios.links.length > 0 && (
                    <div className="mt-4 flex justify-center">
                        <nav className="flex gap-2">
                            {totalServicios.links.map((link: PaginationLink, index: number) => (
                                <Link
                                    key={`${link.label}-${index}`}
                                    href={link.url || '#'}
                                    className={`rounded px-3 py-1 ${link.active ? 'bg-amber-600 text-white' : 'bg-white text-amber-700 hover:bg-amber-100'}`}
                                >
                                    <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                </Link>
                            ))}
                        </nav>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
