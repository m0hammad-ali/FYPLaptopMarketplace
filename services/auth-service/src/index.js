const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { sequelize } = require('./models');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const port = process.env.PORT || 5001;

// Health check with DB connectivity
app.get('/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({
      status: 'ok',
      service: 'auth-service',
      database: 'connected',
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      service: 'auth-service',
      database: 'disconnected',
      error: error.message,
    });
  }
});

app.use('/', authRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('[AUTH ERROR]', err.message);
  res.status(err.status || 500).json({ error: err.message || 'Internal error' });
});

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Auth DB connected');
    await sequelize.sync({ alter: true });
    console.log('Auth schema synced');

    app.listen(port, () => {
      console.log(`Auth Service running on port ${port}`);
    });
  } catch (error) {
    console.error('Auth service failed to start:', error.message);
    process.exit(1);
  }
}

start();
