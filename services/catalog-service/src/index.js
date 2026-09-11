const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const port = process.env.PORT || 5002;

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'catalog-service' });
});

app.listen(port, () => {
  console.log(`Catalog Service running on port ${port}`);
});
