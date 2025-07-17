// types/attendance.ts
export interface AttendanceRecord {
    id: number;
    nombre: string;
    apellido: string;
    cedula: string;
    cargo: string;
    registro_fecha: string;
    hora_entrada: string | null;
    hora_salida: string | null;
    inicio_descanso: string | null;
    fin_descanso: string | null;
    horario: string;
  }
  
  export interface Employee {
    id: number;
    nombre: string;
    apellido: string;
  }
  
  export interface AttendanceFilters {
    [key: string]: string | number | undefined;  // Add index signature
    fechai?: string;
    fechaf?: string;
    empleado_id?: number | string;
    tipo?: string;
    page?: number;
  }