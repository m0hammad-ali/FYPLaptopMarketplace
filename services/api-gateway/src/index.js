const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
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

// ---- Health check ----
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'api-gateway',
    timestamp: new Date().toISOString(),
  });
});

// ---- Public proxy routes (no auth) ----

// Catalog — /api/laptops/featured is public, /api/laptops is auth-gated below
app.use(
  '/api/laptops/featured',
  createProxyMiddleware({
    target: process.env.CATALOG_SERVICE_URL || 'http://catalog-service:5002',
    changeOrigin: true,
    pathRewrite: { '^/api/laptops/featured': '/laptops/featured' },
  })
);

// Auth (register, login) — open access
app.use(
  '/api/auth',
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL || 'http://auth-service:5001',
    changeOrigin: true,
    pathRewrite: { '^/api/auth': '' },
  })
);

// Notifications — used by customer app for WhatsApp links
app.use(
  '/api/notify',
  createProxyMiddleware({
    target: process.env.NOTIFICATION_SERVICE_URL || 'http://notification-service:5005',
    changeOrigin: true,
    pathRewrite: { '^/api/notify': '/notify' },
  })
);

// ---- Auth-protected proxy routes ----

// Full laptop catalog requires login
app.use(
  '/api/laptops',
  authenticate,
  createProxyMiddleware({
    target: process.env.CATALOG_SERVICE_URL || 'http://catalog-service:5002',
    changeOrigin: true,
    pathRewrite: { '^/api/laptops': '/laptops' },
  })
);

// Recommendation engine
app.use(
  '/api/recommend',
  createProxyMiddleware({
    target: process.env.RECOMMENDATION_SERVICE_URL || 'http://recommendation-service:5004',
    changeOrigin: true,
    pathRewrite: { '^/api/recommend': '/recommend' },
  })
);

// Inventory (vendor only — enforced inside inventory-service)
app.use(
  '/api/inventory',
  authenticate,
  createProxyMiddleware({
    target: process.env.INVENTORY_SERVICE_URL || 'http://inventory-service:5003',
    changeOrigin: true,
    pathRewrite: { '^/api/inventory': '/inventory' },
  })
);

// Shops
app.use(
  '/api/shops',
  authenticate,
  createProxyMiddleware({
    target: process.env.LOCATION_SERVICE_URL || 'http://location-service:5006',
    changeOrigin: true,
    pathRewrite: { '^/api/shops': '/shops' },
  })
);

// Admin (IP-restricted + auth + role check)
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

// ---- JSON body parser for any remaining local routes ----
app.use(express.json());

// ---- 404 handler ----
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ---- Global error handler ----
app.use((err, req, res, next) => {
  console.error('[GATEWAY ERROR]', err.message);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

app.listen(port, () => {
  console.log(`API Gateway running on port ${port}`);
});
