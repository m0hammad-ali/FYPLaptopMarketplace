const express = require('express');
const router = express.Router();
const { Inventory, PriceHistory, sequelize } = require('../models');

// ---- Helper: enforce authentication ----
function requireUser(req, res, next) {
  const userId = req.headers['x-user-id'];
  const role = req.headers['x-user-role'];
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  req.user = { id: parseInt(userId, 10), role };
  next();
}

// ---- Public: list all inventory (customers see prices) ----
router.get('/', async (req, res) => {
  try {
    const items = await Inventory.findAll({ order: [['updated_at', 'DESC']] });
    res.json(items);
  } catch (error) {
    console.error('Failed to list inventory:', error.message);
    res.status(500).json({ error: 'Failed to list inventory' });
  }
});

// ---- Vendor: own inventory only ----
router.get('/mine', requireUser, async (req, res) => {
  try {
    const items = await Inventory.findAll({
      where: { vendor_id: req.user.id },
      order: [['updated_at', 'DESC']],
    });
    res.json(items);
  } catch (error) {
    console.error('Failed to fetch mine:', error.message);
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

// ---- Create inventory item ----
router.post('/', requireUser, async (req, res) => {
  if (req.user.role !== 'vendor') {
    return res.status(403).json({ error: 'Only vendors can add inventory' });
  }

  const { laptop_id, price_pkr, stock } = req.body;

  if (!laptop_id || !price_pkr) {
    return res.status(400).json({ error: 'laptop_id and price_pkr required' });
  }

  const transaction = await sequelize.transaction();
  try {
    const item = await Inventory.create({
      vendor_id: req.user.id,
      laptop_id,
      price_pkr,
      stock: stock || 0,
    }, { transaction });

    await PriceHistory.create({
      inventory_id: item.id,
      old_price_pkr: null,
      new_price_pkr: price_pkr,
    }, { transaction });

    await transaction.commit();
    res.status(201).json(item);
  } catch (error) {
    await transaction.rollback();
    console.error('Create inventory failed:', error.message);
    res.status(500).json({ error: 'Failed to create inventory' });
  }
});

// ---- Update own item ----
router.put('/:id', requireUser, async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const item = await Inventory.findOne({
      where: { id: req.params.id, vendor_id: req.user.id },
      transaction,
    });

    if (!item) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Item not found or not yours' });
    }

    const oldPrice = item.price_pkr;
    const { price_pkr, stock } = req.body;

    await item.update({ price_pkr, stock }, { transaction });

    if (price_pkr && oldPrice !== price_pkr) {
      await PriceHistory.create({
        inventory_id: item.id,
        old_price_pkr: oldPrice,
        new_price_pkr: price_pkr,
      }, { transaction });
    }

    await transaction.commit();
    res.json(item);
  } catch (error) {
    await transaction.rollback();
    console.error('Update failed:', error.message);
    res.status(500).json({ error: 'Failed to update' });
  }
});

// ---- Delete own item ----
router.delete('/:id', requireUser, async (req, res) => {
  try {
    const item = await Inventory.findOne({
      where: { id: req.params.id, vendor_id: req.user.id },
    });
    if (!item) return res.status(404).json({ error: 'Item not found' });

    await item.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Delete failed:', error.message);
    res.status(500).json({ error: 'Failed to delete' });
  }
});

module.exports = router;
