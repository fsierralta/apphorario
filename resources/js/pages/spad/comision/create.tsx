import React, { useState } from "react";
import { router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";

const ComisionCreate: React.FC = () => {
  const [values, setValues] = useState({
    comision: "",
    valor: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues(values => ({
      ...values,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.post(route("comision.store"), {
        ...values,
        valor: Number(values.valor)
    });
  };
   
  return (
    <AppLayout
       breadcrumbs={[{ title: "Comisiones", href: route("comision.index") },
                     {title: "Crear Comisión", href: route("comision.create")}
       ]}
     


    >
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold text-amber-900 mb-4">Crear Comisión</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
          <div className="mb-4">
            <label htmlFor="comision" className="block text-sm font-medium text-gray-700">
              Comisión
            </label>
            <input
              id="comision"
              name="comision"
              type="text"
              value={values.comision}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-amber-500 border text-amber-900 border-gray-300 
              rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="valor" className="block text-sm font-medium text-gray-700">
              Valor
            </label>
            <input
              id="valor"
              name="valor"
              type="number"
              value={values.valor}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-amber-500 text-amber-900 border
               border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
};

export default ComisionCreate;