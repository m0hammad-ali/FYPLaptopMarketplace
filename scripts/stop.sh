#!/bin/bash
# =====================================================
# Laptop Marketplace - Stop Script
# =====================================================

cd "$HOME/Documents/fyp/laptop-marketplace"

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}[INFO]${NC} Stopping all containers (data preserved)..."
docker-compose stop

echo ""
echo -e "${GREEN}[OK]${NC} All containers stopped."
echo "To restart: ./scripts/start.sh"
echo "To wipe data: docker-compose down -v  (WARNING: deletes database)"
