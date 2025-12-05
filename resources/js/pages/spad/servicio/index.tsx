import AppLayout from "@/layouts/app-layout";
import { usePage,Link } from "@inertiajs/react";
import {useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
   
} from "@/components/ui/pagination"
import { PageProps } from "@/types";
import { PaginatedData } from "@/types/paginated-data";
import { Servicio } from "@/types/servicio";
import ServicioEdit from "./servicioEdit";

export default function ServicioIndex() {
    const { servicios } = usePage<PageProps<{ servicios: PaginatedData<Servicio> }>>().props
     const url=new URL(servicios.first_page_url);
    const [search,setSearch] = useState(url.searchParams.get("search") || "")
        console.log(servicios.first_page_url);
       return (

                <AppLayout>

                    <div className="p-4">

                        <h1 className="text-2xl font-bold mb-4 text-amber-700">Listado de Servicios</h1>
                        <div className="mb-4">
                                <input name="search" type="text" value={search}
                                 onChange={(e) => setSearch(e.target.value)} placeholder="Buscar servicio..." className="border border-amber-300 rounded-md px-3 py-2 w-full md:w-1/3" />    
                        <Link href={route('spad.indexservicio', {search: search})}
                         className="ml-2 inline-flex items-center px-4 py-2 bg-amber-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition ease-in-out duration-150">
                            Buscar
                        </Link>
                        <Link href={route('spad.createservicio')}
                            className="ml-2 inline-flex items-center px-4 py-2 bg-amber-900 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition ease-in-out duration-150">   
                            Crear Servicio
                        </Link>



                        </div>       


                        <div className="bg-white shadow-md rounded-lg">

                            <Table>

                                <TableHeader className="bg-amber-100">

                                    <TableRow>

                                        <TableHead  className="text-amber-900 font-bold ">ID</TableHead>

                                <TableHead>Imagen</TableHead>
                                <TableHead className="text-amber-900 font-bold ">Nombre</TableHead>
                                <TableHead className="text-amber-900 font-bold ">Descripción</TableHead>
                                <TableHead className="text-amber-900 font-bold ">Precio</TableHead>
                                <TableHead className="text-amber-900 font-bold ">Estado</TableHead>
                                <TableHead className="text-amber-900 font-bold ">Categoria</TableHead>
                                <TableHead className="text-amber-900 font-bold ">Acciones</TableHead>

                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {servicios.data.map((servicio) => (
                                <TableRow key={servicio.id}>
                                    <TableCell className="text-amber-900 font-bold ">{servicio.id}</TableCell>
                                    <TableCell className="text-amber-900 font-bold ">
                                        <img src={`/storage/${servicio.foto_url}`} alt={servicio.nombre_servicio} className="h-10 w-10 rounded-full" />
                                    </TableCell>

                                    <TableCell className="text-amber-900 font-bold ">{servicio.nombre_servicio}</TableCell>
                                    <TableCell className="text-amber-900 font-bold ">{servicio.descripcion}</TableCell>
                                    <TableCell className="text-amber-900 font-bold ">{servicio.precio}</TableCell>
                                    <TableCell className="text-amber-900 font-bold ">{servicio.estado}</TableCell>
                                    <TableCell className="text-amber-900 font-bold ">{servicio.categoria_nombre}</TableCell>
                                                                        <TableCell className="flex gap-4 "><ServicioEdit servicio={servicio} />
                                                                             <Link href={"#"}
                                                                            className="bg-red-500  hover:bg-red-700 font-bol py-1 px-2 rounded "
                                                                            >Eliminar</Link></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="mt-4">
                    <Pagination>
                        <PaginationContent>
                            {servicios.links.map((link, index) => (
                                <PaginationItem key={index}>
                                    {link.url ? (
                                        <PaginationLink href={link.url} isActive={link.active}
                                          size="default"
                                         >
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
