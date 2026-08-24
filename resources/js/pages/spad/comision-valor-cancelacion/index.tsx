import AppLayout from '@/layouts/app-layout';
import { Link, router, usePage } from '@inertiajs/react';
import type { PageProps, PaginationLink } from '@/types';
import { useState } from 'react';

interface CancelacionItem {
  id: number;
  total_servicio_id: number;
  empleado?: { nombre?: string; apellido?: string };
  forma_pago?: { nombre_forma_pago?: string };
  monto_cancelado: number;
  motivo?: string | null;
  fecha_cancelacion: string;
  estado: string;
  total_servicio?: {
    id: number;
    nro_factura?: string;
    fecha?: string;
    empleado_id?: number | null;
    comision_valor?: number;
    comision_restante?: number;
    comision_estado?: string;
    empleado?: { id?: number; nombre?: string; apellido?: string } | null;
  };
}

interface PaginatedCancelaciones {
  data: CancelacionItem[];
  links: PaginationLink[];
  first_page_url: string;
}

export default function ComisionValorCancelacionIndex() {
  const {
    cancelaciones,
    totales,
    fechaInicio: initialFechaInicio,
    fechaFin: initialFechaFin,
  } = usePage<PageProps<{
    cancelaciones: PaginatedCancelaciones;
    totales?: { registros?: number; monto_cancelado?: number };
    fechaInicio?: string | null;
    fechaFin?: string | null;
  }>>().props;

  const [search, setSearch] = useState(new URL(cancelaciones.first_page_url).searchParams.get('search') || '');
  const [fechaInicio, setFechaInicio] = useState(initialFechaInicio || '');
  const [fechaFin, setFechaFin] = useState(initialFechaFin || '');

  const aplicarFiltro = () => {
    router.get(
      route('spad.indexcomisionvalorcancelacion'),
      { search, fecha_inicio: fechaInicio, fecha_fin: fechaFin },
      { preserveState: true, preserveScroll: true },
    );
  };

  const limpiarFiltro = () => {
    setFechaInicio('');
    setFechaFin('');
    router.get(
      route('spad.indexcomisionvalorcancelacion'),
      { search: '' },
      { preserveState: true, preserveScroll: true },
    );
  };

  return (
    <AppLayout>
      <div className="p-4">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold text-amber-700">Cancelación de comisiones</h1>
          <Link
            href={route('spad.createcomisionvalorcancelacion')}
            className="inline-flex items-center rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
          >
            Nueva cancelación
          </Link>
        </div>

        <div className="mb-4 grid gap-3 rounded-lg border border-amber-200 bg-white p-4 md:grid-cols-4">
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-amber-900">Buscar</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar cancelación..."
              className="w-full rounded-md border border-amber-300 px-3 py-2 bg-amber-600 text-amber-900 placeholder:text-amber-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-amber-900">Fecha inicio</label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="w-full rounded-md border  bg-amber-600 border-amber-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-amber-900">Fecha fin</label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="w-full rounded-md border  bg-amber-600 border-amber-300 px-3 py-2"
            />
          </div>
        </div>

        <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-end">
          <button
            type="button"
            onClick={() => {
              const params = new URLSearchParams();
              if (fechaInicio) params.set('fecha_inicio', fechaInicio);
              if (fechaFin) params.set('fecha_fin', fechaFin);
              window.open(`${route('spad.reporte.comisionvalorcancelacion')}?${params.toString()}`, '_blank', 'noopener,noreferrer');
            }}
            className="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Reporte PDF aplicado
          </button>
          <button
            type="button"
            onClick={aplicarFiltro}
            className="inline-flex items-center rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600"
          >
            Buscar
          </button>
          <button
            type="button"
            onClick={limpiarFiltro}
            className="inline-flex items-center rounded-md border border-amber-300 bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600"
          >
            Limpiar
          </button>
        </div>

        <div className="mb-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-medium text-amber-800">Registros consultados</p>
            <p className="mt-2 text-2xl font-bold text-amber-900">{totales?.registros ?? cancelaciones.data.length}</p>
          </div>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-medium text-amber-800">Monto total cancelado</p>
            <p className="mt-2 text-2xl font-bold text-amber-900">{Number(totales?.monto_cancelado ?? 0).toFixed(2)}</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-amber-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-amber-100">
            <thead className="bg-amber-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-amber-900">ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-amber-900">Empleado</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-amber-900">Nro Servicio</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-amber-900">Comision Servicio</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-amber-900">Forma pago</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-amber-900">Monto</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-amber-900">Motivo</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-amber-900">Estado</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-amber-900">Acciones</th>

              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {cancelaciones.data.map((item:CancelacionItem) => (
                <tr key={item.id} className="hover:bg-amber-50">
                  <td className="px-4 py-3 text-sm text-gray-700">{item.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {item.empleado ? `${item.empleado.nombre ?? ''} ${item.empleado.apellido ?? ''}`.trim() || '-' : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{item.total_servicio?.nro_factura ?? '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{parseFloat(item.total_servicio?.comision_valor?.toString() ?? '0').toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{item.forma_pago?.nombre_forma_pago ?? '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{Number(item.monto_cancelado).toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{item.motivo || '-'}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800">{item.estado}</span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={route('spad.editcomisionvalorcancelacion', { comisionValorCancelacion: item.id })}
                        className="rounded bg-amber-600 px-3 py-1.5 font-medium text-white hover:bg-amber-700"
                      >
                        Editar
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          const url = route('spad.recibo.comisionvalorcancelacion', { comisionValorCancelacion: item.id });
                          window.open(url, '_blank', 'noopener,noreferrer');
                        }}
                        className="rounded bg-emerald-600 px-3 py-1.5 font-medium text-white hover:bg-emerald-700"
                      >
                        Recibo PDF
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (!confirm('¿Desea eliminar esta cancelación?')) return;
                          router.delete(route('spad.deletecomisionvalorcancelacion', { comisionValorCancelacion: item.id }));
                        }}
                        className="rounded bg-red-600 px-3 py-1.5 font-medium text-white hover:bg-red-700"
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

        {cancelaciones.links.length > 0 && (
          <div className="mt-4 flex justify-center">
            <nav className="flex gap-2">
              {cancelaciones.links.map((link: PaginationLink, index: number) => (
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
