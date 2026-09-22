/**
 * Restricts /api/admin routes to a whitelist of IP addresses.
 * In development, any private IP (Docker + localhost) is allowed.
 */

function isAllowedIp(clientIp) {
  if (!clientIp) return false;

  // Normalize IPv4-mapped IPv6 addresses (e.g., ::ffff:127.0.0.1)
  const ip = clientIp.replace('::ffff:', '');

  // Localhost
  if (ip === '127.0.0.1' || ip === '::1' || ip === 'localhost') return true;

  // Docker private networks (172.16.0.0/12, 192.168.0.0/16, 10.0.0.0/8)
  if (ip.startsWith('172.') || ip.startsWith('192.168.') || ip.startsWith('10.')) return true;

  // Explicit allowlist from env
  const allowed = (process.env.ADMIN_ALLOWED_IPS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  if (allowed.includes(ip)) return true;

  return false;
}

function adminIpCheck(req, res, next) {
  const clientIp = req.ip || req.connection?.remoteAddress || '';
  const userAgent = req.headers['user-agent'] || 'unknown';

  if (isAllowedIp(clientIp)) {
    console.log(`[ADMIN] Allowed: ${clientIp}`);
    return next();
  }

  console.warn(`[ADMIN] Blocked: ${clientIp} (UA: ${userAgent})`);
  return res.status(403).json({
    error: 'Admin access restricted to authorized IPs',
    your_ip: clientIp,
  });
}

module.exports = adminIpCheck;
