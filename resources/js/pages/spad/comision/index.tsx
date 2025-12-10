import React from "react";
import { router, } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";


interface Comision {
  id: number;
  comision: string;
  valor: number;
}

interface Props {
  comisions: Comision[];
}

const ComisionIndex: React.FC<Props> = ({ comisions }) => {
  const handleEdit = (id: number) => {
    // Redirigir a la vista de edición o abrir modal (a implementar)
    router.visit(route("comision.edit", {comision:id}));
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Seguro que deseas eliminar esta comisión?")) {
      router.delete(route("comision.destroy", id));
    }
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-amber-900">Comisiones</h1>
          <button
            className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
            onClick={() => router.visit(route("comision.create"))}
          >
            Crear Comisión
          </button>
        </div>
        <table className="min-w-full bg-white border border-gray-200 rounded shadow">
          <thead>
            <tr className="bg-amber-100 text-amber-900">
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Comisión</th>
              <th className="py-2 px-4 border-b">Valor</th>
              <th className="py-2 px-4 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody>
            { comisions.length>0 ?comisions.map((c) => (
              <tr key={c.id} className="hover:bg-amber-50">
                <td className="py-2 px-4 border-b text-center text-amber-900">{c.id}</td>
                <td className="py-2 px-4 border-b  text-amber-900">{c.comision}</td>
                <td className="py-2 px-4 border-b  text-amber-900">{c.valor}</td>
                <td className="py-2 px-4 border-b text-center gap-4">
                  <button
                    className="mr-2 px-3 py-1 bg-amber-600 text-white rounded hover:bg-amber-700"
                    onClick={() => handleEdit(c.id)}
                  >
                    Editar
                  </button>
                  <button
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    onClick={() => handleDelete(c.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
        : (<div><span className="text-red-500">No hay data</span></div>)}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
};

export default ComisionIndex;
