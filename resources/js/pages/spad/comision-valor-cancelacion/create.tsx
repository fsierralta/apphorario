import AppLayout from '@/layouts/app-layout';
import { useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

interface CreateProps {
  totalServicios: Array<{
    id: number;
    nro_factura?: string;
    fecha?: string;
    empleado_id?: number | null;
    comision_valor?: number;
    comision_restante?: number;
    comision_estado?: string;
    empleado?: { id?: number; nombre?: string; apellido?: string } | null;
  }>;
  empleados: Array<{ id: number; nombre?: string; apellido?: string }>;
  formasPago: Array<{ id: number; nombre_forma_pago: string }>;
}

export default function ComisionValorCancelacionCreate({ totalServicios, empleados, formasPago }: CreateProps) {
  const { data, setData, post, processing, errors } = useForm({
    total_servicio_id: '',
    empleado_id: '',
    forma_pago_id: '',
    monto_cancelado: '',
    motivo: '',
    fecha_cancelacion: new Date().toISOString().slice(0, 10),
    estado: 'pendiente',
  });

  const selectedTotalServicio = totalServicios.find((item) => String(item.id) === String(data.total_servicio_id));
  const comisionRestante = Number(selectedTotalServicio?.comision_restante ?? 0);
  const comisionTotal = Number(selectedTotalServicio?.comision_valor ?? 0);
  const filteredEmpleados = selectedTotalServicio?.empleado_id
    ? empleados.filter((empleado) => Number(empleado.id) === Number(selectedTotalServicio.empleado_id))
    : empleados;

  const handleServicioChange = (value: string) => {
    setData('total_servicio_id', value);

    const servicio = totalServicios.find((item) => String(item.id) === String(value));
    const empleadoId = servicio?.empleado_id ? String(servicio.empleado_id) : '';
    setData('empleado_id', empleadoId);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (comisionRestante <= 0) {
      return;
    }
    post(route('spad.storecomisionvalorcancelacion'));
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-2xl p-4">
        <div className="rounded-lg border border-amber-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-amber-700">Registrar cancelación</h1>
            <a href={route('spad.indexcomisionvalorcancelacion')} className="rounded-md border border-amber-600 bg-white px-4 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-50">
              Volver
            </a>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Servicio total</label>
              <select value={data.total_servicio_id} onChange={(e) => handleServicioChange(e.target.value)} 
                    className="w-full rounded-md border border-gray-300  bg-amber-600 px-3 py-2 focus:border-amber-500 focus:outline-none">
                <option value="">Seleccione...</option>
                {totalServicios.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nro_factura || `Servicio #${item.id}`} ({item.fecha ?? '-'})
                  </option>
                ))}
              </select>
              {errors.total_servicio_id && <p className="mt-1 text-sm text-red-500">{errors.total_servicio_id}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Empleado</label>
              <select
                value={data.empleado_id}
                onChange={(e) => setData('empleado_id', e.target.value)}
                disabled={Boolean(selectedTotalServicio?.empleado_id)}
                className="w-full rounded-md border bg-amber-600 border-gray-300 px-3 py-2 focus:border-amber-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-80"
              >
                <option value="">Seleccione...</option>
                {filteredEmpleados.map((empleado) => (
                  <option key={empleado.id} value={empleado.id}>
                    {empleado.nombre} {empleado.apellido}
                  </option>
                ))}
              </select>
              {selectedTotalServicio?.empleado_id && (
                <p className="mt-1 text-xs text-amber-700">Empleado precargado por el servicio seleccionado.</p>
              )}
              {errors.empleado_id && <p className="mt-1 text-sm text-red-500">{errors.empleado_id}</p>}
            </div>

            {selectedTotalServicio && (
              <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold">Comisión total:</span>
                  <span>{Number(comisionTotal).toFixed(2)}</span>
                </div>
                <div className="mt-1 flex items-center justify-between gap-3">
                  <span className="font-semibold">Saldo restante:</span>
                  <span>{Number(comisionRestante).toFixed(2)}</span>
                </div>
              </div>
            )}

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Forma de pago</label>
              <select value={data.forma_pago_id} onChange={(e) => setData('forma_pago_id', e.target.value)} 
              className="w-full rounded-md border bg-amber-600 border-gray-300 px-3 py-2 focus:border-amber-500 focus:outline-none">
                <option value="">Seleccione...</option>
                {formasPago.map((forma) => (
                  <option key={forma.id} value={forma.id}>{forma.nombre_forma_pago}</option>
                ))}
              </select>
              {errors.forma_pago_id && <p className="mt-1 text-sm text-red-500">{errors.forma_pago_id}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Monto cancelado</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                max={comisionRestante > 0 ? comisionRestante : 0}
                value={data.monto_cancelado}
                onChange={(e) => setData('monto_cancelado', e.target.value)}
                disabled={comisionRestante <= 0}
                className="w-full rounded-md border bg-amber-600 border-gray-300 px-3 py-2 focus:border-amber-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
              />
              {comisionRestante <= 0 && selectedTotalServicio && (
                <p className="mt-1 text-sm text-red-600">No hay comisión restante por cancelar para este servicio.</p>
              )}
              {errors.monto_cancelado && <p className="mt-1 text-sm text-red-500">{errors.monto_cancelado}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Motivo</label>
              <textarea value={data.motivo} onChange={(e) => setData('motivo', e.target.value)} rows={4}
               className="w-full rounded-md border bg-amber-600 border-gray-300 px-3 py-2 focus:border-amber-500 focus:outline-none" />
              {errors.motivo && <p className="mt-1 text-sm text-red-500">{errors.motivo}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Fecha de cancelación</label>
              <input type="date" value={data.fecha_cancelacion} onChange={(e) => setData('fecha_cancelacion', e.target.value)} 
              className="w-full rounded-md border bg-amber-600 border-gray-300 px-3 py-2 focus:border-amber-500 focus:outline-none" />
              {errors.fecha_cancelacion && <p className="mt-1 text-sm text-red-500">{errors.fecha_cancelacion}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Estado</label>
              <select value={data.estado} onChange={(e) => setData('estado', e.target.value)} 
               className="w-full rounded-md border bg-amber-600 border-gray-300 px-3 py-2 focus:border-amber-500 focus:outline-none">
                <option value="pendiente">Pendiente</option>
                <option value="aplicado">Aplicado</option>
                <option value="revertido">Revertido</option>
              </select>
              {errors.estado && <p className="mt-1 text-sm text-red-500">{errors.estado}</p>}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={processing || comisionRestante <= 0}
                className="rounded-md bg-amber-600 px-4 py-2 text-white hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
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
