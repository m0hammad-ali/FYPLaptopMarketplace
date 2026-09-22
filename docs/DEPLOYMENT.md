# GCP Cloud Run Deployment Guide

Deploy the entire Laptop Marketplace to Google Cloud Platform using serverless
Cloud Run and managed Cloud SQL.

## Prerequisites

- GCP account with billing enabled (free tier works)
- gcloud CLI installed and authenticated
- Docker Desktop running
- Project images buildable locally

## Step 1: Enable APIs

```bash
gcloud services enable \
  run.googleapis.com \
  sqladmin.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  secretmanager.googleapis.com
```

## Step 2: Create Artifact Registry Repository

```bash
gcloud artifacts repositories create laptop-marketplace \
  --repository-format=docker \
  --location=us-central1 \
  --description="Laptop marketplace images"

gcloud auth configure-docker us-central1-docker.pkg.dev
```

## Step 3: Create Cloud SQL Instance

```bash
gcloud sql instances create laptop-db \
  --database-version=POSTGRES_14 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --root-password=YOUR_STRONG_PASSWORD

gcloud sql databases create laptop_marketplace --instance=laptop-db
```

Save the connection name:

```bash
gcloud sql instances describe laptop-db --format="value(connectionName)"
```

Output format: PROJECT_ID:us-central1:laptop-db

## Step 4: Build and Push Images

From the project root:

```bash
export PROJECT_ID="your-gcp-project-id"
export REGISTRY="us-central1-docker.pkg.dev/$PROJECT_ID/laptop-marketplace"

docker build -t $REGISTRY/api-gateway -f services/api-gateway/Dockerfile .
docker build -t $REGISTRY/auth-service -f services/auth-service/Dockerfile .
docker build -t $REGISTRY/catalog-service -f services/catalog-service/Dockerfile .
docker build -t $REGISTRY/inventory-service -f services/inventory-service/Dockerfile .
docker build -t $REGISTRY/location-service -f services/location-service/Dockerfile .
docker build -t $REGISTRY/notification-service -f services/notification-service/Dockerfile .
docker build -t $REGISTRY/recommendation-service -f services/recommendation-service/Dockerfile .

for svc in api-gateway auth-service catalog-service inventory-service \
           location-service notification-service recommendation-service; do
  docker push $REGISTRY/$svc
done
```

## Step 5: Deploy Backend Services to Cloud Run

Deploy each service with Cloud SQL connection:

```bash
export SQL_CONN="$PROJECT_ID:us-central1:laptop-db"
export DB_URL="postgresql://postgres:YOUR_STRONG_PASSWORD@/laptop_marketplace?host=/cloudsql/$SQL_CONN"

gcloud run deploy auth-service \
  --image=$REGISTRY/auth-service \
  --platform=managed \
  --region=us-central1 \
  --allow-unauthenticated \
  --add-cloudsql-instances=$SQL_CONN \
  --set-env-vars="DATABASE_URL=$DB_URL,JWT_SECRET=REPLACE_ME,PORT=5001"
```

Repeat for catalog-service, inventory-service, location-service,
notification-service, and recommendation-service. For recommendation-service,
pass the catalog URL as an env var.

Get all service URLs:

```bash
AUTH_URL=$(gcloud run services describe auth-service --region=us-central1 --format="value(status.url)")
CATALOG_URL=$(gcloud run services describe catalog-service --region=us-central1 --format="value(status.url)")
INVENTORY_URL=$(gcloud run services describe inventory-service --region=us-central1 --format="value(status.url)")
LOCATION_URL=$(gcloud run services describe location-service --region=us-central1 --format="value(status.url)")
NOTIFICATION_URL=$(gcloud run services describe notification-service --region=us-central1 --format="value(status.url)")
RECOMMENDATION_URL=$(gcloud run services describe recommendation-service --region=us-central1 --format="value(status.url)")
```

## Step 6: Deploy API Gateway

```bash
gcloud run deploy api-gateway \
  --image=$REGISTRY/api-gateway \
  --platform=managed \
  --region=us-central1 \
  --allow-unauthenticated \
  --set-env-vars="JWT_SECRET=REPLACE_ME,AUTH_SERVICE_URL=$AUTH_URL,CATALOG_SERVICE_URL=$CATALOG_URL,INVENTORY_SERVICE_URL=$INVENTORY_URL,LOCATION_SERVICE_URL=$LOCATION_URL,NOTIFICATION_SERVICE_URL=$NOTIFICATION_URL,RECOMMENDATION_SERVICE_URL=$RECOMMENDATION_URL,PORT=5000"
```

Save the API URL:

```bash
export API_URL=$(gcloud run services describe api-gateway --region=us-central1 --format="value(status.url)")
echo "API Gateway: $API_URL"

curl $API_URL/health
```

## Step 7: Seed Cloud SQL

Create a one-off job:

```bash
gcloud run jobs create seed-catalog \
  --image=$REGISTRY/catalog-service \
  --region=us-central1 \
  --add-cloudsql-instances=$SQL_CONN \
  --set-env-vars="DATABASE_URL=$DB_URL" \
  --command="node" \
  --args="src/seed.js"

gcloud run jobs execute seed-catalog --region=us-central1 --wait
```

## Step 8: Deploy Frontends

Frontends can be deployed to Firebase Hosting or Cloud Run.

For Cloud Run, build with the production API URL baked in:

```bash
docker build \
  --build-arg VITE_API_URL=$API_URL \
  -t $REGISTRY/customer -f apps/customer/Dockerfile .
docker push $REGISTRY/customer

gcloud run deploy customer \
  --image=$REGISTRY/customer \
  --platform=managed \
  --region=us-central1 \
  --allow-unauthenticated \
  --port=3001
```

Repeat for vendor (3002), admin (3003), auth (3004), and home (3000).

## Step 9: Restrict Admin Access (Cloud IAP)

```bash
gcloud run services update admin \
  --region=us-central1 \
  --no-allow-unauthenticated

gcloud run services add-iam-policy-binding admin \
  --region=us-central1 \
  --member="user:your-email@gmail.com" \
  --role="roles/run.invoker"
```

Only the specified Google account can access the admin panel.

## Step 10: Verify Deployment

```bash
curl $API_URL/health
curl $API_URL/api/laptops/featured

curl -X POST $API_URL/api/recommend \
  -H "Content-Type: application/json" \
  -d '{"budget": 400000, "usage": "gaming", "top_k": 3}'
```

## Cost Management

| Component         | Free Tier              | Typical Demo Usage |
| ----------------- | ---------------------- | ------------------ |
| Cloud Run         | 2M requests/month      | Well under         |
| Cloud SQL         | 1 db-f1-micro instance | Covered            |
| Artifact Registry | 500 MB storage         | Covered            |
| Cloud Build       | 120 build-minutes/day  | Covered            |

Estimated monthly cost: $0 for demo usage, ~$10/month for light production.

## Notes

- Store secrets in Secret Manager and reference via --set-secrets
- HTTPS is automatic on Cloud Run
- Cloud Run scales from 0 to max instances based on traffic
- Cloud SQL uses Unix domain socket (no IP whitelisting needed)
