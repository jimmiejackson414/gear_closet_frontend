import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
export const supabasePublicKey = import.meta.env.VITE_SUPABASE_PUBLIC_KEY as string;

const supabase = createClient(
  supabaseUrl,
  supabasePublicKey,
);

export default supabase;
