# Frequently Asked Questions

## General

### Q: What is the Laptop Marketplace?

The Laptop Marketplace is an AI-powered platform designed to reduce information asymmetry in the local laptop market by combining personalized recommendations with transparent local pricing and vendor visibility.

### Q: Who are the primary users?

The system supports three principal user roles: customers, vendors, and administrators.

### Q: Is the platform free to run locally?

Yes. The system can be run locally using Docker Compose, and production deployment may be configured to use the free-tier offerings of Google Cloud Run.

## Technical

### Q: Why is a microservice architecture used?

1. Fault isolation: a failure in one service does not compromise the entire platform
2. Independent scaling: the recommendation service can scale independently of authentication and inventory services
3. Technology heterogeneity: Python is used for AI processing, while Node.js is used for web and API workloads

### Q: Why adopt a tri-stack architecture?

The platform separates concerns across three technical layers: React for the user interface, Node.js for I/O-intensive backend processing, and Python for machine learning and similarity computation.

### Q: Why use PostgreSQL?

PostgreSQL provides robust relational data storage with ACID guarantees, which are essential for inventory consistency and price-history tracking.

### Q: Why are there no cross-service foreign keys?

The system deliberately avoids cross-service database constraints in order to preserve service independence. Isolation is enforced through application-level logic and the x-user-id header.

## Artificial Intelligence

### Q: What recommendation algorithm is employed?

The system uses content-based filtering with weighted cosine similarity.

### Q: How accurate is the recommendation engine?

The evaluation achieved a Precision@3 score of 0.933 on a five-query validation set, exceeding the target threshold of 0.85.

### Q: Why choose cosine similarity instead of Euclidean distance?

Cosine similarity outperformed Euclidean distance on the primary evaluation metric by 6.6 percentage points.

### Q: How fast is the recommendation service?

The system achieved a p95 latency of 28.77 ms under 100 concurrent users during k6 testing.

## Deployment

### Q: How can the platform be run locally?

```bash
pnpm install
docker-compose up -d --build
sleep 30
docker-compose exec catalog-service node src/seed.js
```

### Q: How is deployment performed on GCP?

The complete deployment process is described in [docs/DEPLOYMENT.md](DEPLOYMENT.md).

### Q: What is the expected cost?

The platform can operate at $0 for demonstration-scale use under free-tier allowances, with a typical light production deployment costing approximately $10 per month.

## Security

### Q: Is the system secure?

Yes. The implementation was evaluated using OWASP ZAP and reported zero high-severity findings.

### Q: How is vendor isolation enforced?

The API Gateway validates the JWT and injects the x-user-id header. Downstream services use this header to ensure that vendors can access only their own inventory and shop records.

## Troubleshooting

### Q: Why is the auth service restarting?

Check whether the Docker volume configuration includes /app/node_modules appropriately:

```bash
grep -A 15 "^  auth-service:" docker-compose.yml
```

### Q: Why does port 3004 return an error?

Inspect the service logs:

```bash
docker-compose logs --tail=20 auth
```

### Q: Why does the recommendation service display a data not loaded error?

Restart the service and review the logs:

```bash
docker-compose restart recommendation-service
sleep 10
docker-compose logs --tail=5 recommendation-service
```

### Q: Why do I receive a rate-limit error (429)?

The development environment is configured with a request threshold of 500 per period. If the limit is exceeded, wait a few minutes or restart the gateway and auth services:

```bash
docker-compose restart auth-service api-gateway
```

### Q: What if the database has been wiped?

Reseed the catalog and location services:

```bash
docker-compose exec catalog-service node src/seed.js
docker-compose exec location-service node src/seed.js
docker-compose restart recommendation-service
```

## Development

### Q: How can a new laptop entry be added?

```bash
curl -X POST http://localhost:5000/api/laptops \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin-token>" \
  -d '{"brand":"...","model":"...","specification":{...}}'
```

### Q: How can the project be reset?

```bash
./scripts/reset.sh          # soft reset
./scripts/reset.sh --hard   # full rebuild with reseed
```
