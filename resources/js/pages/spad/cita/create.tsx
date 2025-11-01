import AppLayout from "@/layouts/app-layout"
import { Link ,usePage} from "@inertiajs/react"
export default function CreateCita() {
  
  const {clientes,horas}=usePage().props;
  console.log(clientes)
  console.log(horas);

  return (
   <AppLayout
    breadcrumbs={[
      {title:"Volver",
        href:route("spad.indexcita")
      },
      {
        title:"Crear",
        href:"#"
      }
    ]}
   >
     <div>crear</div>
      
      <Link href={route('spad.indexcita')} className="bg-amber-300 text-amber-900 font-semibold px-4 py-2 rounded shadow hover:bg-amber-400 transition">
        Volver a Citas SPAD
      </Link>   

    </AppLayout>   
  ) 
}
