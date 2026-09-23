#!/bin/bash
# Ensure database schema matches Sequelize models

cd "$(dirname "$0")/.."

echo "=== Ensuring schema sync ==="

echo ""
echo "1. Sync auth-service schema..."
docker-compose exec -T auth-service node -e "
const { sequelize } = require('./src/models');
sequelize.sync({ alter: true }).then(() => {
  console.log('auth-service: schema synced');
  process.exit(0);
}).catch(err => {
  console.error('auth-service sync failed:', err.message);
  process.exit(1);
});
"

echo ""
echo "2. Sync catalog-service schema..."
docker-compose exec -T catalog-service node -e "
const { sequelize } = require('./src/models');
sequelize.sync().then(() => {
  console.log('catalog-service: schema synced');
  process.exit(0);
}).catch(err => {
  console.error('catalog-service sync failed:', err.message);
  process.exit(1);
});
"

echo ""
echo "3. Sync inventory-service schema..."
docker-compose exec -T inventory-service node -e "
const { sequelize } = require('./src/models');
sequelize.sync({ alter: true }).then(() => {
  console.log('inventory-service: schema synced');
  process.exit(0);
}).catch(err => {
  console.error('inventory-service sync failed:', err.message);
  process.exit(1);
});
"

echo ""
echo "4. Sync location-service schema..."
docker-compose exec -T location-service node -e "
const { sequelize } = require('./src/models');
sequelize.sync({ alter: true }).then(() => {
  console.log('location-service: schema synced');
  process.exit(0);
}).catch(err => {
  console.error('location-service sync failed:', err.message);
  process.exit(1);
});
"

echo ""
echo "=== Schema sync complete ==="
