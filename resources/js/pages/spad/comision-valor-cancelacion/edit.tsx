import AppLayout from '@/layouts/app-layout';
import { useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

interface CancelacionData {
  id: number;
  total_servicio_id: number;
  empleado_id: number;
  forma_pago_id: number;
  monto_cancelado: string | number;
  motivo: string | null;
  fecha_cancelacion: string;
  estado: string;
}

interface EditProps {
  cancelacion: CancelacionData;
  totalServicios: Array<{ id: number; nro_factura?: string; fecha?: string }>; 
  empleados: Array<{ id: number; nombre?: string; apellido?: string }>;
  formasPago: Array<{ id: number; nombre_forma_pago: string }>;
}

export default function ComisionValorCancelacionEdit({ cancelacion, totalServicios, empleados, formasPago }: EditProps) {
  const { data, setData, put, processing, errors } = useForm({
    total_servicio_id: String(cancelacion.total_servicio_id ?? ''),
    empleado_id: String(cancelacion.empleado_id ?? ''),
    forma_pago_id: String(cancelacion.forma_pago_id ?? ''),
    monto_cancelado: String(cancelacion.monto_cancelado ?? ''),
    motivo: cancelacion.motivo ?? '',
    fecha_cancelacion: cancelacion.fecha_cancelacion ?? new Date().toISOString().slice(0, 10),
    estado: cancelacion.estado ?? 'pendiente',
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    put(route('spad.updatecomisionvalorcancelacion', { comisionValorCancelacion: cancelacion.id }));
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-2xl p-4">
        <div className="rounded-lg border border-amber-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-amber-700">Editar cancelación</h1>
            <a href={route('spad.indexcomisionvalorcancelacion')} className="rounded-md border border-amber-600 bg-white px-4 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-50">
              Volver
            </a>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Servicio total</label>
              <select value={data.total_servicio_id} onChange={(e) => setData('total_servicio_id', e.target.value)} 
                className="w-full rounded-md border bg-amber-600 border-amber-300 px-3 py-2 focus:border-amber-500 focus:outline-none">
                <option value="">Seleccione...</option>
                {totalServicios.map((item) => (
                  <option key={item.id} value={item.id}>{item.nro_factura || `Servicio #${item.id}`}</option>
                ))}
              </select>
              {errors.total_servicio_id && <p className="mt-1 text-sm text-red-500">{errors.total_servicio_id}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Empleado</label>
              <select value={data.empleado_id} onChange={(e) => setData('empleado_id', e.target.value)} className="w-full rounded-md border bg-amber-600 border-amber-300 px-3 py-2 focus:border-amber-500 focus:outline-none">
                <option value="">Seleccione...</option>
                {empleados.map((empleado) => (
                  <option key={empleado.id} value={empleado.id}>{empleado.nombre} {empleado.apellido}</option>
                ))}
              </select>
              {errors.empleado_id && <p className="mt-1 text-sm text-red-500">{errors.empleado_id}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Forma de pago</label>
              <select value={data.forma_pago_id} onChange={(e) => setData('forma_pago_id', e.target.value)} className="w-full rounded-md border bg-amber-600 border-amber -300 px-3 py-2 focus:border-amber-500 focus:outline-none">
                <option value="">Seleccione...</option>
                {formasPago.map((forma) => (
                  <option key={forma.id} value={forma.id}>{forma.nombre_forma_pago}</option>
                ))}
              </select>
              {errors.forma_pago_id && <p className="mt-1 text-sm text-red-500">{errors.forma_pago_id}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Monto cancelado</label>
              <input type="number" step="0.01" min="0.01" value={data.monto_cancelado} onChange={(e) => setData('monto_cancelado', e.target.value)}
               className="w-full rounded-md border bg-amber-600 border-amber-300 px-3 py-2 focus:border-amber-500 focus:outline-none" />
              {errors.monto_cancelado && <p className="mt-1 text-sm text-red-500">{errors.monto_cancelado}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Motivo</label>
              <textarea value={data.motivo} onChange={(e) => setData('motivo', e.target.value)} rows={4} className="w-full rounded-md border bg-amber-600 border-amber-300 px-3 py-2 focus:border-amber-500 focus:outline-none" />
              {errors.motivo && <p className="mt-1 text-sm text-red-500">{errors.motivo}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Fecha de cancelación</label>
              <input type="date" value={data.fecha_cancelacion} onChange={(e) => setData('fecha_cancelacion', e.target.value)} className="w-full rounded-md border bg-amber-600 border-amber-300 px-3 py-2 focus:border-amber-500 focus:outline-none" />
              {errors.fecha_cancelacion && <p className="mt-1 text-sm text-red-500">{errors.fecha_cancelacion}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Estado</label>
              <select value={data.estado} onChange={(e) => setData('estado', e.target.value)} className="w-full rounded-md border bg-amber-600 border-amber-300 px-3 py-2 focus:border-amber-500 focus:outline-none">
                <option value="pendiente">Pendiente</option>
                <option value="aplicado">Aplicado</option>
                <option value="revertido">Revertido</option>
              </select>
              {errors.estado && <p className="mt-1 text-sm text-red-500">{errors.estado}</p>}
            </div>

            <div className="flex justify-end">
              <button type="submit" disabled={processing} className="rounded-md bg-amber-600 px-4 py-2 text-white hover:bg-amber-700 disabled:opacity-50">
                {processing ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
