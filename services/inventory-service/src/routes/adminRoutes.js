const express = require('express');
const router = express.Router();
const { User, Vendor } = require('../models');

// Admin middleware
function requireAdmin(req, res, next) {
  const role = req.headers['x-user-role'];
  if (role !== 'admin') {
    return res.status(403).json({ error: 'Admin only' });
  }
  next();
}

// List all vendors
router.get('/vendors', requireAdmin, async (req, res) => {
  try {
    const vendors = await Vendor.findAll({
      include: [{ model: User, as: 'User', attributes: ['id', 'email', 'role'] }],
      order: [['id', 'ASC']],
    });
    res.json(vendors);
  } catch (error) {
    console.error('Admin list vendors failed:', error.message);
    res.status(500).json({ error: 'Failed to list vendors' });
  }
});

// Toggle verification
router.put('/vendors/:id/verify', requireAdmin, async (req, res) => {
  const { is_verified } = req.body;
  try {
    const vendor = await Vendor.findByPk(req.params.id);
    if (!vendor) return res.status(404).json({ error: 'Vendor not found' });

    vendor.is_verified = !!is_verified;
    await vendor.save();
    res.json(vendor);
  } catch (error) {
    console.error('Verify vendor failed:', error.message);
    res.status(500).json({ error: 'Failed to update vendor' });
  }
});

module.exports = router;
