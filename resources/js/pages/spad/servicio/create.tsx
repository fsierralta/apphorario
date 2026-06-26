import React, { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// using native textarea element instead of a missing Textarea component
import AuthenticatedLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

const CreateServicioPage = () => {
  const{categorias}=usePage().props;
   console.log(categorias);
  const { data, setData, post, processing, errors } = useForm<{
    nombre_servicio: string;
    descripcion: string;
    precio: string;
    estado: string;
    foto_url: File | null;
    categoria_id?: number;

  }>({
    nombre_servicio: '',
    descripcion: '',
    precio: '',
    estado: 'activo',
    foto_url: null,
  });

  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setData('foto_url', file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    post(route('spad.storeservicio'));
  };
  const breadcrumbs: BreadcrumbItem[]= [
    { title: 'Servicios', href: route('spad.indexservicio') },
    { title: 'Crear Servicio',
      href: ''  

    },
  ];
  return (
    <AuthenticatedLayout
        breadcrumbs={breadcrumbs}

    >
      <Card className="w-full mx-auto mt-6 ">
        <CardHeader>
          <CardTitle>Crear Nuevo Servicio</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
             <div className="space-y-2">
              <Label htmlFor="categoria_id">Categoría</Label>
              <Select
                value={data.categoria_id?.toString() || ''}
                onValueChange={(value) => setData('categoria_id', Number(value))}
              >
                <SelectTrigger id="categoria_id">
                  <SelectValue placeholder="Seleccione una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((categoria: { id: number; nombre: string }) => (
                    <SelectItem key={categoria.id} value={categoria.id.toString()}>
                      {categoria.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoria_id && (
                <p className="text-red-500 text-xs mt-1">{errors.categoria_id}</p>
              )}
            </div>  

            <div className="space-y-2">
              <Label htmlFor="nombre_servicio">Nombre del Servicio</Label>
              <Input
                id="nombre_servicio"
                value={data.nombre_servicio}
                onChange={(e) => setData('nombre_servicio', e.target.value)}
                placeholder="Ej: Corte de Cabello"
                required
              />
              {errors.nombre_servicio && (
                <p className="text-red-500 text-xs mt-1">{errors.nombre_servicio}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="foto_url">Foto del Servicio</Label>
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={preview} />
                  <AvatarFallback>Img</AvatarFallback>
                </Avatar>
                <Input
                  id="foto_url"
                  type="file"
                  onChange={handleFileChange}
                  className="file:text-white file:bg-amber-500 file:hover:bg-amber-600 file:rounded-md file:mr-4 file:py-2 file:px-4 file:border-0"
                  accept="image/png,image/jpeg"
                />
              </div>
              {errors.foto_url && (
                <p className="text-red-500 text-xs mt-1">{errors.foto_url}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <textarea
                id="descripcion"
                value={data.descripcion}
                onChange={(e) => setData('descripcion', e.target.value as any)}
                placeholder="Una breve descripción del servicio."
                className="w-full rounded-md border border-slate-200
                 font-bold
                 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              {errors.descripcion && (
                <p className="text-red-500 text-xs mt-1">{errors.descripcion}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="precio">Precio</Label>
              <Input
                id="precio"
                type="number"
                value={data.precio}
                onChange={(e) => setData('precio', e.target.value)}
                placeholder="0.00"
                required
                step="0.01"
              />
              {errors.precio && (
                <p className="text-red-500 text-xs mt-1">{errors.precio}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Select
                value={data.estado}
                onValueChange={(value) => setData('estado', value)}
              >
                <SelectTrigger id="estado">
                  <SelectValue placeholder="Seleccione un estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                </SelectContent>
              </Select>
              {errors.estado && (
                <p className="text-red-500 text-xs mt-1">{errors.estado}</p>
              )}
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={processing}
                className="bg-amber-500 hover:bg-amber-600 text-white"
              >
                {processing ? 'Guardando...' : 'Guardar Servicio'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AuthenticatedLayout>
  );
};

export default CreateServicioPage;
