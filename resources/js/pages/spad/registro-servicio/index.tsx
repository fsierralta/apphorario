import AppLayout from '@/layouts/app-layout';
import { Link, router, usePage } from '@inertiajs/react';
import type { BreadcrumbItem, PageProps, PaginationLink } from '@/types';

interface RegistroServicioItem {
    id: number;
    fecha_servicio: string;
    cantidad: number;
    precio: number;
    servicio?: { id: number; nombre_servicio: string };
    cliente?: { id: number; nombre: string; apellido: string };
}

interface RegistroServicioPaginated {
    data: RegistroServicioItem[];
    links: PaginationLink[];
}

export default function RegistroServicioIndex() {
    const { registroServicios } = usePage<PageProps<{ registroServicios: RegistroServicioPaginated }>>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Registro de Servicios', href: '#' },
    ];

    const handleDelete = (id: number) => {
        if (window.confirm('¿Desea eliminar este registro?')) {
            router.delete(route('registro-servicio.destroy', { registroServicio: id }));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="p-4">
                <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <h1 className="text-2xl font-bold text-amber-700">Registro de Servicios</h1>
                    <Link
                        href={route('registro-servicio.create')}
                        className="inline-flex items-center rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
                    >
                        Crear registro
                    </Link>
                </div>

                <div className="overflow-hidden rounded-lg border border-amber-200 bg-amber-500 shadow-sm">
                    <table className="min-w-full divide-y divide-amber-100">
                        <thead className="bg-amber-100">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-amber-900">ID</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-amber-900">Servicio</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-amber-900">Cliente</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-amber-900">Fecha</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-amber-900">Cantidad</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-amber-900">Precio</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-amber-900">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {registroServicios.data.map((item: RegistroServicioItem) => (
                                <tr key={item.id} className="hover:bg-amber-500">
                                    <td className="px-4 py-3 text-sm">{item.id}</td>
                                    <td className="px-4 py-3 text-sm">{item.servicio?.nombre_servicio ?? '-'}</td>
                                    <td className="px-4 py-3 text-sm">{item.cliente ? `${item.cliente.nombre} ${item.cliente.apellido}` : '-'}</td>
                                    <td className="px-4 py-3 text-sm">{item.fecha_servicio}</td>
                                    <td className="px-4 py-3 text-sm">{item.cantidad}</td>
                                    <td className="px-4 py-3 text-sm">{item.precio}</td>
                                    <td className="px-4 py-3 text-sm">
                                        <div className="flex gap-2">
                                            <Link
                                                href={route('registro-servicio.edit', { registroServicio: item.id })}
                                                className="rounded bg-amber-500 px-3 py-1.5 text-white hover:bg-amber-600"
                                            >
                                                Editar
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(item.id)}
                                                className="rounded bg-red-500 px-3 py-1.5 text-white hover:bg-red-600"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {registroServicios.links.length > 0 && (
                    <div className="mt-4 flex justify-center">
                        <nav className="flex gap-2">
                            {registroServicios.links.map((link: PaginationLink, index: number) => (
                                <Link
                                    key={`${link.label}-${index}`}
                                    href={link.url || '#'}
                                    className={`rounded px-3 py-1 ${link.active ? 'bg-amber-600 text-white' : 'bg-white text-amber-700 hover:bg-amber-100'}`}
                                    preserveScroll
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
