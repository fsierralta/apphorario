import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import {router} from "@inertiajs/react";


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

 const onClickCreate=()=>{

	setData((data) => ({ ...data, nombre: "",email:"",apellido:"",cedula:"" }))
	

	
 }


return (

	
	<Dialog.Root open={open} onOpenChange={setOpen}>
		<Dialog.Trigger asChild>
		
				<button className="inline-flex h-9 items-center justify-center
				 bg-amber-700 px-4 font-medium text-white rounded-md shadow-sm
				  hover:bg-amber-800 focus-visible:outline-2 focus-visible:outline-amber-900 transition"
				  onClick={onClickCreate}
			     >
				Crear
			</button>
		</Dialog.Trigger>
		<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 bg-black/30 data-[state=open]:animate-overlayShow" />
				<Dialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-6 shadow-lg focus:outline-none data-[state=open]:animate-contentShow">
				<Dialog.Title className="m-0 text-lg font-medium text-gray-900">
					Formulario
				</Dialog.Title>
				<Dialog.Description className="mb-4 mt-2 text-sm leading-normal text-gray-700">
					Datos del cliente
				</Dialog.Description>
				<div className="space-y-4">
					<fieldset className="flex flex-col sm:flex-row sm:items-center sm:gap-5">
						<label
							className="sm:w-[90px] w-full sm:text-right text-[15px] text-gray-700 mb-2 sm:mb-0"
							htmlFor="cedula"
						>
						Cedula
						</label>
						<input
							className="h-10 w-full rounded px-3 text-amber-900 bg-amber-600 border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-300"
							id="cedula"
							value={	data.cedula}
							onChange={(e)=> setData({...data,cedula:e.target.value})}
							required

						/>
					</fieldset>
					<fieldset className="flex flex-col sm:flex-row sm:items-center sm:gap-5">
						<label
							className="sm:w-[90px] w-full sm:text-right text-[15px] text-gray-700 mb-2 sm:mb-0"
							htmlFor="nombre"
						>
							Name
						</label>
						<input
							className="h-10 w-full rounded px-3 text-amber-900 bg-amber-600 border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-300"
							id="name"
							value={	data.nombre}
							onChange={(e)=> setData({...data,nombre:e.target.value})}
							required

						/>
					</fieldset>
					<fieldset className="flex flex-col sm:flex-row sm:items-center sm:gap-5">
						<label
							className="sm:w-[90px] w-full sm:text-right text-[15px] text-gray-700 mb-2 sm:mb-0"
							htmlFor="apellidos"
						>
							Apellidos
						</label>
						<input
							className="h-10 w-full rounded px-3 text-amber-900 bg-amber-600 border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-300"
							id="name"
							name="apellido"
							value={	data.apellido}
							onChange={(e)=> setData({...data,apellido:e.target.value})}
							required

						/>
					</fieldset>

					<fieldset className="flex flex-col sm:flex-row sm:items-center sm:gap-5">
						<label
							className="sm:w-[90px] w-full sm:text-right text-[15px] text-gray-700 mb-2 sm:mb-0"
							htmlFor="celular"
						>
						Celular nro
						</label>
						<input
							className="h-10 w-full rounded px-3 text-amber-900 bg-amber-600 border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-300"
							id="telefono"
							name="telefono"
							required
							value={data.telefono}
							onChange={(e)=> setData({...data,telefono:e.target.value})}

						/>
					</fieldset>
					<fieldset className="flex flex-col sm:flex-row sm:items-center sm:gap-5">
						<label
							className="sm:w-[90px] w-full sm:text-right text-[15px] text-gray-700 mb-2 sm:mb-0"
							htmlFor="email"
						>
							Email
						</label>
						<input
							className="h-10 w-full rounded px-3 text-amber-900 bg-amber-600 border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-300"
							id="email"
							type="email"
							value={data.email}
							onChange={(e)=>setData({...data,email:e.target.value})}
						/>
					</fieldset>
				</div>

				<div className="mt-6 flex justify-end">
					<button className="inline-flex h-10 items-center justify-center rounded bg-amber-700 px-4 font-medium text-white hover:bg-amber-800 focus-visible:outline-2 focus-visible:outline-amber-800 select-none"
						onClick={onSalvar}
					>
						Salvar
					</button>
				</div>
				<Dialog.Close asChild>
					<button
						className="absolute right-2.5 top-2.5 inline-flex h-8 w-8 
						items-center justify-center rounded-full 
						bg-amber-700
						 hover:bg-amber-800 "
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
