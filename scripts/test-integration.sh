#!/bin/bash

API="http://localhost:5000"
PASS=0
FAIL=0

check() {
  local name="$1" expected="$2" actual="$3"
  if [ "$expected" = "$actual" ]; then
    echo "  OK  $name"
    PASS=$((PASS+1))
  else
    echo "  X   $name (expected '$expected', got '$actual')"
    FAIL=$((FAIL+1))
  fi
}

echo "=========================================="
echo " Laptop Marketplace - Integration Tests"
echo "=========================================="
echo ""

echo "-- Backend Health --"
for port in 5000 5001 5002 5003 5004 5005 5006; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$port/health")
  check "Port $port" "200" "$code"
done

echo ""
echo "-- Frontend Health --"
for port in 3000 3001 3002 3003 3004; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$port")
  check "Port $port" "200" "$code"
done

echo ""
echo "-- Public Catalog --"
FEATURED=$(curl -s "$API/api/laptops/featured")
FEATURED_COUNT=$(echo "$FEATURED" | python -c "import json,sys; print(len(json.load(sys.stdin)))" 2>/dev/null || echo 0)
check "Featured laptops returns data" "yes" "$([ "$FEATURED_COUNT" -gt 0 ] && echo yes || echo no)"

CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API/api/laptops")
check "Full catalog requires auth" "401" "$CODE"

echo ""
echo "-- Auth Flow --"
EMAIL="integration-$(date +%s)@example.com"
REG=$(curl -s -X POST "$API/api/auth/register" -H "Content-Type: application/json" -d "{\"email\":\"$EMAIL\",\"password\":\"test123\",\"role\":\"customer\"}")
TOKEN=$(echo "$REG" | python -c "import json,sys; print(json.load(sys.stdin).get('token',''))" 2>/dev/null)
check "Register returns token" "yes" "$([ -n "$TOKEN" ] && echo yes || echo no)"

LOGIN=$(curl -s -X POST "$API/api/auth/login" -H "Content-Type: application/json" -d "{\"email\":\"$EMAIL\",\"password\":\"test123\"}")
TOKEN2=$(echo "$LOGIN" | python -c "import json,sys; print(json.load(sys.stdin).get('token',''))" 2>/dev/null)
check "Login returns token" "yes" "$([ -n "$TOKEN2" ] && echo yes || echo no)"

echo ""
echo "-- Authenticated Catalog --"
CODE=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer $TOKEN2" "$API/api/laptops")
check "Authenticated catalog returns 200" "200" "$CODE"

echo ""
echo "-- Recommendation Engine --"
RESP=$(curl -s -X POST "$API/api/recommend" -H "Content-Type: application/json" -d '{"budget": 400000, "usage": "gaming", "top_k": 3}')
COUNT=$(echo "$RESP" | python -c "import json,sys; print(len(json.load(sys.stdin).get('recommendations',[])))" 2>/dev/null || echo 0)
check "Returns recommendations" "yes" "$([ "$COUNT" -gt 0 ] && echo yes || echo no)"

echo ""
echo "-- Notification Service --"
WA=$(curl -s -X POST "$API/api/notify/whatsapp-link" -H "Content-Type: application/json" -d '{"phone":"923001234567","laptop_brand":"HP","laptop_model":"X"}')
HAS_URL=$(echo "$WA" | python -c "import json,sys; print('yes' if 'url' in json.load(sys.stdin) else 'no')" 2>/dev/null || echo no)
check "WhatsApp link generated" "yes" "$HAS_URL"

echo ""
echo "-- Input Validation --"
CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$API/api/auth/register" -H "Content-Type: application/json" -d '{"email":"not-an-email","password":"123"}')
check "Invalid email rejected" "400" "$CODE"

echo ""
echo "=========================================="
echo " Results: $PASS passed, $FAIL failed"
echo "=========================================="

[ "$FAIL" -eq 0 ] && exit 0 || exit 1
