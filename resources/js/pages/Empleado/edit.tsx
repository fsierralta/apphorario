import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

interface Empleado {
    id: number;
    nombre: string;
    apellido: string;
    cedula: string;
    telefono: string;
    direccion: string;
    foto_url: string;
    cargo: string;
    user_id: number;
    email: string;
    [key: string]: unknown;
}
interface CargosProps {
    [x: string]: any;
    cargos: string[];
}

const Edit = () => {
    const { empleado, cargos } = usePage<{ empleado: Empleado; cargos: CargosProps }>().props;
    const { data, setData, post, processing, errors } = useForm<{
        nombre: string;
        apellido: string;
        cedula: string;
        telefono: string;
        direccion: string;
        foto_url: string | File | null;
        cargo: string;
        email: string;
    }>({
        nombre: empleado.nombre,
        apellido: empleado.apellido,
        cedula: empleado.cedula,
        telefono: empleado.telefono,
        direccion: empleado.direccion,
        foto_url: null as File | null,
        cargo: empleado.cargo,
        email: empleado.email ? empleado.email : 's@gmail.com',
    });
    console.log(data);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { foto_url, ...restData } = data;
        const validar = Object.values(restData);

        if (validar.some((value) => value === '' || value == null)) {
            alert('debe rellenar el formulario');
            return;
        }
        post(route('empleados.update', empleado.id), {
            forceFormData: true,
            onSuccess: () => console.log('data'),
        });
    };

    return (
        <AppLayout>
            <Head title="Editar Empleado" />
            <div className="mx-[20%] mt-8 max-w-full rounded bg-white p-6 text-black shadow">
                <div className="mb-4">
                    <Link href="/empleados" className="font-semibold text-blue-600 hover:underline">
                        ← Regresar
                    </Link>
                </div>
                <h1 className="mb-4 text-2xl font-bold">Crear Empleado</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-semibold">Nombre</label>
                        <input
                            type="text"
                            value={data.nombre}
                            onChange={(e) => setData('nombre', e.target.value)}
                            className="w-full rounded border px-3 py-2"
                        />
                        {errors.nombre && <div className="text-sm text-red-500">{errors.nombre}</div>}
                    </div>
                    <div>
                        <label className="block font-semibold">Apellido</label>
                        <input
                            type="text"
                            value={data.apellido}
                            onChange={(e) => setData('apellido', e.target.value)}
                            className="w-full rounded border px-3 py-2"
                        />
                        {errors.apellido && <div className="text-sm text-red-500">{errors.apellido}</div>}
                    </div>
                    <div>
                        <label className="block font-semibold">Cédula</label>
                        <input
                            type="text"
                            value={data.cedula}
                            onChange={(e) => setData('cedula', e.target.value)}
                            className="w-full rounded border px-3 py-2"
                        />
                        {errors.cedula && <div className="text-sm text-red-500">{errors.cedula}</div>}
                    </div>
                    <div>
                        <label className="block font-semibold">Teléfono</label>
                        <input
                            type="text"
                            value={data.telefono}
                            onChange={(e) => setData('telefono', e.target.value)}
                            className="w-full rounded border px-3 py-2"
                        />
                        {errors.telefono && <div className="text-sm text-red-500">{errors.telefono}</div>}
                    </div>
                    <div>
                        <label className="block font-semibold">Dirección</label>
                        <input
                            type="text"
                            value={data.direccion}
                            onChange={(e) => setData('direccion', e.target.value)}
                            className="w-full rounded border px-3 py-2"
                        />
                        {errors.direccion && <div className="text-sm text-red-500">{errors.direccion}</div>}
                    </div>

                    <div>
                        <label className="block font-semibold">Email</label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="w-full rounded border px-3 py-2"
                        />
                        {errors.email && <div className="text-sm text-red-500">{errors.email}</div>}
                    </div>
                    <div className="flex gap-4">
                        <div>
                            <label>Foto actual </label>
                            {empleado.foto_url ? (
                                <img src={`/${empleado.foto_url}`} alt="foto" className="h-10 w-10 rounded-full border object-cover" />
                            ) : (
                                <span>Sin foto</span>
                            )}
                        </div>
                        <div>
                            <label className="block font-semibold">Foto</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setData('foto_url', e.target.files ? e.target.files[0] : null)}
                                className="w-full rounded border px-3 py-2"
                            />
                            {errors.foto_url && <div className="text-sm text-red-500">{errors.foto_url}</div>}
                        </div>
                        <div>
                            <label className="">Foto </label>
                            {data.foto_url ? (
                                data.foto_url instanceof File ? (
                                    <img src={URL.createObjectURL(data.foto_url)} alt="Foto" className="h-10 w-10 rounded-full border object-cover" />
                                ) : (
                                    <span>No hay foto seleccionada</span>
                                )
                            ) : (
                                <span>No hay foto seleccionada</span>
                            )}
                        </div>
                    </div>
                    <div>
                        <label className="block font-semibold">Cargo</label>
                        <select
                            value={data.cargo}
                            onChange={(e) => setData('cargo', e.target.value)}
                            className="w-full rounded border px-3 py-2"
                            required
                        >
                            <option value="">Seleccione un cargo</option>
                            {cargos ? (
                                cargos.map((cargo: string) => (
                                    <option key={cargo} value={cargo}>
                                        {cargo}
                                    </option>
                                ))
                            ) : (
                                <p>No hay cargo</p>
                            )}
                        </select>
                        {errors.cargo && <div className="text-sm text-red-500">{errors.cargo}</div>}
                    </div>
                    <button type="submit" disabled={processing} className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                        Guardar
                    </button>
                </form>
            </div>
        </AppLayout>
    );
};

export default Edit;
