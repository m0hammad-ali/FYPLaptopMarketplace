#!/bin/bash
# Clean reset of the entire stack (keeps database)
# Usage: ./scripts/reset.sh [--hard]

set -e

cd "$(dirname "$0")/.."

HARD=0
if [ "$1" = "--hard" ]; then
  HARD=1
fi

echo "=== Resetting Laptop Marketplace ==="

if [ "$HARD" -eq 1 ]; then
  echo "HARD reset: removing volumes and rebuilding everything"
  docker-compose down -v
  docker system prune -f
  docker-compose up -d --build
  echo ""
  echo "Waiting for DB to be healthy..."
  sleep 30
  echo "Re-seeding database..."
  docker-compose exec catalog-service node src/seed.js
  docker-compose exec location-service node src/seed.js
  docker-compose restart recommendation-service
else
  echo "Soft reset: restarting containers"
  docker-compose down
  docker-compose up -d
fi

sleep 20
echo ""
echo "=== Container status ==="
docker-compose ps
