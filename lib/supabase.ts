import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl) throw new Error("supabaseUrl is required");
if (!supabaseAnonKey) throw new Error("supabaseAnonKey is required");

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
