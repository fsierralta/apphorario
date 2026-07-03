import AppLayout from '@/layouts/app-layout';
import { useForm, usePage } from '@inertiajs/react';
import type { BreadcrumbItem, PageProps } from '@/types';

interface ServicioOption {

  id: number;
  nombre_servicio: string;
  precio: number;
  


}

interface ClienteOption {
  id: number;
  nombre: string;
  apellido: string;
}

interface RegistroServicioData {
  id: number;
  fecha_servicio: string;
  cantidad: number;
  precio: number;
  servicio_id: number;
  cliente_id: number;
}

export default function RegistroServicioEdit() {
  const { registroServicio, servicios, clientes } = usePage<PageProps<{ registroServicio: RegistroServicioData; servicios: ServicioOption[]; clientes: ClienteOption[] }>>().props;

  const { data, setData, put, processing, errors } = useForm({
    servicio_id: String(registroServicio.servicio_id ?? ''),
    cliente_id: String(registroServicio.cliente_id ?? ''),
    fecha_servicio: new Date(registroServicio.fecha_servicio).toISOString().split('T')[0],
    cantidad: String(registroServicio.cantidad ?? 1),
    precio: String(registroServicio.precio ?? 0),
  });

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Registro de Servicios', href: route('registro-servicio.index') },
    { title: 'Editar', href: '#' },
  ];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('registro-servicio.update', { registroServicio: registroServicio.id }));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="mx-auto max-w-3xl p-4">
        <div className="rounded-lg border border-amber-200 bg-white p-6 shadow-sm">
          <h1 className="mb-4 text-2xl font-bold text-amber-700">Editar registro de servicio</h1>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Servicio</label>
              <select
                value={data.servicio_id}
                onChange={(e) => setData('servicio_id', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 bg-amber-500 text-white shadow-sm focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-300"
              >
                <option value="">Seleccione un servicio</option>
                {servicios.map((servicio: ServicioOption) => (
                  <option key={servicio.id} value={servicio.id}>
                    {servicio.nombre_servicio}
                  </option>
                ))}
              </select>
              {errors.servicio_id && <p className="mt-1 text-sm text-red-500">{errors.servicio_id}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Cliente</label>
              <select
                value={data.cliente_id}
                onChange={(e) => setData('cliente_id', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 bg-amber-500 text-white shadow-sm focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-300"
              >
                <option value="">Seleccione un cliente</option>
                {clientes.map((cliente: ClienteOption) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nombre} {cliente.apellido}
                  </option>
                ))}
              </select>
              {errors.cliente_id && <p className="mt-1 text-sm text-red-500">{errors.cliente_id}</p>}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Fecha</label>
                <input
                  type="date"
                  value={data.fecha_servicio}
                  onChange={(e) => setData('fecha_servicio', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 bg-amber-500 text-white shadow-sm focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-300"
                />
                {data.fecha_servicio && !errors.fecha_servicio && (
                  <p className="mt-1 text-sm text-green-500">Fecha válida</p>
                )}
                {errors.fecha_servicio && <p className="mt-1 text-sm text-red-500">{errors.fecha_servicio}</p>}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Cantidad</label>
                <input
                  type="number"
                  min="1"
                  value={data.cantidad}
                  onChange={(e) => setData('cantidad', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 bg-amber-500 text-white shadow-sm focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-300"
                />
                {errors.cantidad && <p className="mt-1 text-sm text-red-500">{errors.cantidad}</p>}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Precio</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={data.precio}
                onChange={(e) => setData('precio', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 bg-amber-500 text-white shadow-sm focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
              {errors.precio && <p className="mt-1 text-sm text-red-500">{errors.precio}</p>}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={processing}
                className="rounded-md bg-amber-600 px-4 py-2 text-white hover:bg-amber-700 disabled:opacity-50"
              >
                {processing ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
