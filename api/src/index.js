const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

require('dotenv').config();

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

const PORT = process.env.PORT || 5000;

/**
 * Allowed Origins
 */
const allowedOrigins = [
  'http://localhost:3000',
  'https://vyapaarx.vercel.app',
];

/**
 * Middleware
 */
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, Postman, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('CORS policy violation'));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

/**
 * Root Route
 */
app.get('/', (req, res) => {
  return res.status(200).json({
    success: true,
    message: '🚀 VyapaarX API is running successfully',
  });
});

/**
 * Health Check Route
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
 * API Routes
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
 * Global Error Handler
 */
app.use(errorHandler);

/**
 * Start Server
 */
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 API server running on port ${PORT}`);
});