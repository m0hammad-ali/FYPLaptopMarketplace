// Shared configuration for all apps and services

const API_ROUTES = {
  AUTH_REGISTER: '/api/auth/register',
  AUTH_LOGIN: '/api/auth/login',
  LAPTOPS: '/api/laptops',
  LAPTOPS_FEATURED: '/api/laptops/featured',
  RECOMMEND: '/api/recommend',
  INVENTORY: '/api/inventory',
  SHOPS: '/api/shops',
  NOTIFY_WHATSAPP: '/api/notify/whatsapp-link',
};

const ROLES = {
  CUSTOMER: 'customer',
  VENDOR: 'vendor',
  ADMIN: 'admin',
};

const USAGE_TYPES = ['gaming', 'office', 'ultrabook', 'workstation', 'everyday'];

const FRONTEND_URLS = {
  HOME: 'http://localhost:3000',
  CUSTOMER: 'http://localhost:3001',
  VENDOR: 'http://localhost:3002',
  ADMIN: 'http://localhost:3003',
  AUTH: 'http://localhost:3004',
};

const STORAGE_KEYS = {
  CUSTOMER_TOKEN: 'customerToken',
  VENDOR_TOKEN: 'vendorToken',
  ADMIN_TOKEN: 'adminToken',
  USER_ROLE: 'userRole',
};

const theme = {
  colors: {
    primary: '#4f46e5',
    primaryDark: '#4338ca',
    primaryLight: '#818cf8',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    text: '#111827',
    textMuted: '#6b7280',
    bg: '#f9fafb',
    bgAlt: '#f3f4f6',
    card: '#ffffff',
    border: '#e5e7eb',
    whatsapp: '#25D366',
  },
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  shadow: {
    sm: '0 1px 2px rgba(0,0,0,0.05)',
    md: '0 4px 8px rgba(0,0,0,0.08)',
    lg: '0 10px 20px rgba(0,0,0,0.12)',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
};

module.exports = {
  API_ROUTES,
  ROLES,
  USAGE_TYPES,
  FRONTEND_URLS,
  STORAGE_KEYS,
  theme,
};
