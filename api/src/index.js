const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const Sentry = require('@sentry/node');

require('dotenv').config();

Sentry.init({
  dsn: process.env.SENTRY_DSN || "https://placeholder-dsn@o0.ingest.sentry.io/0",
  tracesSampleRate: 1.0,
});

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

app.use(Sentry.Handlers.requestHandler());

const PORT = process.env.PORT || 5000;

/**
 * ============================================
 * SECURITY MIDDLEWARE
 * ============================================
 */

/**
 * Helmet Security Headers
 */
app.use(helmet());

/**
 * Rate Limiting
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
  },
});

/**
 * Apply Rate Limiter to API
 */
app.use('/api', apiLimiter);

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

app.use(
  cors({
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
  })
);

/**
 * ============================================
 * BODY PARSERS
 * ============================================
 */

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

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

app.use(Sentry.Handlers.errorHandler());

app.use(errorHandler);

/**
 * ============================================
 * START SERVER
 * ============================================
 */

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 API server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});