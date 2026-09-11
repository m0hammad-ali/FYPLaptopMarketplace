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

const USAGE_TYPES = [
  'gaming',
  'office',
  'ultrabook',
  'workstation',
  'everyday',
];

module.exports = { API_ROUTES, ROLES, USAGE_TYPES };
