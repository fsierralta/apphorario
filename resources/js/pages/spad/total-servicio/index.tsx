import AppLayout from '@/layouts/app-layout';
import { Link, usePage } from '@inertiajs/react';
import type { BreadcrumbItem, PageProps, PaginationLink } from '@/types';

interface TotalServicioItem {
    id: number;
    nro_factura: string;
    total: string;
    fecha: string;
     nombre: string; 
     apellido: string ;
    cliente_name:string;
}

interface TotalServicioPaginated {
    data: TotalServicioItem[];
    links: PaginationLink[];
}

export default function TotalServicioIndex() {
    const { totalServicios } = usePage<PageProps<{ totalServicios: TotalServicioPaginated }>>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Total de Servicios', href: '#' },
    ];
    console.log(totalServicios);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="p-4">
                <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <h1 className="text-2xl font-bold text-amber-700">Total de Servicios</h1>
                    <Link
                        href={route('registro-servicio.create')}
                            className="inline-flex items-center rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
                        >
                        Crear Total
                    </Link>
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
                                    <td className="px-4 py-3 text-sm">{new Date(item.fecha).toLocaleDateString()}</td>
                                    <td className="px-4 py-3 text-sm">
                                        <Link
                                            href={route('registro-servicio.detail', { totalServicio: item.id })}
                                            className="rounded bg-amber-300 px-3 py-1.5 text-white hover:bg-amber-400"
                                        >
                                            Detalle
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
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
