const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const Sentry = require('@sentry/node');

require('dotenv').config();

if (process.env.SENTRY_DSN && Sentry.Handlers) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
  });
}

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const customerRoutes = require('./routes/customers');
const invoiceRoutes = require('./routes/invoices');
const analyticsRoutes = require('./routes/analytics');
const supplierRoutes = require('./routes/suppliers');
const aiRoutes = require('./routes/ai');

const { errorHandler } = require('./middleware/errorHandler');

const app = express();

if (process.env.SENTRY_DSN && Sentry.Handlers) {
  app.use(Sentry.Handlers.requestHandler());
}

const PORT = process.env.PORT || 5000;

/**
 * ============================================
 * ALLOWED ORIGINS
 * ============================================
 */
const allowedOrigins = [
  'http://localhost:3000',
  'https://vyapaarx.vercel.app',
];

/**
 * ============================================
 * CORS CONFIGURATION
 * ============================================
 */
const corsOptions = {
  origin: function (origin, callback) {
    /**
     * Allow:
     * - Postman
     * - Mobile apps
     * - Server-to-server requests
     */
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(
      new Error(`CORS policy violation: ${origin} not allowed`)
    );
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

/**
 * ============================================
 * BODY PARSERS
 * ============================================
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

/**
 * ============================================
 * SECURITY HEADERS & RATE LIMITING
 * ============================================
 */
app.use(helmet());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === 'OPTIONS', // Do not rate limit preflight requests
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
  },
});

app.use('/api', apiLimiter);

/**
 * ============================================
 * COOKIES + LOGGING
 * ============================================
 */
app.use(cookieParser());
app.use(morgan('dev'));

/**
 * ============================================
 * ROOT ROUTE
 * ============================================
 */

app.get('/', (req, res) => {
  return res.status(200).json({
    success: true,
    message: '🚀 VyapaarX API is running successfully',
  });
});

/**
 * ============================================
 * HEALTH CHECK ROUTE
 * ============================================
 */

app.get('/api/health', (req, res) => {
  return res.status(200).json({
    success: true,
    status: 'OK',
    service: 'VyapaarX API',
    timestamp: new Date().toISOString(),
  });
});

/**
 * ============================================
 * API ROUTES
 * ============================================
 */

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/ai', aiRoutes);

/**
 * ============================================
 * 404 HANDLER
 * ============================================
 */

app.use('*', (req, res) => {
  return res.status(404).json({
    success: false,
    message: 'API route not found',
  });
});

/**
 * ============================================
 * GLOBAL ERROR HANDLER
 * ============================================
 */

if (process.env.SENTRY_DSN && Sentry.Handlers) {
  app.use(Sentry.Handlers.errorHandler());
}

app.use(errorHandler);

/**
 * ============================================
 * START SERVER
 * ============================================
 */

const { initializeDatabase, verifySupabaseConnection } = require('./utils/dbInit');

app.listen(PORT, '0.0.0.0', async () => {
  console.log(`🚀 API server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Run database initialization and connection check
  await initializeDatabase();
  await verifySupabaseConnection();
});