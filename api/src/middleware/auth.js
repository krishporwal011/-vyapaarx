const prisma = require('../utils/prisma');
const { supabase } = require('../utils/supabase');

const protect = async (req, res, next) => {
  let token;

  if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, error: 'Not authorized, no token' });
  }

  try {
    // Verify the token with Supabase Auth
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      console.log('[Auth Middleware] Supabase verification failed:', error?.message || 'No user');
      return res.status(401).json({ success: false, error: 'Not authorized, token failed' });
    }

    // Synchronize with local database (Prisma)
    // 1. Search by supabaseId (id)
    let localUser = await prisma.user.findUnique({
      where: { id: user.id }
    });

    if (!localUser) {
      console.log('[Auth Middleware] User not found by id. Searching by email:', user.email);
      // 2. Search by email
      localUser = await prisma.user.findUnique({
        where: { email: user.email }
      });

      if (localUser) {
        console.log('[Auth Middleware] User found by email. Updating primary key to Supabase ID:', user.id);
        // 3. Update existing record with the new supabaseId
        await prisma.$executeRaw`
          UPDATE "User"
          SET id = ${user.id}
          WHERE email = ${user.email}
        `;
        // Fetch the updated user
        localUser = await prisma.user.findUnique({
          where: { id: user.id }
        });
      } else {
        console.log('[Auth Middleware] Creating new Prisma user for email:', user.email);
        // 4. Create a new Prisma user if neither exists
        localUser = await prisma.user.create({
          data: {
            id: user.id,
            email: user.email,
            name: user.user_metadata?.full_name || user.user_metadata?.name || user.email.split('@')[0],
            password: '', // No password hash needed as auth is handled by Supabase
            businessName: user.user_metadata?.business_name || user.user_metadata?.businessName || '',
            role: user.user_metadata?.role || 'admin',
          }
        });
      }
    }

    req.user = localUser;
    
    // Assign MongoDB style _id compatibility to PostgreSQL id
    req.user._id = req.user.id;
    
    console.log('[Auth Middleware] Successfully authenticated user:', req.user.email, 'id:', req.user.id);
    next();
  } catch (err) {
    console.error('[Auth Middleware] Error in auth protect middleware:', err.message);
    return res.status(401).json({ success: false, error: 'Not authorized, token failed' });
  }
};

module.exports = { protect };
