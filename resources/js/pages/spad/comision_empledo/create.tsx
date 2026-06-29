import React from "react";
import { useForm, router, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { PageProps } from "@/types";

interface Empleado {
  id: number;
  nombre: string;
  apellido: string;
}

interface Comision {
  id: number;
  comision: string;
  valor: number;
}

interface Props {
  empleados: Empleado[];
  comisiones: Comision[];
}

const ComisionEmpledoCreate: React.FC = () => {
  const { empleados, comisiones } = usePage<PageProps<Props>>().props;

  const { data, setData, post, processing, errors } = useForm({
    empleado_id: "",
    comision_id: "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    post(route("spad.storecomision_empledo"));
  };

  return (
    <AppLayout
      breadcrumbs={[
        { title: "Dashboard", href: "/dashboard" },
        { title: "Comisiones Empleados", href: route("spad.indexcomision_empledo") },
        { title: "Asignar Comisión", href: "#" }
      ]}
    >
      <div className="max-w-2xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-amber-900">Asignar Comisión a Empleado</h1>
          <p className="text-sm text-amber-700 mt-1">Crea una nueva asociación de comisión para un empleado.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-amber-100 p-6 rounded-lg shadow-sm">
          <div className="mb-6">
            <label htmlFor="empleado_id" className="block text-sm font-semibold text-amber-900 mb-2">
              Seleccionar Empleado
            </label>
            <select
              id="empleado_id"
              name="empleado_id"
              value={data.empleado_id}
              onChange={(e) => setData("empleado_id", e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-amber-500 text-amber-900 border border-amber-200 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
            >
              <option value="">-- Selecciona un Empleado --</option>
              {empleados.map((emp: Empleado) => (
                <option key={emp.id} value={emp.id}>
                  {emp.nombre} {emp.apellido} (ID: {emp.id})
                </option>
              ))}
            </select>
            {errors.empleado_id && (
              <p className="mt-1 text-sm text-red-650 font-medium">{errors.empleado_id}</p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="comision_id" className="block text-sm font-semibold text-amber-900 mb-2">
              Seleccionar Comisión
            </label>
            <select
              id="comision_id"
              name="comision_id"
              value={data.comision_id}
              onChange={(e) => setData("comision_id", e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-amber-500 text-amber-900 border border-amber-200 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
            >
              <option value="">-- Selecciona una Comisión --</option>
              {comisiones.map((com: Comision) => (
                <option key={com.id} value={com.id}>
                  {com.comision} ({com.valor}%)
                </option>
              ))}
            </select>
            {errors.comision_id && (
              <p className="mt-1 text-sm text-red-650 font-medium">{errors.comision_id}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={() => router.visit(route("spad.indexcomision_empledo"))}
              className="px-4 py-2 border border-gray-300 text-gray-705 bg-amber-500 rounded-md hover:bg-gray-50 transition font-medium text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={processing}
              className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-md transition duration-150 font-semibold shadow-sm text-sm disabled:opacity-50"
            >
              {processing ? "Guardando..." : "Guardar Asignación"}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
};

export default ComisionEmpledoCreate;
