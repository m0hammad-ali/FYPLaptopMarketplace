const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { User, sequelize } = require('../models');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Register
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars'),
    body('role').optional().isIn(['customer', 'vendor', 'admin']),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, role } = req.body;
    const userRole = role || 'customer';

    const transaction = await sequelize.transaction();
    try {
      const existing = await User.findOne({ where: { email }, transaction });
      if (existing) {
        await transaction.rollback();
        return res.status(409).json({ error: 'User already exists' });
      }

      const password_hash = await bcrypt.hash(password, 10);
      const user = await User.create(
        { email, password_hash, role: userRole },
        { transaction }
      );

      // If vendor, also create a vendor profile record
      if (userRole === 'vendor') {
        // Use raw SQL since Vendor model lives in inventory-service
        await sequelize.query(
          'INSERT INTO vendors (user_id, shop_name, phone, is_verified, created_at) VALUES (?, ?, ?, ?, NOW())',
          {
            replacements: [
              user.id,
              `Shop of ${email.split('@')[0]}`,
              '',
              false,
            ],
            transaction,
          }
        );
      }

      await transaction.commit();

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      res.status(201).json({
        token,
        user: { id: user.id, email: user.email, role: user.role },
      });
    } catch (error) {
      await transaction.rollback();
      console.error('Register error:', error.message);
      res.status(500).json({ error: 'Registration failed' });
    }
  }
);

// Login
router.post(
  '/login',
  [body('email').isEmail().normalizeEmail(), body('password').notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      res.json({
        token,
        user: { id: user.id, email: user.email, role: user.role },
      });
    } catch (error) {
      console.error('Login error:', error.message);
      res.status(500).json({ error: 'Login failed' });
    }
  }
);

// Protected: get current user
router.get('/me', (req, res) => {
  const auth = req.headers['authorization'];
  const token = auth && auth.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token required' });

  try {
    const user = jwt.verify(token, JWT_SECRET);
    res.json(user);
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
});

module.exports = router;
