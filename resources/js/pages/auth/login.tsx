import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';


type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-amber-100 via-amber-300 to-amber-500 p-6 text-[#1b1b18] dark:bg-[#0a0a0a]">
            <Head title="Iniciar sesión" />
            <div className="w-full max-w-md bg-white/80 rounded-xl shadow-xl p-8">
                <h1 className="text-3xl font-extrabold text-amber-900 mb-2 text-center">Iniciar sesión</h1>
                <p className="text-amber-800 font-medium mb-6 text-center">
                    Ingresa tu correo y contraseña para acceder al sistema.
                </p>
                <form className="flex flex-col gap-6" onSubmit={submit}>
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-amber-900">Correo electrónico</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="email@example.com"
                                className="text-black bg-white"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password" className="text-amber-900">Contraseña</Label>
                                {canResetPassword && (
                                    <TextLink href={route('password.request')} className="ml-auto text-sm text-amber-700" tabIndex={5}>
                                        ¿Olvidaste tu contraseña?
                                    </TextLink>
                                )}
                            </div>
                            <Input
                                id="password"
                                type="password"
                                required
                                tabIndex={2}
                                autoComplete="current-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Contraseña"
                                className="text-black bg-white"
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="flex items-center space-x-3">
                            <Checkbox
                                id="remember"
                                name="remember"
                                checked={data.remember}
                                onClick={() => setData('remember', !data.remember)}
                                tabIndex={3}
                            />
                            <Label htmlFor="remember" className="text-amber-900">Recordarme</Label>
                        </div>

                        <Button type="submit" className="mt-4 w-full bg-amber-300 text-amber-900 font-bold hover:bg-amber-400 transition" tabIndex={4} disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Iniciar sesión
                        </Button>
                    </div>

                    <div className="text-center text-sm text-amber-800">
                        ¿No tienes cuenta?{' '}
                        <TextLink href={"#"} tabIndex={5} className="text-amber-900 font-semibold">
                            Solicita Regístrarte 
                        </TextLink>
                    </div>
                </form>

                {status && <div className="mt-4 text-center text-sm font-medium text-green-600">{status}</div>}
            </div>
            <footer className="mt-8 text-center w-full">
                <hr className="my-4 border-amber-300" />
                <p className="text-xs text-amber-900 font-semibold">
                    &copy; {new Date().getFullYear()} Freddy Sierralta. Todos los derechos reservados.
                </p>
            </footer>
        </div>
    );
}