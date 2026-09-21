const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const authenticate = require('./middleware/auth');
const adminIpCheck = require('./middleware/adminIpCheck');

const app = express();

// ---- Global middleware ----
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
    'http://localhost:3004',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.set('trust proxy', 1);

const port = process.env.PORT || 5000;

// ---- Rate limiting ----
const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
app.use(globalLimiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many login attempts, please try again later.' },
});

// ---- Health check ----
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'api-gateway',
    timestamp: new Date().toISOString(),
  });
});

// ---- Public routes ----
app.use(
  '/api/auth/login',
  authLimiter,
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL || 'http://auth-service:5001',
    changeOrigin: true,
    pathRewrite: { '^/api/auth': '' },
  })
);

app.use(
  '/api/auth/register',
  authLimiter,
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL || 'http://auth-service:5001',
    changeOrigin: true,
    pathRewrite: { '^/api/auth': '' },
  })
);

app.use(
  '/api/auth',
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL || 'http://auth-service:5001',
    changeOrigin: true,
    pathRewrite: { '^/api/auth': '' },
  })
);

app.use(
  '/api/laptops/featured',
  createProxyMiddleware({
    target: process.env.CATALOG_SERVICE_URL || 'http://catalog-service:5002',
    changeOrigin: true,
    pathRewrite: { '^/api/laptops/featured': '/laptops/featured' },
  })
);

app.use(
  '/api/notify',
  createProxyMiddleware({
    target: process.env.NOTIFICATION_SERVICE_URL || 'http://notification-service:5005',
    changeOrigin: true,
    pathRewrite: { '^/api/notify': '/notify' },
  })
);

// ---- Protected routes ----
app.use(
  '/api/laptops',
  authenticate,
  createProxyMiddleware({
    target: process.env.CATALOG_SERVICE_URL || 'http://catalog-service:5002',
    changeOrigin: true,
    pathRewrite: { '^/api/laptops': '/laptops' },
  })
);

app.use(
  '/api/recommend',
  createProxyMiddleware({
    target: process.env.RECOMMENDATION_SERVICE_URL || 'http://recommendation-service:5004',
    changeOrigin: true,
    pathRewrite: { '^/api/recommend': '/recommend' },
  })
);

app.use(
  '/api/inventory',
  authenticate,
  createProxyMiddleware({
    target: process.env.INVENTORY_SERVICE_URL || 'http://inventory-service:5003',
    changeOrigin: true,
    pathRewrite: { '^/api/inventory': '/inventory' },
  })
);

app.use(
  '/api/shops',
  authenticate,
  createProxyMiddleware({
    target: process.env.LOCATION_SERVICE_URL || 'http://location-service:5006',
    changeOrigin: true,
    pathRewrite: { '^/api/shops': '/shops' },
  })
);

app.use(
  '/api/admin',
  adminIpCheck,
  authenticate,
  createProxyMiddleware({
    target: process.env.INVENTORY_SERVICE_URL || 'http://inventory-service:5003',
    changeOrigin: true,
    pathRewrite: { '^/api/admin': '/admin' },
  })
);

app.use(express.json());

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('[GATEWAY ERROR]', err.message);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

app.listen(port, () => {
  console.log(`API Gateway running on port ${port}`);
});
