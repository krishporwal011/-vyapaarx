const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma');

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
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });
    
    if (!req.user) {
      console.log('[Auth Middleware] User not found for id:', decoded.id);
      return res.status(401).json({ success: false, error: 'Not authorized, user not found' });
    }
    
    // Assign MongoDB style _id compatibility to PostgreSQL id
    req.user._id = req.user.id;
    
    console.log('[Auth Middleware] Successfully authenticated user:', req.user.email, 'id:', req.user.id);
    
    delete req.user.password; // Exclude password
    next();
  } catch (err) {
    console.error('[Auth Middleware] Token verification failed:', err.message);
    return res.status(401).json({ success: false, error: 'Not authorized, token failed' });
  }
};

module.exports = { protect };
