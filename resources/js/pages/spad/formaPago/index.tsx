import AppLayout from '@/layouts/app-layout';
import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import type { PageProps,PaginationLink} from '@/types';

interface FormaPagoItem {
  id: number;
  nombre_forma_pago: string;
  descripcion: string | null;
  nombre_corto: string | null;
}

interface PaginatedFormaPago {
  data: FormaPagoItem[];
  links: Array<{ url: string | null; label: string; active: boolean }>;
  first_page_url: string;
}

export default function FormaPagoIndex() {
  const { formasPago } = usePage<PageProps<{ formasPago: PaginatedFormaPago }>>().props;
  const [search, setSearch] = useState(new URL(formasPago.first_page_url).searchParams.get('search') || '');

  return (
    <AppLayout>
      <div className="p-4">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold text-amber-700">Formas de pago</h1>
          <Link
            href={route('spad.createformapago')}
            className="inline-flex items-center rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
          >
            Crear forma de pago
          </Link>
        </div>

        <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar forma de pago..."
            className="w-full rounded-md border border-amber-300 px-3 py-2 md:w-1/3"
          />
          <Link
            href={route('spad.indexformapago', { search })}
            className="inline-flex items-center rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600"
          >
            Buscar
          </Link>
        </div>

        <div className="overflow-hidden rounded-lg border border-amber-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-amber-100">
            <thead className="bg-amber-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-amber-900">ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-amber-900">Nombre</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-amber-900">Nombre corto</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-amber-900">Descripción</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-amber-900">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {formasPago.data.map((item:FormaPagoItem) => (
                <tr key={item.id} className="hover:bg-amber-50">
                  <td className="px-4 py-3 text-sm text-gray-700">{item.id}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.nombre_forma_pago}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{item.nombre_corto || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{item.descripcion || '-'}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      <Link
                        href={route('spad.editformapago', { formaPago: item.id })}
                        className="rounded bg-amber-600 px-3 py-1.5 font-medium text-white hover:bg-amber-700"
                      >
                        Editar
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          if (!confirm('¿Desea eliminar esta forma de pago?')) return;
                          router.delete(route('spad.deleteformapago', { formaPago: item.id }));
                        }}
                        className="rounded bg-red-600 px-3 py-1.5 font-medium text-white hover:bg-red-700"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {formasPago.links.length > 0 && (
          <div className="mt-4 flex justify-center">
            <nav className="flex gap-2">
              {formasPago.links.map((link:PaginationLink, index:number) => (
                <Link
                  key={`${link.label}-${index}`}
                  href={link.url || '#'}
                  className={`rounded px-3 py-1 ${link.active ? 'bg-amber-600 text-white' : 'bg-white text-amber-700 hover:bg-amber-100'}`}
                >
                  <span dangerouslySetInnerHTML={{ __html: link.label }} />
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
