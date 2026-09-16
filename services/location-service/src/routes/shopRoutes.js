const express = require('express');
const router = express.Router();
const { Shop } = require('../models');

// Helper: read trusted user headers (set by API Gateway)
function getUser(req) {
  return {
    id: req.headers['x-user-id'] ? parseInt(req.headers['x-user-id'], 10) : null,
    role: req.headers['x-user-role'] || null,
  };
}

// ---- Public: list all shops (customers see shop locations) ----
router.get('/', async (req, res) => {
  try {
    const shops = await Shop.findAll({ order: [['id', 'ASC']] });
    res.json(shops);
  } catch (error) {
    console.error('Failed to list shops:', error.message);
    res.status(500).json({ error: 'Failed to list shops' });
  }
});

// ---- Vendor: own shops only ----
router.get('/mine', async (req, res) => {
  const user = getUser(req);
  if (!user.id) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const shops = await Shop.findAll({
      where: { vendor_id: user.id },
      order: [['id', 'DESC']],
    });
    res.json(shops);
  } catch (error) {
    console.error('Failed to fetch own shops:', error.message);
    res.status(500).json({ error: 'Failed to fetch shops' });
  }
});

// ---- Get shops for a specific vendor (public) ----
router.get('/vendor/:vendorId', async (req, res) => {
  try {
    const shops = await Shop.findAll({ where: { vendor_id: req.params.vendorId } });
    res.json(shops);
  } catch (error) {
    console.error('Failed to fetch vendor shops:', error.message);
    res.status(500).json({ error: 'Failed to fetch shops' });
  }
});

// ---- Create shop (vendor only) ----
router.post('/', async (req, res) => {
  const user = getUser(req);
  if (!user.id) return res.status(401).json({ error: 'Unauthorized' });
  if (user.role !== 'vendor') return res.status(403).json({ error: 'Vendor only' });

  const { name, address, latitude, longitude, phone } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });

  try {
    const shop = await Shop.create({
      vendor_id: user.id,
      name,
      address,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      phone,
    });
    res.status(201).json(shop);
  } catch (error) {
    console.error('Create shop failed:', error.message);
    res.status(500).json({ error: 'Failed to create shop' });
  }
});

// ---- Update own shop ----
router.put('/:id', async (req, res) => {
  const user = getUser(req);
  if (!user.id) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const shop = await Shop.findOne({
      where: { id: req.params.id, vendor_id: user.id },
    });
    if (!shop) return res.status(404).json({ error: 'Shop not found' });

    const { name, address, latitude, longitude, phone } = req.body;
    await shop.update({
      name: name || shop.name,
      address: address !== undefined ? address : shop.address,
      latitude: latitude !== undefined ? parseFloat(latitude) : shop.latitude,
      longitude: longitude !== undefined ? parseFloat(longitude) : shop.longitude,
      phone: phone !== undefined ? phone : shop.phone,
    });

    res.json(shop);
  } catch (error) {
    console.error('Update shop failed:', error.message);
    res.status(500).json({ error: 'Failed to update shop' });
  }
});

// ---- Delete own shop ----
router.delete('/:id', async (req, res) => {
  const user = getUser(req);
  if (!user.id) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const shop = await Shop.findOne({
      where: { id: req.params.id, vendor_id: user.id },
    });
    if (!shop) return res.status(404).json({ error: 'Shop not found' });

    await shop.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Delete shop failed:', error.message);
    res.status(500).json({ error: 'Failed to delete shop' });
  }
});

module.exports = router;
