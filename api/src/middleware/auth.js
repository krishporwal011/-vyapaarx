const prisma = require('../utils/prisma');
const { supabase } = require('../utils/supabase');

const protect = async (req, res, next) => {
  // Temporary Debug Logging
  console.log('[Auth Debug] Incoming request to protect route.');
  console.log('[Auth Debug] Authorization header exists:', !!req.headers.authorization);

  let token;

  if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    console.log('[Auth Debug] Bearer token prefix (first 20 chars):', token.substring(0, 20));
  } else {
    console.log('[Auth Debug] No Bearer token extracted.');
  }

  if (!token) {
    return res.status(401).json({ success: false, error: 'Not authorized, no token' });
  }

  try {
    // Verify the token with Supabase Auth
    const result = await supabase.auth.getUser(token);
    console.log('[Auth Debug] supabase.auth.getUser(token) result:', JSON.stringify(result));
    
    const { data: { user }, error } = result;
    
    if (error || !user) {
      console.log('[Auth Debug] Supabase verification failed. Message:', error?.message || 'No user object returned');
      return res.status(401).json({ success: false, error: 'Not authorized, token failed' });
    }

    // Synchronize with local database (Prisma)
    let localUser = await prisma.user.findUnique({
      where: { id: user.id }
    });

    if (!localUser) {
      console.log('[Auth Middleware] User not found in database, sync-creating:', user.email);
      // Create user record in our DB using the Supabase ID
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

