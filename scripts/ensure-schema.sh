#!/bin/bash
# Ensure all service schemas are initialized
# Usage: ./scripts/ensure-schema.sh

set -e
cd "$(dirname "$0")/.."

echo "Ensuring schemas are initialized..."

# 1. Auth service first (creates users table with proper columns)
echo "  → Auth service schema..."
docker-compose exec -T auth-service node -e "
const { sequelize } = require('./src/models');
sequelize.sync({ alter: true }).then(() => {
  console.log('    Auth OK');
  process.exit(0);
}).catch(err => {
  console.error('    Auth FAILED:', err.message);
  process.exit(1);
});
"

# 2. Catalog service
echo "  → Catalog service schema..."
docker-compose exec -T catalog-service node -e "
const { sequelize } = require('./src/models');
sequelize.sync({ alter: true }).then(() => {
  console.log('    Catalog OK');
  process.exit(0);
}).catch(err => {
  console.error('    Catalog FAILED:', err.message);
  process.exit(1);
});
"

# 3. Inventory service
echo "  → Inventory service schema..."
docker-compose exec -T inventory-service node -e "
const { sequelize } = require('./src/models');
sequelize.sync({ alter: true }).then(() => {
  console.log('    Inventory OK');
  process.exit(0);
}).catch(err => {
  console.error('    Inventory FAILED:', err.message);
  process.exit(1);
});
"

# 4. Location service
echo "  → Location service schema..."
docker-compose exec -T location-service node -e "
const { sequelize } = require('./src/models');
sequelize.sync({ alter: true }).then(() => {
  console.log('    Location OK');
  process.exit(0);
}).catch(err => {
  console.error('    Location FAILED:', err.message);
  process.exit(1);
});
"

echo ""
echo "All schemas initialized"
