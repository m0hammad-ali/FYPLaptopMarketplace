#!/bin/bash
# One-command health check for all containers

echo "=========================================="
echo " System Health Check"
echo "=========================================="
echo ""

echo "-- Containers --"
docker-compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}" | head -20

echo ""
echo "-- Backend Services --"
for port in 5000 5001 5002 5003 5004 5005 5006; do
  echo -n "  Port $port: "
  result=$(curl -s "http://localhost:$port/health" 2>/dev/null | python -c "import json,sys; print(json.load(sys.stdin).get('status','?'))" 2>/dev/null || echo "FAILED")
  echo "$result"
done

echo ""
echo "-- Frontend Apps --"
for port in 3000 3001 3002 3003 3004; do
  echo -n "  Port $port: "
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$port" 2>/dev/null)
  echo "$code"
done

echo ""
echo "-- Database --"
echo -n "  Laptops: "
curl -s http://localhost:5002/laptops 2>/dev/null | python -c "import json,sys; print(len(json.load(sys.stdin)))" 2>/dev/null || echo "?"
echo -n "  Shops: "
curl -s http://localhost:5006/shops 2>/dev/null | python -c "import json,sys; print(len(json.load(sys.stdin)))" 2>/dev/null || echo "?"

echo ""
echo "=========================================="
