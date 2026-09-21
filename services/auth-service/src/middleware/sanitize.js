/**
 * Sanitizer middleware to strip dangerous keys from request bodies.
 * Prevents NoSQL-style injection attacks.
 */
function sanitize(req, res, next) {
  const clean = (obj) => {
    if (obj && typeof obj === 'object') {
      Object.keys(obj).forEach((key) => {
        if (key.startsWith('$') || key.includes('.')) {
          delete obj[key];
        } else {
          clean(obj[key]);
        }
      });
    }
  };
  clean(req.body);
  clean(req.query);
  clean(req.params);
  next();
}

module.exports = sanitize;
