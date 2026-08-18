import AppLayout from '@/layouts/app-layout';
import { useForm, usePage } from '@inertiajs/react';
import { useMemo } from 'react';
import type { FormEvent } from 'react';

interface FormaPagoOption {
  id: number;
  nombre_forma_pago: string;
  nombre_corto?: string | null;
}

interface PagoFormItem {
  forma_pago_id: number;
  monto: string;
}

interface PagoRegistro {
  id: number;
  forma_pago_id: number|string;
  monto: number|string;
  forma_pago_nombre?: string;
}

export default function TotalServicioPagosPage() {
  const { totalServicio, formasPago, pagos } = usePage<{
    totalServicio: {
      id: number;
      nro_factura: string;
      total: number;
      cliente_name?: string;
      empleado_id?: number;
    };
    formasPago: FormaPagoOption[];
    pagos: PagoRegistro[];
  }>().props;

  const { data, setData, post, processing, errors } = useForm({
    empleado_id: totalServicio.empleado_id ?? '',
    pagos: pagos.length > 0
      ? pagos.map((pago) => ({
          forma_pago_id: pago.forma_pago_id,
          monto: String(pago.monto),
        }))
      : [{ forma_pago_id: '', monto: '' }],
  });

  const totalPagado = useMemo(() =>
    data.pagos.reduce((sum, item) => sum + Number(item.monto || 0), 0),
    [data.pagos],
  );

  const addPago = () => {
    setData('pagos', [...data.pagos, { forma_pago_id: '', monto: '' }]);
  };

  const removePago = (index: number) => {
    const next = data.pagos.filter((_, i) => i !== index);
    setData('pagos', next.length ? next : [{ forma_pago_id: '', monto: '' }]);
  };

  const updatePago = (index: number, field: keyof PagoFormItem, value: string) => {
    const next = [...data.pagos];
    next[index] = { ...next[index], [field]: value };
    setData('pagos', next);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    post(route('total-servicio.pagos.store', { totalServicio: totalServicio.id }));
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl p-4">
        <div className="mb-4 rounded-lg border border-emerald-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-emerald-700">Pagos del servicio</h1>
              <p className="text-sm text-gray-600">Factura: {totalServicio.nro_factura}</p>
            </div>
            <a
              href={route('registro-servicio.index')}
              className="rounded-md border border-emerald-600 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
            >
              Volver
            </a>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-md bg-emerald-50 p-3">
              <p className="text-xs uppercase tracking-wide text-emerald-700">Cliente</p>
              <p className="mt-1 font-medium text-emerald-900">{totalServicio.cliente_name ?? '-'}</p>
            </div>
            <div className="rounded-md bg-emerald-50 p-3">
              <p className="text-xs uppercase tracking-wide text-emerald-700">Total</p>
              <p className="mt-1 font-medium text-emerald-900">{Number(totalServicio.total).toFixed(2)}</p>
            </div>
            <div className="rounded-md bg-emerald-50 p-3">
              <p className="text-xs uppercase tracking-wide text-emerald-700">Pagado</p>
              <p className="mt-1 font-medium text-emerald-900">{Number(totalPagado).toFixed(2)}</p>
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="rounded-lg border border-emerald-200 bg-white p-4 shadow-sm">
          {errors.pagos && (
            <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {errors.pagos}
            </div>
          )}

          <div className="space-y-4">
            {data.pagos.map((pago, index) => (
              <div key={index} className="grid gap-3 rounded-md border border-emerald-100 bg-emerald-50 p-3 md:grid-cols-[1fr_180px_auto]">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Forma de pago</label>
                  <select
                    value={pago.forma_pago_id}
                    onChange={(e) => updatePago(index, 'forma_pago_id', e.target.value)}
                    className="w-full rounded-md border border-emerald-300 bg-amber-600 px-3 py-2 text-sm text-gray-900"
                  >
                    <option value="">Seleccione</option>
                    {formasPago.map((forma) => (
                      <option key={forma.id} value={forma.id}>
                        {forma.nombre_forma_pago} {forma.nombre_corto ? `(${forma.nombre_corto})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Monto</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={pago.monto}
                    onChange={(e) => updatePago(index, 'monto', e.target.value)}
                    className="w-full rounded-md border border-emerald-300 bg-amber-600 px-3 py-2 text-sm text-gray-900"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => removePago(index)}
                    className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
                  >
                    Quitar
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <button
              type="button"
              onClick={addPago}
              className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Agregar forma de pago
            </button>

            <div className="text-sm font-medium text-gray-700">
              Diferencia: <span className="font-bold text-emerald-800">{(Number(totalServicio.total) - totalPagado).toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={processing}
              className="rounded-md bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {processing ? 'Guardando...' : 'Guardar pagos'}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
