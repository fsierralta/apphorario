import AppLayout from '@/layouts/app-layout';
import { Link, router, usePage } from '@inertiajs/react';
import type { BreadcrumbItem, PageProps, PaginationLink } from '@/types';
import { useState } from 'react';

interface RegistroServicioItem {
    id: number;
    fecha_servicio: string;
    cantidad: number;
    precio: number;
    servicio?: { id: number; nombre_servicio: string };
    cliente?: { id: number; nombre: string; apellido: string };
    total_servicio?: {
        id: number;
        nro_factura: string;
        total: string;
        empleado?: { id: number; nombre: string; apellido: string };
    };
}

interface RegistroServicioPaginated {
    data: RegistroServicioItem[];
    links: PaginationLink[];
}

export default function RegistroServicioIndex() {
    const { registroServicios, fechaInicio: initialFechaInicio, fechaFin: initialFechaFin } = usePage<PageProps<{ registroServicios: RegistroServicioPaginated; fechaInicio?: string; fechaFin?: string }>>().props;
    const [fechaInicio, setFechaInicio] = useState<string>(initialFechaInicio ?? new Date().toISOString().split('T')[0]);
    const [fechaFin, setFechaFin] = useState<string>(initialFechaFin ?? new Date().toISOString().split('T')[0]);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Registro de Servicios', href: '#' },
    ];

    const handleDelete = (id: number) => {
        if (window.confirm('¿Desea eliminar este registro?')) {
            router.delete(route('registro-servicio.destroy', { registroServicio: id }));
        }
    };

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
            <h1 className="text-2xl font-bold text-amber-700">Registro de Servicios</h1>
            <Link
              href={route('registro-servicio.create')}
              className="inline-flex items-center rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
            >
              Crear registro
            </Link>
          </div>

          <div className="mb-4 grid gap-3 rounded-lg border border-amber-200 bg-white p-4 md:grid-cols-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-amber-900">Fecha inicio</label>
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="w-full rounded-md border border-amber-300 bg-white px-3 py-2 text-sm text-amber-900 focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-amber-900">Fecha fin</label>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="w-full rounded-md border border-amber-300 bg-white px-3 py-2 text-sm text-amber-900 focus:border-amber-500 focus:outline-none"
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
                className="inline-flex h-10 items-center justify-center rounded-md border border-amber-300 bg-white px-4 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-50"
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
                  <th className="px-4 py-3 text-left text-sm font-semibold text-amber-900">Servicio</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-amber-900">Cliente</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-amber-900">Empleado</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-amber-900">Total</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-amber-900">Factura</th>
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
                    <td className="px-4 py-3 text-sm">{item.total_servicio?.empleado ? `${item.total_servicio.empleado.nombre} ${item.total_servicio.empleado.apellido}` : '-'}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-amber-900">{item.total_servicio?.total ?? '-'}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-amber-900">{item.total_servicio?.nro_factura ?? '-'}</td>
                    <td className="px-4 py-3 text-sm">{new Date(item.fecha_servicio).toLocaleDateString()}</td>
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
                        <Link
                          href={route('registro-servicio.detail', { totalServicio: item.total_servicio?.id })}
                          className="rounded bg-amber-300 px-3 py-1.5 text-white hover:bg-amber-400"
                        >
                          Detalle
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
