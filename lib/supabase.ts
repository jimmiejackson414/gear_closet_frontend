import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = import.meta.env.SUPABASE_URL as string;
export const supabasePublicKey = import.meta.env.SUPABASE_KEY as string;

const supabase = createClient(
  supabaseUrl,
  supabasePublicKey,
);

export default supabase;
