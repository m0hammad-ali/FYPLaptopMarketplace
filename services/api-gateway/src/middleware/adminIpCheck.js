/**
 * Restricts /api/admin routes to a whitelist of IP addresses.
 * In development, localhost is always allowed.
 */

const DEFAULT_IPS = '127.0.0.1,::1,::ffff:127.0.0.1';

function adminIpCheck(req, res, next) {
  const allowed = (process.env.ADMIN_ALLOWED_IPS || DEFAULT_IPS)
    .split(',')
    .map((s) => s.trim());

  // req.ip is only meaningful when `trust proxy` is enabled
  const clientIp = (req.ip || req.connection.remoteAddress || '').replace('::ffff:', '');
  const isLocalhost = ['127.0.0.1', '::1', 'localhost'].includes(clientIp);

  if (!allowed.includes(clientIp) && !isLocalhost) {
    console.warn(`[ADMIN] Blocked access from IP ${clientIp}`);
    return res.status(403).json({ error: 'Admin access restricted to authorized IPs' });
  }

  next();
}

module.exports = adminIpCheck;
