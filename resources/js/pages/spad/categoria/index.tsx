import AppLayout from "@/layouts/app-layout";
import { usePage, Link, router } from "@inertiajs/react";
import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
} from "@/components/ui/pagination";
import { PageProps } from "@/types";
import { PaginatedData } from "@/types/paginated-data";
import CategoriaCreate from "./categoriaCreate";
import CategoriaEdit from "./categoriaEdit";

export default function CategoriaIndex() {
    const { categorias } = usePage<PageProps<{ categorias: PaginatedData<any> }>>().props;
    const url = new URL(categorias.first_page_url);
    const [search, setSearch] = useState(url.searchParams.get("search") || "");

    return (
        <AppLayout>
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4 text-amber-700">Listado de Categorías</h1>

                <div className="mb-4">
                    <input
                        name="search"
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar categoría..."
                        className="border border-amber-300 rounded-md px-3 py-2 w-full md:w-1/3"
                    />
                    <Link
                        href={route("spad.indexcategoria", { search: search })}
                        className="ml-2 inline-flex items-center px-4 py-2 bg-amber-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition ease-in-out duration-150"
                    >
                        Buscar
                    </Link>
                    <CategoriaCreate />
                </div>

                <div className="bg-white shadow-md rounded-lg">
                    <Table>
                        <TableHeader className="bg-amber-100">
                            <TableRow>
                                <TableHead className="text-amber-900 font-bold">ID</TableHead>
                                <TableHead>Imagen</TableHead>
                                <TableHead className="text-amber-900 font-bold">Nombre</TableHead>
                                <TableHead className="text-amber-900 font-bold">Descripción</TableHead>
                                <TableHead className="text-amber-900 font-bold">Estado</TableHead>
                                <TableHead className="text-amber-900 font-bold">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categorias.data.map((categoria: any) => (
                                <TableRow key={categoria.id}>
                                    <TableCell className="text-amber-900 font-bold">{categoria.id}</TableCell>
                                    <TableCell className="text-amber-900 font-bold">
                                        {categoria.foto_url ? (
                                            <img src={`${categoria.foto_url.startsWith('/storage') ? categoria.foto_url : `/storage/${categoria.foto_url}`}`} alt={categoria.nombre} className="h-10 w-10 rounded-full" />
                                        ) : (
                                            <div className="h-10 w-10 rounded-full bg-amber-200 flex items-center justify-center text-amber-700">#</div>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-amber-900 font-bold">{categoria.nombre}</TableCell>
                                    <TableCell className="text-amber-900 font-bold">{categoria.descripcion}</TableCell>
                                    <TableCell className="text-amber-900 font-bold">{categoria.estado}</TableCell>
                                    <TableCell className="flex gap-4 ">
                                        <CategoriaEdit categoria={categoria} />
                                        <button
                                            className="bg-red-500 hover:bg-red-700 font-bold py-1 px-2 rounded"
                                            onClick={() => {
                                                if (!confirm('¿Eliminar esta categoría? Esta acción no se puede deshacer.')) return;
                                                router.delete(route('spad.deletecategoria', { categoria: categoria.id }), {
                                                    onSuccess: () => router.reload(),
                                                    onError: (err) => {
                                                        console.error(err);
                                                        alert('Error al eliminar la categoría');
                                                    }
                                                });
                                            }}
                                        >Eliminar</button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <div className="mt-4">
                    <Pagination>
                        <PaginationContent>
                            {categorias.links.map((link: any, index: number) => (
                                <PaginationItem key={index}>
                                    {link.url ? (
                                        <PaginationLink href={link.url} isActive={link.active} size="default">
                                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                        </PaginationLink>
                                    ) : (
                                        <span className="px-3 py-1.5 text-sm text-amber-400" dangerouslySetInnerHTML={{ __html: link.label }} />
                                    )}
                                </PaginationItem>
                            ))}
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </AppLayout>
    );
}
