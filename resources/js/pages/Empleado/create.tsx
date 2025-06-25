import { useForm, Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

const Create = () => {
  const { cargos } = usePage<{ cargos: string[] }>().props;
  const { data, setData, post, processing, errors, reset } = useForm({
    nombre: '',
    apellido: '',
    cedula: '',
    telefono: '',
    direccion: '',
    foto_url: null as File | null,
    cargo: '',
    email: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/empleados', {
      forceFormData: true,
      onSuccess: () => reset('foto_url'),
    });
  };

  return (
    <AppLayout>
      <Head title="Crear Empleado" />
      <div className="max-w-full mt-8 bg-white p-6 rounded shadow text-black mx-[20%] " >
        <div className="mb-4">
          <Link
            href="/empleados"
            className="text-blue-600 hover:underline font-semibold"
          >
            ← Regresar
          </Link>
        </div>
        <h1 className="text-2xl font-bold mb-4">Crear Empleado</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold">Nombre</label>
            <input
              type="text"
              value={data.nombre}
              onChange={e => setData('nombre', e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
            {errors.nombre && <div className="text-red-500 text-sm">{errors.nombre}</div>}
          </div>
          <div>
            <label className="block font-semibold">Apellido</label>
            <input
              type="text"
              value={data.apellido}
              onChange={e => setData('apellido', e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
            {errors.apellido && <div className="text-red-500 text-sm">{errors.apellido}</div>}
          </div>
          <div>
            <label className="block font-semibold">Cédula</label>
            <input
              type="text"
              value={data.cedula}
              onChange={e => setData('cedula', e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
            {errors.cedula && <div className="text-red-500 text-sm">{errors.cedula}</div>}
          </div>
          <div>
            <label className="block font-semibold">Teléfono</label>
            <input
              type="text"
              value={data.telefono}
              onChange={e => setData('telefono', e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
            {errors.telefono && <div className="text-red-500 text-sm">{errors.telefono}</div>}
          </div>
          <div>
            <label className="block font-semibold">Dirección</label>
            <input
              type="text"
              value={data.direccion}
              onChange={e => setData('direccion', e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
            {errors.direccion && <div className="text-red-500 text-sm">{errors.direccion}</div>}
          </div>
          <div>
            <label className="block font-semibold">Email</label>
            <input
              type="email"
              value={data.email}
              onChange={e => setData('email', e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
            {errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}
          </div>
          <div>
            <label className="block font-semibold">Foto</label>
            <input
              type="file"
              accept="image/*"
              onChange={e => setData('foto_url', e.target.files ? e.target.files[0] : null)}
              className="w-full border rounded px-3 py-2"
            />
            {errors.foto_url && <div className="text-red-500 text-sm">{errors.foto_url}</div>}
          </div>
          <div>
            <label className="block font-semibold">Cargo</label>
            <select
              value={data.cargo}
              onChange={e => setData('cargo', e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Seleccione un cargo</option>
              {cargos.map((cargo) => (
                <option key={cargo} value={cargo}>{cargo}</option>
              ))}
            </select>
            {errors.cargo && <div className="text-red-500 text-sm">{errors.cargo}</div>}
          </div>
          <button
            type="submit"
            disabled={processing}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Guardar
          </button>
        </form>
      </div>
    </AppLayout>
  );
};

export default Create;