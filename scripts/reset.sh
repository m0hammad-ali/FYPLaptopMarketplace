#!/bin/bash
# Universal reset script
# Usage: ./scripts/reset.sh [--full]

set -e
cd "$(dirname "$0")/.."

echo "=========================================="
echo " Laptop Marketplace - Full Reset"
echo "=========================================="
echo ""

if [ "$1" == "--full" ]; then
  echo "Step 1: Full Docker cleanup (destroys DB)..."
  docker-compose down -v --remove-orphans
  docker builder prune -af
  docker image prune -af
  echo "  Done."
else
  echo "Step 1: Partial cleanup (keeps DB)..."
  docker-compose down --remove-orphans
  echo "  Done."
fi

echo ""
echo "Step 2: Rebuilding and starting all services..."
docker-compose up -d --build

echo ""
echo "Step 3: Waiting for services to be healthy..."
for i in {1..30}; do
  HEALTHY=$(docker-compose ps --format json 2>/dev/null | grep -c '"Health":"healthy"' || echo "0")
  echo "  Attempt $i: $HEALTHY healthy containers"
  if [ "$HEALTHY" -ge 5 ]; then
    break
  fi
  sleep 5
done

echo ""
echo "Step 4: Seeding database..."
sleep 10

docker-compose exec -T catalog-service node src/seed.js 2>&1 | tail -5 || echo "  (catalog seed skipped)"
docker-compose exec -T location-service node src/seed.js 2>&1 | tail -3 || echo "  (location seed skipped)"

docker-compose restart recommendation-service > /dev/null
sleep 15

echo ""
echo "Step 5: Health check..."
for port in 5000 5001 5002 5003 5004 5005 5006; do
  echo -n "  Port $port: "
  curl -s "http://localhost:$port/health" | python -c "import json,sys; print(json.load(sys.stdin).get('status','?'))" 2>/dev/null || echo "FAILED"
done

echo ""
echo "Step 6: Frontend check..."
for port in 3000 3001 3002 3003 3004; do
  echo -n "  Port $port: "
  curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:$port"
done

echo ""
echo "=========================================="
echo " Reset complete"
echo "=========================================="
