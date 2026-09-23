#!/bin/bash
# Quick health check for all services
# Usage: ./scripts/health.sh

cd "$(dirname "$0")/.."

echo "=========================================="
echo " System Health Check"
echo "=========================================="
echo ""

echo "── Containers ──"
docker-compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}" | head -15

echo ""
echo "── Backend Services ──"
for port in 5000 5001 5002 5003 5004 5005 5006; do
  echo -n "  Port $port: "
  curl -s -m 5 "http://localhost:$port/health" | python -c "import json,sys; print(json.load(sys.stdin).get('status','FAILED'))" 2>/dev/null || echo "FAILED"
done

echo ""
echo "── Frontend Apps ──"
for port in 3000 3001 3002 3003 3004; do
  echo -n "  Port $port: "
  curl -s -m 5 -o /dev/null -w "%{http_code}\n" "http://localhost:$port" || echo "FAILED"
done

echo ""
echo "── Database ──"
echo -n "  Laptops: "
curl -s -m 5 http://localhost:5002/laptops | python -c "import json,sys; print(len(json.load(sys.stdin)))" 2>/dev/null || echo "?"

echo -n "  Shops: "
curl -s -m 5 http://localhost:5006/shops | python -c "import json,sys; print(len(json.load(sys.stdin)))" 2>/dev/null || echo "?"

echo ""
echo "=========================================="
