import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface FloorPlan {
  id: string;
  name: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface Printer {
  id: string;
  floor_plan_id: string;
  name: string;
  model: string;
  toner: string;
  status: string;
  x_position: number;
  y_position: number;
  created_at: string;
  updated_at: string;
}

export interface PrinterFormData {
  name: string;
  model: string;
  toner: string;
  status: string;
}