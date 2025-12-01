import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid ,UserCircle2,UserPen} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Empleados',
        href: route('empleados.index'),
        icon: UserCircle2,

    },
    {
      title:'Horario'  ,
      href:route('schedules.index'),
      icon:UserPen


    },
    {
        title:'Asignar Horario',
        href:route('asignar.show'),
        icon:UserPen


    },{
        title:'Horario Empleado',
        href:route('empleado.horario'),
        icon:UserPen
    },
    {
        title:'Registrar Entrada',
        href:route('showformhorario.show'),
        icon:UserPen
    },
    {
        title:'Lista de Asistencia',  
        href:route('reports.attendance'),
        icon:UserPen  
    },
    {
        title:'Citas SPAD',  
        href:route('spad.indexcita'),
        icon:BookOpen  

    },
    {
        title:'Servicios SPAD',  
        href:route('spad.indexservicio'),
        icon:BookOpen
    }




];

const footerNavItems: NavItem[] = [
    {
        title: 'soporte',
        href: '#',
        icon: Folder,
    },
   
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
