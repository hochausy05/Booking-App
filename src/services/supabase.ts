import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/booking';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseConfigurationError =
  !supabaseUrl || !supabaseAnonKey
    ? 'Supabase is not configured. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY, then restart the app.'
    : null;

export const supabase = supabaseConfigurationError
  ? null
  : createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
    });
