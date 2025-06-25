import { LucideIcon } from 'lucide-react';
import { JSX } from 'react/jsx-runtime';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}
export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}
export interface Paginated<T> {
  map(arg0: (empleado: EmpleadoProps) => JSX.Element): import("react").ReactNode;
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

export interface  Horario{
    days: { day_of_week: number; is_working_day: boolean; }[];
    id:number | null;
    name:string |null;
    start_time:string;
    end_time:string;
    has_break:boolean |null;
    break_start:string |null;
    break_end:string| null
    tolerance_minutes:number | null;
    
  
}