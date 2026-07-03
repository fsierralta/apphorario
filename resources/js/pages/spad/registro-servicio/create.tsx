import AppLayout from '@/layouts/app-layout';
import { router, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
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

interface ItemServicio {
  servicio_id: string;
  cantidad: string;
  precio: string;
}

export default function RegistroServicioCreate() {
  const { servicios, clientes, cliente_id } = usePage<PageProps<{ servicios: ServicioOption[]; clientes: ClienteOption[]; cliente_id?: string; empleado_id?: string }>>().props;

  const clienteSeleccionado = clientes.find((cliente: ClienteOption) => String(cliente.id) === String(cliente_id));

  const [items, setItems] = useState<ItemServicio[]>([{ servicio_id: '', cantidad: '1', precio: '' }]);
  const [fecha_servicio, setFechaServicio] = useState(new Date().toISOString().split('T')[0]); // Fecha actual en formato YYYY-MM-DD

  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Registro de Servicios', href: route('registro-servicio.index') },
    { title: 'Crear', href: '#' },
  ];

  const total = useMemo(() => {
    return items.reduce((acc, item) => {
      const precio = Number(item.precio || 0);
      const cantidad = Number(item.cantidad || 0);
      return acc + precio * cantidad;
    }, 0);
  }, [items]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    setProcessing(true);
    setErrors({});

    const formData = new FormData();
    formData.append('cliente_id', cliente_id ? String(cliente_id) : '');
    formData.append('fecha_servicio', fecha_servicio);

    items.forEach((item, index) => {
      formData.append(`items[${index}][servicio_id]`, item.servicio_id);
      formData.append(`items[${index}][cantidad]`, item.cantidad);
      formData.append(`items[${index}][precio]`, item.precio);
    });

    router.post(route('registro-servicio.store'), formData, {
      onFinish: () => setProcessing(false),
      onError: (errorsResponse: Record<string, string>) => setErrors(errorsResponse),
      onSuccess: () => {
        setProcessing(false);
      },
    });
  };

  const handleServicioChange = (index: number, value: string) => {
    const updated = [...items];
    updated[index].servicio_id = value;

    const servicioSeleccionado = servicios.find((servicio: ServicioOption) => String(servicio.id) === value);
    updated[index].precio = servicioSeleccionado ? String(servicioSeleccionado.precio) : '';
    setItems(updated);
  };

  const addItem = () => {
    setItems([...items, { servicio_id: '', cantidad: '1', precio: '' }]);
  };

  const removeItem = (index: number) => {
    if (items.length === 1) {
      setItems([{ servicio_id: '', cantidad: '1', precio: '' }]);
      return;
    }

    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof ItemServicio, value: string) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="mx-auto max-w-5xl p-4">
        <div className="rounded-lg border border-amber-200 bg-white p-6 shadow-sm">
          <h1 className="mb-4 text-2xl font-bold text-amber-700">Crear registro de servicio</h1>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Cliente</label>
              <div className="w-full rounded-md border border-gray-700 bg-gray-50 px-3 py-2 text-gray-900 shadow-sm">
                {clienteSeleccionado ? `${clienteSeleccionado.nombre} ${clienteSeleccionado.apellido}` : 'No se encontró el cliente'}
              </div>
              <input type="hidden" value={cliente_id ? String(cliente_id) : ''} name="cliente_id" />
              {errors.cliente_id && <p className="mt-1 text-sm text-red-500">{errors.cliente_id}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Fecha</label>
              <input
                type="date"
                value={fecha_servicio}
                onChange={(e) => setFechaServicio(e.target.value)}
                className="w-full rounded-md border border-gray-700 bg-amber-500 px-3 py-2 text-gray-900 shadow-sm focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
              {errors.fecha_servicio && <p className="mt-1 text-sm text-red-500">{errors.fecha_servicio}</p>}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">Servicios</h2>
                <button
                  type="button"
                  onClick={addItem}
                  className="rounded-md bg-amber-600 px-3 py-2 text-sm font-semibold text-white hover:bg-amber-700"
                >
                  + Agregar servicio
                </button>
              </div>

              {items.map((item, index) => (
                <div key={index} className="rounded-lg border border-gray-200 bg-amber-50 p-4">
                  <div className="grid gap-4 md:grid-cols-[2fr_1fr_1fr_auto]">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Servicio</label>
                      <select
                        value={item.servicio_id}
                        onChange={(e) => handleServicioChange(index, e.target.value)}
                        className="w-full rounded-md border border-gray-700 
                        bg-amber-500 
                        px-3 py-2 text-gray-900 shadow-sm focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-300"
                      >
                        <option value="">Seleccione un servicio</option>
                        {servicios.map((servicio: ServicioOption) => (
                          <option key={servicio.id} value={servicio.id}>
                            {servicio.nombre_servicio}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Cantidad</label>
                      <input
                        type="number"
                        min="1"
                        value={item.cantidad}
                        onChange={(e) => updateItem(index, 'cantidad', e.target.value)}
                        className="w-full rounded-md border border-gray-700 bg-amber-500 px-3 py-2 text-gray-900 shadow-sm focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-300"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Precio</label>
                      <input
                        type="number"
                        step="0.01"
                        min="1"
                        value={item.precio}
                        onChange={(e) => updateItem(index, 'precio', e.target.value)}
                        className="w-full rounded-md border border-gray-700 bg-amber-500 px-3 py-2 text-white shadow-sm focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-300"
                      />
                    </div>

                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="rounded-md border border-red-300 bg-red-500 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-600"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-lg border border-amber-300 bg-amber-100 p-4 text-right text-lg font-semibold text-amber-900">
              Total: {total.toFixed(2)}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={processing}
                className="rounded-md bg-amber-600 px-4 py-2 text-white hover:bg-amber-700 disabled:opacity-50"
              >
                {processing ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
