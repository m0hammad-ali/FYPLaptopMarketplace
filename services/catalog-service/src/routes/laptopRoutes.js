const express = require('express');
const router = express.Router();
const { Laptop, Specification, sequelize } = require('../models');

// GET /laptops - list all laptops with specs
router.get('/', async (req, res) => {
  try {
    const laptops = await Laptop.findAll({
      include: [{ model: Specification, as: 'Specification' }],
      order: [['id', 'ASC']],
    });
    res.json(laptops);
  } catch (error) {
    console.error('Failed to fetch laptops:', error.message);
    res.status(500).json({ error: 'Failed to fetch laptops' });
  }
});

// GET /laptops/featured - public preview (4 laptops)
router.get('/featured', async (req, res) => {
  try {
    const laptops = await Laptop.findAll({
      include: [{ model: Specification, as: 'Specification' }],
      order: [['id', 'ASC']],
      limit: 4,
    });
    res.json(laptops);
  } catch (error) {
    console.error('Failed to fetch featured laptops:', error.message);
    res.status(500).json({ error: 'Failed to fetch featured laptops' });
  }
});

// GET /laptops/:id - single laptop
router.get('/:id', async (req, res) => {
  try {
    const laptop = await Laptop.findByPk(req.params.id, {
      include: [{ model: Specification, as: 'Specification' }],
    });
    if (!laptop) {
      return res.status(404).json({ error: 'Laptop not found' });
    }
    res.json(laptop);
  } catch (error) {
    console.error('Failed to fetch laptop:', error.message);
    res.status(500).json({ error: 'Failed to fetch laptop' });
  }
});

// POST /laptops - create new laptop (admin only)
router.post('/', async (req, res) => {
  const { brand, model, release_year, category, specification } = req.body;

  if (!brand || !model || !specification) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const transaction = await sequelize.transaction();
  try {
    const laptop = await Laptop.create(
      { brand, model, release_year, category },
      { transaction }
    );

    await Specification.create(
      { laptop_id: laptop.id, ...specification },
      { transaction }
    );

    await transaction.commit();
    res.status(201).json(laptop);
  } catch (error) {
    await transaction.rollback();
    console.error('Failed to create laptop:', error.message);
    res.status(500).json({ error: 'Failed to create laptop' });
  }
});

// PUT /laptops/:id - update laptop (admin only)
router.put('/:id', async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const laptop = await Laptop.findByPk(req.params.id, { transaction });
    if (!laptop) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Laptop not found' });
    }

    const { brand, model, release_year, category, specification } = req.body;

    await laptop.update(
      { brand, model, release_year, category },
      { transaction }
    );

    if (specification) {
      const spec = await Specification.findOne({
        where: { laptop_id: laptop.id },
        transaction,
      });
      if (spec) {
        await spec.update(specification, { transaction });
      }
    }

    await transaction.commit();
    res.json(laptop);
  } catch (error) {
    await transaction.rollback();
    console.error('Failed to update laptop:', error.message);
    res.status(500).json({ error: 'Failed to update laptop' });
  }
});

// DELETE /laptops/:id - delete laptop (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const laptop = await Laptop.findByPk(req.params.id);
    if (!laptop) {
      return res.status(404).json({ error: 'Laptop not found' });
    }
    await laptop.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Failed to delete laptop:', error.message);
    res.status(500).json({ error: 'Failed to delete laptop' });
  }
});

module.exports = router;
