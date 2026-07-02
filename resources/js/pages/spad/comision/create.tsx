import React, { useState } from "react";
import { router,usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import toastMessage from "@/helper/toastMessage";
import {ToastContainer} from 'react-toastify';
import { FlashMessage } from '@/types';
import { useEffect } from 'react';
import { z } from "zod";

const ComisionCreate: React.FC = () => {
 const { flash,errors } = usePage<{ flash: FlashMessage }>().props;
  const [values, setValues] = useState({
    comision: "",
    valor: 0,
  });
  const validadComsion=z.object({
    comision: z.string().min(1, "La comisión es requerida"),
    valor: z.number().min(1, "El valor debe ser mayor o igual a 1"),
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues(values => ({
      ...values,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      validadComsion.parse(values);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.issues.map(issue => issue.message);
        toastMessage(errorMessages[0], 'error');
        return;
      }
    } 

    router.post(route("comision.store"), {
        ...values,
        valor: Number(values.valor)
    });
  };

   useEffect(() => {
    if(flash.success){
      toastMessage(flash.success, 'success');
    }
    if(flash.error){
      toastMessage(flash.error, 'error');
    }
    
    if(flash.message){
      toastMessage(flash.message, 'info');
    }
   
   
  }, [flash]);

  return (
    <AppLayout
       breadcrumbs={[{ title: "Comisiones", href: route("comision.index") },
                     {title: "Crear Comisión", href: route("comision.create")}
       ]}
     >
      <ToastContainer />
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
            {
              errors.comision && <p className="text-red-500">{errors.comision}</p>
            }
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
            {
              errors.valor && <p className="text-red-500">{errors.valor}</p>
            }
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