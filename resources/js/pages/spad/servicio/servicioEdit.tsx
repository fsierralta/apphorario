import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useForm, router } from "@inertiajs/react";
import toastMessage from "@/helper/toastMessage";

interface Props {
    servicio: any;
}

const ServicioEdit: React.FC<Props> = ({ servicio }) => {
    const [open, setOpen] = React.useState(false);
    const { data, setData, processing, errors, reset } = useForm({
        nombre_servicio: "",
        descripcion: "",
        precio: "",
        estado: "activo",
        categoria_id: undefined as number | undefined,
        foto_url: null as File | null,
    });
    const [categorias, setCategorias] = React.useState<any[]>([]);


    const [preview, setPreview] = React.useState<string | null>(null);
    const createdRef = React.useRef<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setData("foto_url", file as any);
        if (createdRef.current) {
            try { URL.revokeObjectURL(createdRef.current); } catch(e) {}
            createdRef.current = null;
        }
        if (file) {
            const url = URL.createObjectURL(file);
            createdRef.current = url;
            setPreview(url);
        }
    };

    const handleOpen = async () => {
        try {
            const url = route('spad.editservicio', { servicio: servicio.id });
            const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
            if (!res.ok) throw new Error('Failed to fetch servicio');
            const json = await res.json();
           setCategorias( preview=> json.categorias || []);
           console.log("Categorias data:", categorias);
            console.log("Servicio data:", json);
            setData('nombre_servicio', json.servicio.nombre_servicio || '');
            setData('descripcion', json.servicio.descripcion || '');
            setData('precio', json.servicio.precio?.toString() || '');
            setData('estado', json.servicio.estado || 'activo');
            setData('categoria_id', json.servicio.categoria_id ?? undefined);
            if (json.foto_url) {
                const p = json.foto_url.startsWith('/storage') ? json.foto_url : `/storage/${json.foto_url}`;
                setPreview(p);
            } else {
                setPreview(null);
            }
            setOpen(true);
        } catch (err) {
            console.error('Error loading servicio', err);
            alert('No se pudo cargar el servicio para editar. Intenta recargar la página.');
        }
    };

    const onSalvar = (e: React.FormEvent) => {
        e.preventDefault();
        const form = new FormData();
        form.append('nombre_servicio', data.nombre_servicio);
        form.append('descripcion', data.descripcion || '');
        form.append('precio', data.precio || '0');
        form.append('estado', data.estado);
        if (data.categoria_id !== undefined && data.categoria_id !== null) form.append('categoria_id', String(data.categoria_id));
        if (data.foto_url) form.append('foto_url', data.foto_url as File);
        form.append('_method', 'PUT');

        router.post(route('spad.updateservicio', { id: servicio.id }), form, {
            forceFormData: true,
            onSuccess: () => {
                toastMessage('Servicio actualizado', 'success');
                setOpen(false);
                reset();
                if (createdRef.current) {
                    try { URL.revokeObjectURL(createdRef.current); } catch(e) {}
                    createdRef.current = null;
                }
                setPreview(null);
                router.reload();
            },
            onError: (errs: any) => {
                if (errs.nombre_servicio) toastMessage(errs.nombre_servicio, 'error');
                if (errs.precio) toastMessage(errs.precio, 'error');
            },
        });
    };

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <button onClick={handleOpen} className="bg-amber-400 hover:bg-amber-500 text-amber-700 font-bold py-1 px-2 rounded">Edit</button>

            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/30 data-[state=open]:animate-overlayShow" />
                <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white text-black p-[25px] shadow-lg focus:outline-none data-[state=open]:animate-contentShow">
                    <Dialog.Title className="m-0 text-[17px] font-medium text-amber-900">Editar Servicio</Dialog.Title>
                    <Dialog.Description className="mb-5 mt-2.5 text-[15px] leading-normal text-amber-900">Actualiza los datos del servicio.</Dialog.Description>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-amber-900">Nombre</label>
                            <input type="text" value={data.nombre_servicio} onChange={(e) => setData('nombre_servicio', e.target.value)} className="mt-1 block w-full rounded border border-amber-300 p-2 bg-white text-amber-900" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-amber-900">Precio</label>
                            <input type="number" value={data.precio} onChange={(e) => setData('precio', e.target.value)} className="mt-1 block w-full rounded border border-amber-300 p-2 bg-white text-amber-900" />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-amber-900">Descripción</label>
                        <textarea value={data.descripcion} onChange={(e) => setData('descripcion', e.target.value)} className="mt-1 block w-full rounded border border-amber-300 p-2 bg-white text-amber-900" rows={3} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        
                        <div>
                            <label htmlFor="">Categoria {data.categoria_id}</label>
                            <select value={data.categoria_id ?? ''} 
                            onChange={(e) => setData('categoria_id', Number(e.target.value))} 
                            className="mt-1 block w-full rounded border border-amber-300 p-2 bg-white text-amber-900">
                                <option value="">-- Selecciona una categoría --</option>
                                {/* Aquí podrías mapear las categorías disponibles si las tienes en el estado */
                                  categorias.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{`${cat.id} ${cat.nombre}`}</option>
                                  ))

                                }
                            </select>

                        </div>
                        <div>
                            <label className="block text-sm font-medium text-amber-900">Estado</label>
                            <select value={data.estado} onChange={(e) => setData('estado', e.target.value)} className="mt-1 block w-full rounded border border-amber-300 p-2 bg-white text-amber-900">
                                <option value="activo">Activo</option>
                                <option value="inactivo">Inactivo</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-amber-900">Foto</label>
                        {preview ? <div className="mb-2"><img src={preview} alt="Preview" className="h-28 w-auto rounded-md object-contain border" /></div> : null}
                        <input type="file" accept="image/*" onChange={handleFileChange} className="mt-1 block w-full bg-white text-amber-900" />
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                        <button type="button" className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300" onClick={() => setOpen(false)}>Cancelar</button>
                        <button type="button" className="px-4 py-2 rounded bg-amber-300 text-amber-900 font-semibold hover:bg-amber-400 disabled:opacity-50" onClick={onSalvar} disabled={processing}>{processing ? 'Guardando...' : 'Guardar'}</button>
                    </div>

                    <Dialog.Close asChild>
                        <button className="absolute right-2.5 top-2.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full text-amber-900 bg-transparent hover:bg-violet-200 focus:ring-2 focus:ring-violet-300 focus:outline-none" aria-label="Close">
                            <Cross2Icon />
                        </button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default ServicioEdit;
