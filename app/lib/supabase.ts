// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Usa las variables de entorno de Vercel (o .env.local) para las credenciales
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
