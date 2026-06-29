import React from "react";
import { Link, router, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { PageProps } from "@/types";

interface Empleado {
  id: number;
  nombre: string;
  apellido: string;
  cargo: string;
}

interface Comision {
  id: number;
  comision: string;
  valor: number;
}

interface ComisionEmpledo {
  id: number;
  empleado_id: number;
  comision_id: number;
  empleado: Empleado | null;
  comision: Comision | null;
}

interface Props {
  comisionEmpleados: ComisionEmpledo[];
}

const ComisionEmpledoIndex: React.FC = () => {
  const { comisionEmpleados } = usePage<PageProps<Props>>().props;

  const handleEdit = (id: number) => {
    router.visit(route("spad.editcomision_empledo", { comision_empledo: id }));
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Seguro que deseas eliminar esta asignación de comisión?")) {
      router.delete(route("spad.deletecomision_empledo", { comision_empledo: id }));
    }
  };

  return (
    <AppLayout
      breadcrumbs={[
        { title: "Dashboard", href: "/dashboard" },
        { title: "Comisiones Empleados", href: route("spad.indexcomision_empledo") }
      ]}
    >
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-amber-900">Comisiones de Empleados</h1>
            <p className="text-sm text-amber-700 mt-1">Asignación y gestión de comisiones para cada empleado</p>
          </div>
          <button
            className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-md transition duration-150 font-semibold shadow-sm text-sm"
            onClick={() => router.visit(route("spad.createcomision_empledo"))}
          >
            Asignar Comisión
          </button>
        </div>

        <div className="bg-white border border-amber-100 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-amber-100">
              <thead className="bg-amber-50">
                <tr>
                  <th scope="col" className="py-3.5 px-4 text-left text-sm font-semibold text-amber-900">ID</th>
                  <th scope="col" className="py-3.5 px-4 text-left text-sm font-semibold text-amber-900">Empleado</th>
                  <th scope="col" className="py-3.5 px-4 text-left text-sm font-semibold text-amber-900">Cargo</th>
                  <th scope="col" className="py-3.5 px-4 text-left text-sm font-semibold text-amber-900">Comisión</th>
                  <th scope="col" className="py-3.5 px-4 text-left text-sm font-semibold text-amber-900">Valor / Porcentaje</th>
                  <th scope="col" className="py-3.5 px-4 text-center text-sm font-semibold text-amber-900">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100 bg-white">
                {comisionEmpleados && comisionEmpleados.length > 0 ? (
                  comisionEmpleados.map((item: ComisionEmpledo) => (
                    <tr key={item.id} className="hover:bg-amber-50/50 transition">
                      <td className="py-4 px-4 text-sm font-medium text-amber-900">{item.id}</td>
                      <td className="py-4 px-4 text-sm text-amber-900 font-semibold">
                        {item.empleado ? `${item.empleado.nombre} ${item.empleado.apellido}` : <span className="text-red-500 italic">Empleado eliminado</span>}
                      </td>
                      <td className="py-4 px-4 text-sm text-amber-700">
                        {item.empleado ? item.empleado.cargo : "-"}
                      </td>
                      <td className="py-4 px-4 text-sm text-amber-900">
                        {item.comision ? item.comision.comision : <span className="text-red-500 italic">Comisión eliminada</span>}
                      </td>
                      <td className="py-4 px-4 text-sm text-amber-900 font-medium">
                        {item.comision ? `${item.comision.valor}%` : "-"}
                      </td>
                      <td className="py-4 px-4 text-sm text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            className="px-3 py-1.5 bg-amber-600 text-white rounded hover:bg-amber-700 transition text-xs font-semibold"
                            onClick={() => handleEdit(item.id)}
                          >
                            Editar
                          </button>
                          <button
                            className="px-3 py-1.5 bg-red-650 text-white rounded bg-red-600 hover:bg-red-700 transition text-xs font-semibold"
                            onClick={() => handleDelete(item.id)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-sm text-amber-600 italic bg-amber-50/20">
                      No hay comisiones asignadas a empleados actualmente.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ComisionEmpledoIndex;
