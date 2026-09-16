const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

/**
 * Verifies the JWT from the Authorization header and injects
 * trusted user info into downstream request headers.
 */
function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token required' });
  }

  try {
    const user = jwt.verify(token, JWT_SECRET);
    req.user = user;
    req.headers['x-user-id'] = user.id;
    req.headers['x-user-role'] = user.role;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}

module.exports = authenticate;
