import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import {router} from "@inertiajs/react";
import toastMessage from "@/helper/toastMessage";

 interface PropData{
  nombre: string
  apellido:string
  telefono:string
  email:string
  cedula:string

}


const DialogDemo = () => {
	const [data,setData]=React.useState<PropData>({
		nombre:'',
		telefono:'',
		email:'',
		apellido:'',
		cedula:''



	});
    const [open, setOpen] = React.useState(false);

const  onSalvar=()=>{
	router.post(route('spad.storecliente',{...data}));
	console.log('Salvar datos:', data);	
 }



return (

	
	<Dialog.Root open={open} onOpenChange={setOpen}>
		<Dialog.Trigger asChild>
		
			<button className="inline-flex h-[35px] items-center justify-center  bg-amber-700 px-[15px] font-medium 
			leading-none text-amber-700 
			rounded-md 
			outline-none outline-offset-1 hover:bg-amber-900 focus-visible:outline-2 focus-visible:outline-amber-900 select-none">
				Crear
			</button>
		</Dialog.Trigger>
		<Dialog.Portal>
			<Dialog.Overlay className="fixed inset-0 bg-black/30 data-[state=open]:animate-overlayShow" />
			<Dialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-gray-50 p-[25px] shadow-lg focus:outline-none data-[state=open]:animate-contentShow">
				<Dialog.Title className="m-0 text-[17px] font-medium text-amber-900  ">
					Formulario
				</Dialog.Title>
				<Dialog.Description className="mb-5 mt-2.5 text-[15px] leading-normal text-amber-900">
		    		Datos del cliente
				</Dialog.Description>
				<fieldset className="mb-[15px] flex items-center gap-5">
					<label
						className="w-[90px] text-right text-[15px] text-amber-700"
						htmlFor="cedula"
					>
					Cedula
					</label>
					<input
						className="inline-flex h-[35px] w-full flex-1 items-center justify-center 
						text-amber-900 bg-amber-700
						rounded px-2.5 text-[15px] "
						id="cedula"
						value={	data.cedula}
						onChange={(e)=> setData({...data,cedula:e.target.value})}
						required

					/>
				</fieldset>
				<fieldset className="mb-[15px] flex items-center gap-5">
					<label
						className="w-[90px] text-right text-[15px] text-amber-700"
						htmlFor="nombre"
					>
						Name
					</label>
					<input
						className="inline-flex h-[35px] w-full flex-1 items-center justify-center 
						text-amber-900 bg-amber-700
						rounded px-2.5 text-[15px] "
						id="name"
						value={	data.nombre}
						onChange={(e)=> setData({...data,nombre:e.target.value})}
						required

					/>
				</fieldset>
				<fieldset className="mb-[15px] flex items-center gap-5">
					<label
						className="w-[90px] text-right text-[15px] text-amber-700"
						htmlFor="apellidos"
					>
						Apellidos
					</label>
					<input
						className="inline-flex h-[35px] w-full flex-1 items-center justify-center 
						text-amber-900 bg-amber-700
						rounded px-2.5 text-[15px] "
						id="name"
						name="apellido"
						value={	data.apellido}
						onChange={(e)=> setData({...data,apellido:e.target.value})}
						required

					/>
				</fieldset>

				<fieldset className="mb-[15px] flex items-center gap-5">
					<label
						className="w-[90px] text-right text-[15px] text-amber-700"
						htmlFor="celular"
					>
					Celular nro
					</label>
					<input
						className="inline-flex h-[35px] w-full flex-1 items-center justify-center rounded px-2.5 text-[15px] leading-none
                         	text-amber-900 bg-amber-700
						shadow-inner shadow-violet-200 outline-none focus:ring-2 focus:ring-violet-300"
						id="telefono"
						name="telefono"
						required
						value={data.telefono}
						onChange={(e)=> setData({...data,telefono:e.target.value})}


					/>
				</fieldset>
				<fieldset className="mb-[15px] flex items-center gap-5">
					<label
						className="w-[90px] text-right text-[15px] text-amber-700"
						htmlFor="email"
					>
						Email
					</label>
					<input
						className="inline-flex h-[35px] w-full flex-1
							text-amber-900 bg-amber-700
						items-center justify-center rounded px-2.5 text-[15px] leading-none shadow-inner shadow-violet-200 outline-none focus:ring-2 focus:ring-violet-300"
						id="email"
						type="email"
						value={data.email}
						onChange={(e)=>setData({...data,email:e.target.value})}
					/>
				</fieldset>

				<div className="mt-[25px] flex justify-end">
					
						<button className="inline-flex h-[35px] items-center justify-center rounded bg-amber-700 px-[15px] font-medium leading-none
						 text-green-700 outline-none outline-offset-1 hover:bg-green-300 focus-visible:outline-2 focus-visible:outline-green-300 select-none"
							onClick={onSalvar}

						 >
							Salvar
						</button>
			
				</div>
				<Dialog.Close asChild>
					<button
						className="absolute right-2.5 top-2.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full text-amber-900
						 bg-amber-900 hover:bg-violet-200 focus:ring-2 focus:ring-violet-300 focus:outline-none"
						aria-label="Close"
					>
						<Cross2Icon />
					</button>
				</Dialog.Close>
			</Dialog.Content>
		</Dialog.Portal>
	</Dialog.Root>
)};

export default DialogDemo;
