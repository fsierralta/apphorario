export interface ScheduleDay {
  id?: number;
  day_of_week: number;
  is_working_day: boolean;
  schedule_id?: number;
}

export interface Schedule {
  id?: number;
  name: string;
  start_time: string;
  end_time: string;
  has_break: boolean;
  break_start: string | null;
  break_end: string | null;
  is_flexible: boolean;
  tolerance_minutes: number;
  days: ScheduleDay[];
  created_at?: string;
  updated_at?: string;
}

export type ScheduleFormData = Omit<Schedule, 'id' | 'created_at' | 'updated_at'>;