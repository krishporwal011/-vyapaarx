import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function verifySupabaseConnection() {
  try {
    // Fetch 1 row from 'users' table to verify credentials and endpoint connection
    const { error } = await supabase.from('users').select('id').limit(1);
    
    if (error) {
      // If the table doesn't exist, Supabase API still connected successfully, but Postgres relation doesn't exist
      if (error.code === '42P01' || error.message?.includes('relation "public.users" does not exist') || error.message?.includes('relation "users" does not exist')) {
        return {
          success: true,
          tableExists: false,
          error: 'Table "users" does not exist yet.'
        };
      }
      // Any other API error is a connection/credential issue
      return {
        success: false,
        tableExists: false,
        error: error.message
      };
    }
    
    return {
      success: true,
      tableExists: true
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown network error';
    return {
      success: false,
      tableExists: false,
      error: errorMsg
    };
  }
}
