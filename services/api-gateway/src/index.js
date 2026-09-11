const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));

const port = process.env.PORT || 5000;

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'api-gateway' });
});

app.listen(port, () => {
  console.log(`API Gateway running on port ${port}`);
});
