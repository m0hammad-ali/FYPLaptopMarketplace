const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { sequelize } = require('./models');
const laptopRoutes = require('./routes/laptopRoutes');
require('dotenv').config();

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const port = process.env.PORT || 5002;

// Health check with DB connectivity
app.get('/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({
      status: 'ok',
      service: 'catalog-service',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      service: 'catalog-service',
      database: 'disconnected',
      error: error.message,
    });
  }
});

// Routes
app.use('/laptops', laptopRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

// Start server
async function start() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established');

    await sequelize.sync();
    console.log('Database schema synchronized');

    app.listen(port, () => {
      console.log(`Catalog Service running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start service:', error.message);
    process.exit(1);
  }
}

start();
