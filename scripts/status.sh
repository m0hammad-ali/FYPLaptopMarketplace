#!/bin/bash
# =====================================================
# Laptop Marketplace - Status Check
# =====================================================

cd "$HOME/Documents/fyp/laptop-marketplace"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo ""
echo "=========================================="
echo "  Laptop Marketplace - System Status"
echo "=========================================="
echo ""

echo -e "${BLUE}Containers:${NC}"
docker-compose ps
echo ""

echo -e "${BLUE}Backend Health:${NC}"
for port in 5000 5001 5002 5003 5004 5005 5006; do
  status=$(curl -s "http://localhost:$port/health" 2>/dev/null | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
  if [ "$status" = "ok" ]; then
    echo -e "  ${GREEN}OK${NC}   Port $port"
  else
    echo -e "  ${RED}FAIL${NC} Port $port"
  fi
done
echo ""

echo -e "${BLUE}Frontend Health:${NC}"
for port in 3000 3001 3002 3003 3004; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$port" 2>/dev/null)
  if [ "$code" = "200" ]; then
    echo -e "  ${GREEN}OK${NC}   Port $port (HTTP $code)"
  else
    echo -e "  ${RED}FAIL${NC} Port $port (HTTP $code)"
  fi
done
echo ""

echo -e "${BLUE}Database:${NC}"
count=$(curl -s http://localhost:5002/laptops 2>/dev/null | python -c "import json,sys; print(len(json.load(sys.stdin)))" 2>/dev/null || echo "?")
echo "  Laptops in catalog: $count"
echo ""

echo -e "${BLUE}AI Engine:${NC}"
rec_count=$(curl -s -X POST http://localhost:5004/recommend \
  -H "Content-Type: application/json" \
  -d '{"budget":400000,"usage":"gaming","top_k":3}' 2>/dev/null \
  | python -c "import json,sys; print(len(json.load(sys.stdin).get('recommendations',[])))" 2>/dev/null || echo "?")
echo "  Sample recommendation count: $rec_count"
echo ""

