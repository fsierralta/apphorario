import AppLayout from '@/layouts/app-layout';
import { Link, usePage } from '@inertiajs/react';
import type { BreadcrumbItem, PageProps } from '@/types';

interface RegistroServicioDetalle {
  id: number;
  total_servicio_id: number;
  cliente_name: string;
  servicio_name: string;
  cantidad: number;
  precio: number | string;
  fecha_servicio: string;
  nro_factura?: string;
}

export default function RegistroServicioDetail() {
  const { registroServicios } = usePage<PageProps<{ registroServicios: RegistroServicioDetalle[] }>>().props;

  const total = registroServicios.reduce((sum: number, item: RegistroServicioDetalle) => sum + Number(item.cantidad || 0) * Number(item.precio || 0), 0);
  const factura = registroServicios[0]?.nro_factura ?? 'Sin factura';

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Registro de Servicios', href: route('registro-servicio.index') },
    { title: 'Detalle', href: '#' },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="p-4">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-amber-700">Detalle del registro</h1>
            <p className="mt-1 text-sm text-gray-600">Factura: {factura}</p>
          </div>

          <Link
            href={route('registro-servicio.index')}
            className="inline-flex items-center justify-center rounded-md border border-amber-600 bg-white px-4 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-50"
          >
            ← Volver
          </Link>
        </div>

        {registroServicios.length === 0 ? (
          <div className="rounded-lg border border-dashed border-amber-300 bg-amber-50 p-8 text-center">
            <p className="text-lg font-medium text-amber-800">No hay registros para este servicio.</p>
            <Link
              href={route('registro-servicio.index')}
              className="mt-4 inline-flex rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
            >
              Regresar a la vista anterior
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-amber-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-amber-100">
                <thead className="bg-amber-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-amber-900">ID</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-amber-900">Cliente</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-amber-900">Servicio</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-amber-900">Cantidad</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-amber-900">Precio</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-amber-900">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {registroServicios.map((item: RegistroServicioDetalle) => (
                    <tr key={item.id} className="hover:bg-amber-50">
                      <td className="px-4 py-3 text-sm text-gray-700">{item.id}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{item.cliente_name}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{item.servicio_name}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{item.cantidad}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-amber-900">
                        {Number(item.precio).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {new Date(item.fecha_servicio).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t border-amber-200 bg-amber-50 px-4 py-3">
              <span className="text-sm font-medium text-amber-900">Total general</span>
              <span className="text-lg font-bold text-amber-900">{total.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
