import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useForm, router } from "@inertiajs/react";
import toastMessage from "@/helper/toastMessage";

interface Props {
    categoria: any;
}

const CategoriaEdit: React.FC<Props> = ({ categoria }) => {
    const [open, setOpen] = React.useState(false);

    const { data, setData, processing, errors, reset } = useForm({
        nombre: categoria.nombre || "",
        descripcion:categoria.descripcion || "",
        estado: categoria.estado ||"activo",
        foto_url: categoria.foto_url  || null,
    });
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
            const url = route('spad.editcategoria', {categoria: categoria.id });
            const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
            if (!res.ok) throw new Error('Failed to fetch category');
            const json = await res.json();
            setData('nombre', json.nombre || '');
            setData('descripcion', json.descripcion || '');
            setData('estado', json.estado || 'activo');
            // set preview if exists
            if (json.foto_url) {
                const p = json.foto_url.startsWith('/storage') ? json.foto_url : `/storage/${json.foto_url}`;
                setPreview(p);
            } else {
                setPreview(null);
            }
            setOpen(true);
        } catch (err) {
            console.error('Error loading category', err);
            alert('No se pudo cargar la categoría para editar. Intenta recargar la página.');
        }
    };

    const onSalvar =( e) => {
       e.preventDefault();


        const form = new FormData();
        form.append("nombre", data.nombre);
        form.append("descripcion", data.descripcion || "");
        form.append("estado", data.estado);
        if (data.foto_url) form.append("foto_url", data.foto_url as File);
        // Use method override for PUT
        form.append("_method", "PUT");

        router.post(route("spad.updatecategoria", { categoria: categoria.id }), form, {
            forceFormData: true,
            onSuccess: () => {
                toastMessage("Categoría actualizada", "success");
                setOpen(false);
                // reload to reflect changes in list
                router.reload();
                reset();
                if (createdRef.current) {
                    try { URL.revokeObjectURL(createdRef.current); } catch(e) {}
                    createdRef.current = null;
                }
                setPreview(null);
            },
            onError: (errs: any) => {
                if (errs.nombre) toastMessage(errs.nombre, "error");
                if (errs.descripcion) toastMessage(errs.descripcion, "error");
                if (errs.estado) toastMessage(errs.estado, "error");
            },
        });
    };

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            {/* Use custom trigger that fetches fresh data before opening modal */}
            <button onClick={handleOpen}
                    className="bg-amber-400 hover:bg-amber-500 text-amber-700 font-bold py-1 px-2 rounded">
                Edit
            </button>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/30 data-[state=open]:animate-overlayShow" />
                <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white text-black p-[25px] shadow-lg focus:outline-none data-[state=open]:animate-contentShow">
                    <Dialog.Title className="m-0 text-[17px] font-medium text-amber-900">Editar Categoría</Dialog.Title>
                    <Dialog.Description className="mb-5 mt-2.5 text-[15px] leading-normal text-amber-900">Actualiza los datos de la categoría.</Dialog.Description>

                    <fieldset className="mb-4">
                        <label className="block text-sm font-medium text-amber-900">Nombre</label>
                        <input
                            type="text"
                            value={data.nombre}
                            onChange={(e) => setData("nombre", e.target.value)}
                            className="mt-1 block w-full rounded border border-amber-300 p-2 bg-white text-amber-900 placeholder:text-amber-400 ring-1 ring-transparent focus:outline-none focus:ring-2 focus:ring-amber-300"
                        />
                        {errors.nombre && <p className="text-sm text-red-600">{errors.nombre}</p>}
                    </fieldset>

                    <fieldset className="mb-4">
                        <label className="block text-sm font-medium text-amber-900">Descripción</label>
                        <textarea
                            value={data.descripcion}
                            onChange={(e) => setData("descripcion", e.target.value)}
                            className="mt-1 block w-full rounded border border-amber-300 p-2 bg-white text-amber-900 placeholder:text-amber-400 ring-1 ring-transparent focus:outline-none focus:ring-2 focus:ring-amber-300"
                            rows={3}
                        />
                        {errors.descripcion && <p className="text-sm text-red-600">{errors.descripcion}</p>}
                    </fieldset>

                    <fieldset className="mb-4">
                        <label className="block text-sm font-medium text-amber-900">Estado</label>
                        <select
                            value={data.estado}
                            onChange={(e) => setData("estado", e.target.value)}
                            className="mt-1 block w-full rounded border border-amber-300 p-2 bg-white text-amber-900 ring-1 ring-transparent focus:outline-none focus:ring-2 focus:ring-amber-300"
                        >
                            <option value="activo">Activo</option>
                            <option value="inactivo">Inactivo</option>
                        </select>
                        {errors.estado && <p className="text-sm text-red-600">{errors.estado}</p>}
                    </fieldset>

                    <fieldset className="mb-4">
                        <label className="block text-sm font-medium text-amber-900">Foto (opcional)</label>
                        {preview ? (
                            <div className="mb-2">
                                <img src={preview} alt="Preview" className="h-28 w-auto rounded-md object-contain border" />
                            </div>
                        ) : null}
                        <input type="file" accept="image/*" onChange={handleFileChange} className="mt-1 block w-full bg-white text-amber-900" />
                        {errors.foto_url && <p className="text-sm text-red-600">{errors.foto_url}</p>}
                    </fieldset>

                    {React.useEffect(() => {
                        return () => {
                            if (createdRef.current) {
                                try { URL.revokeObjectURL(createdRef.current); } catch(e) {}
                                createdRef.current = null;
                            }
                        };
                    }, [])}

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

export default CategoriaEdit;
