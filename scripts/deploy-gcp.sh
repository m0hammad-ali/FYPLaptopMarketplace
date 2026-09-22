#!/bin/bash
# GCP Deployment Automation
# Usage: ./scripts/deploy-gcp.sh YOUR_PROJECT_ID

set -e

PROJECT_ID="${1:?Usage: $0 PROJECT_ID}"
REGION="us-central1"
REGISTRY="$REGION-docker.pkg.dev/$PROJECT_ID/laptop-marketplace"
SQL_INSTANCE="$PROJECT_ID:$REGION:laptop-db"

echo "=============================================="
echo " Deploying Laptop Marketplace to GCP"
echo "=============================================="
echo "Project: $PROJECT_ID"
echo "Region:  $REGION"
echo "SQL:     $SQL_INSTANCE"
echo ""

BACKEND_SERVICES=(
  api-gateway
  auth-service
  catalog-service
  inventory-service
  location-service
  notification-service
  recommendation-service
)

echo "Step 1: Building and pushing backend images"
echo "----------------------------------------------"

for svc in "${BACKEND_SERVICES[@]}"; do
  echo ""
  echo "--> Building $svc..."
  docker build -t "$REGISTRY/$svc" -f "services/$svc/Dockerfile" .
  echo "--> Pushing $svc..."
  docker push "$REGISTRY/$svc"
done

echo ""
echo "=============================================="
echo " All images pushed"
echo "=============================================="
echo ""
echo "Next steps (manual):"
echo "  1. Deploy each service to Cloud Run (see docs/DEPLOYMENT.md Step 5)"
echo "  2. Deploy API Gateway with service URLs"
echo "  3. Seed Cloud SQL via a Cloud Run job"
echo "  4. Deploy frontends to Firebase Hosting or Cloud Run"
echo "  5. Configure Cloud IAP for admin panel"
echo ""
echo "Done."
