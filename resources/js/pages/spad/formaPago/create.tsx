import AppLayout from '@/layouts/app-layout';
import { useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

export default function FormaPagoCreate() {
  const { data, setData, post, processing, errors } = useForm({
    nombre_forma_pago: '',
    descripcion: '',
    nombre_corto: '',
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    post(route('spad.storeformapago'));
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-2xl p-4">
        <div className="rounded-lg border border-amber-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-amber-700">Crear forma de pago</h1>
            <a
              href={route('spad.indexformapago')}
              className="rounded-md border border-amber-600 bg-white px-4 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-50"
            >
              Volver
            </a>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Nombre</label>
              <input
                value={data.nombre_forma_pago}
                onChange={(e) => setData('nombre_forma_pago', e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-amber-600 px-3 py-2 text-amber-900 focus:border-amber-500 focus:outline-none"
              />
              {errors.nombre_forma_pago && <p className="mt-1 text-sm text-red-500">{errors.nombre_forma_pago}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Nombre corto</label>
              <input
                value={data.nombre_corto}
                onChange={(e) => setData('nombre_corto', e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-amber-600 px-3 py-2 text-amber-900 focus:border-amber-500 focus:outline-none"
              />
              {errors.nombre_corto && <p className="mt-1 text-sm text-red-500">{errors.nombre_corto}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Descripción</label>
              <textarea
                value={data.descripcion}
                onChange={(e) => setData('descripcion', e.target.value)}
                rows={4}
                className="w-full rounded-md border border-gray-300 bg-amber-600 px-3 py-2 text-gray-900 focus:border-amber-500 focus:outline-none"
              />
              {errors.descripcion && <p className="mt-1 text-sm text-red-500">{errors.descripcion}</p>}
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
