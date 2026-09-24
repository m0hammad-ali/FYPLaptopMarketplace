#!/bin/bash
# =====================================================
# Laptop Marketplace - Startup Script
# Starts all services in dependency order
# =====================================================

set -e  # Exit on error (but we handle errors manually below)

PROJECT_DIR="$HOME/Documents/fyp/laptop-marketplace"
cd "$PROJECT_DIR"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info()    { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[OK]${NC} $1"; }
log_warn()    { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error()   { echo -e "${RED}[ERROR]${NC} $1"; }

# Wait for a container to be healthy
wait_for_healthy() {
  local container="$1"
  local max_wait="${2:-90}"
  local elapsed=0
  
  log_info "Waiting for $container to be healthy (max ${max_wait}s)..."
  while [ $elapsed -lt $max_wait ]; do
    local status=$(docker inspect --format='{{.State.Health.Status}}' "$container" 2>/dev/null || echo "unknown")
    if [ "$status" = "healthy" ]; then
      log_success "$container is healthy"
      return 0
    fi
    sleep 3
    elapsed=$((elapsed + 3))
  done
  log_error "$container did not become healthy in ${max_wait}s"
  return 1
}

# Wait for HTTP endpoint
wait_for_http() {
  local url="$1"
  local max_wait="${2:-60}"
  local elapsed=0
  
  while [ $elapsed -lt $max_wait ]; do
    if curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null | grep -q "200"; then
      return 0
    fi
    sleep 2
    elapsed=$((elapsed + 2))
  done
  return 1
}

# =====================================================
# Step 1: Verify Docker is running
# =====================================================
echo ""
echo "=========================================="
echo "  Laptop Marketplace - Starting Stack"
echo "=========================================="
echo ""

log_info "Step 1/6: Checking Docker..."
if ! docker info > /dev/null 2>&1; then
  log_error "Docker is not running."
  log_error "Please start Docker Desktop and try again."
  exit 1
fi
log_success "Docker is running"

# =====================================================
# Step 2: Start the database first
# =====================================================
echo ""
log_info "Step 2/6: Starting database..."
docker-compose up -d db

if ! wait_for_healthy "laptop-db" 90; then
  log_error "Database failed to start. Check: docker-compose logs db"
  exit 1
fi

# =====================================================
# Step 3: Start backend services in dependency order
# =====================================================
echo ""
log_info "Step 3/6: Starting backend services..."

# Core backend services (depend on DB)
docker-compose up -d auth-service catalog-service inventory-service location-service

# Wait for core services
log_info "Waiting for core backend services..."
sleep 15

# Recommendation service (depends on catalog)
docker-compose up -d recommendation-service
docker-compose up -d notification-service

# Wait for recommendation service to load data
sleep 10

# API Gateway (depends on all backends)
docker-compose up -d api-gateway
sleep 8

# =====================================================
# Step 4: Verify backend health
# =====================================================
echo ""
log_info "Step 4/6: Verifying backend health..."

BACKEND_PORTS=(5000 5001 5002 5003 5004 5005 5006)
BACKEND_NAMES=(api-gateway auth-service catalog-service inventory-service recommendation-service notification-service location-service)
ALL_BACKENDS_OK=true

for i in "${!BACKEND_PORTS[@]}"; do
  port="${BACKEND_PORTS[$i]}"
  name="${BACKEND_NAMES[$i]}"
  if wait_for_http "http://localhost:$port/health" 30; then
    log_success "  $name (port $port) OK"
  else
    log_error "  $name (port $port) FAILED"
    ALL_BACKENDS_OK=false
  fi
done

if [ "$ALL_BACKENDS_OK" = false ]; then
  log_warn "Some backends failed. You may need to restart them manually:"
  log_warn "  docker-compose restart <service-name>"
fi

# =====================================================
# Step 5: Start frontends
# =====================================================
echo ""
log_info "Step 5/6: Starting frontends..."

docker-compose up -d home customer vendor admin auth
sleep 20

# =====================================================
# Step 6: Final verification
# =====================================================
echo ""
log_info "Step 6/6: Final verification..."
echo ""

echo "=== Container Status ==="
docker-compose ps

echo ""
echo "=== Frontend Health ==="
FRONTEND_PORTS=(3000 3001 3002 3003 3004)
FRONTEND_NAMES=("Home" "Customer" "Vendor" "Admin" "Auth")
ALL_FRONTENDS_OK=true

for i in "${!FRONTEND_PORTS[@]}"; do
  port="${FRONTEND_PORTS[$i]}"
  name="${FRONTEND_NAMES[$i]}"
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$port" 2>/dev/null)
  if [ "$code" = "200" ]; then
    log_success "  $name (port $port) OK"
  else
    log_error "  $name (port $port) HTTP $code"
    ALL_FRONTENDS_OK=false
  fi
done

# =====================================================
# Summary
# =====================================================
echo ""
echo "=========================================="
if [ "$ALL_BACKENDS_OK" = true ] && [ "$ALL_FRONTENDS_OK" = true ]; then
  echo -e "${GREEN}  All services started successfully!${NC}"
else
  echo -e "${YELLOW}  Stack started with some warnings${NC}"
fi
echo "=========================================="
echo ""
echo "Open in browser:"
echo "  Home:     http://localhost:3000"
echo "  Customer: http://localhost:3001"
echo "  Vendor:   http://localhost:3002"
echo "  Admin:    http://localhost:3003"
echo "  Auth:     http://localhost:3004"
echo ""
echo "API Gateway: http://localhost:5000/health"
echo ""
echo "To view logs:  docker-compose logs -f <service>"
echo "To stop all:   ./scripts/stop.sh"
echo ""

