const prisma = require('./prisma');
const { supabase } = require('./supabase');

async function initializeDatabase() {
  try {
    console.log('[DB Init] Checking database connection via Prisma...');
    // Simple query to verify connection
    await prisma.$queryRaw`SELECT 1`;
    console.log('[DB Init] Prisma connection verified.');

    console.log('[DB Init] Checking if "users" table exists...');
    
    // Check if table exists in the public schema
    const tableCheck = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `;
    
    const exists = tableCheck[0]?.exists;
    if (!exists) {
      console.log('[DB Init] "users" table does not exist. Creating it...');
      
      // Execute raw query to create the users table
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS public.users (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          full_name TEXT,
          business_name TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);
      
      console.log('[DB Init] "users" table created successfully.');
    } else {
      console.log('[DB Init] "users" table already exists.');
    }
  } catch (error) {
    console.error('[DB Init] Failed to verify database connection or initialize "users" table:', error.message);
  }
}

async function verifySupabaseConnection() {
  try {
    console.log('[Supabase Init] Checking Supabase connection...');
    const { data, error } = await supabase.from('users').select('id').limit(1);
    
    if (error) {
      if (error.code === '42P01' || error.message?.includes('relation "public.users" does not exist') || error.message?.includes('relation "users" does not exist')) {
        console.log('[Supabase Init] Connected successfully to API, but "users" table is not found in database yet.');
        return { success: true, tableExists: false };
      }
      console.error('[Supabase Init] Supabase API connection check failed:', error.message);
      return { success: false, error: error.message };
    }
    
    console.log('[Supabase Init] Connection and "users" table verified successfully.');
    return { success: true, tableExists: true };
  } catch (err) {
    console.error('[Supabase Init] Network error when connecting to Supabase:', err.message);
    return { success: false, error: err.message };
  }
}

module.exports = { 
  initializeDatabase,
  verifySupabaseConnection
};
