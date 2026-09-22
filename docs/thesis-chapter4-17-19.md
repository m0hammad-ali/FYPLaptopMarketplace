# Thesis Sections 4.17 and 4.19

## Section 4.17 - Cloud Deployment Architecture

The application is designed for deployment on Google Cloud Platform using a
serverless, container-based architecture.

### Table 4.25: GCP Service Mapping

| Component | GCP Service | Purpose |
|-----------|-------------|---------|
| Backend microservices | Cloud Run | Serverless container hosting |
| Frontends | Cloud Run + Firebase Hosting | Static and SSR hosting |
| Database | Cloud SQL (PostgreSQL 14) | Managed relational database |
| Container images | Artifact Registry | Docker image storage |
| Secrets | Secret Manager | Encrypted credential storage |
| Admin access control | Cloud IAP | Identity-based access restriction |
| CI/CD | Cloud Build | Automated image build on push |

### Table 4.26: Cloud Run Configuration

| Service | Memory | CPU | Min Instances | Max Instances |
|---------|--------|-----|---------------|---------------|
| api-gateway | 256 MB | 1 | 0 | 10 |
| auth-service | 256 MB | 1 | 0 | 5 |
| catalog-service | 256 MB | 1 | 0 | 5 |
| inventory-service | 256 MB | 1 | 0 | 5 |
| recommendation-service | 512 MB | 1 | 0 | 3 |

### Key Architectural Choices

1. Serverless: Cloud Run scales to zero when idle, minimizing cost.
2. Auto-scaling: Scales up to 10 instances under load.
3. Managed database: Cloud SQL handles backups, patching, and HA.
4. Private networking: Services reach Cloud SQL via Unix socket.
5. Admin isolation: Cloud IAP restricts admin panel to allowlisted accounts.

### Cost Profile

Under the free tier, the deployment runs at $0/month for typical demo traffic.
Beyond free tier, estimated cost is approximately $10/month for light usage.

### Deployment Workflow

1. docker build for each service
2. docker push to Artifact Registry
3. gcloud run deploy for each service
4. Seed Cloud SQL via a one-off Cloud Run job
5. Configure Cloud IAP for the admin panel

The full deployment guide is documented in docs/DEPLOYMENT.md.

---

## Section 4.19 - OWASP ZAP Security Scan Results

A baseline security scan was performed using OWASP ZAP against the API Gateway.

### Table 4.27: ZAP Scan Findings

| Risk Level | Count |
|------------|-------|
| FAIL-NEW (High) | 0 |
| WARN-NEW (Low) | 1 |
| INFO | 0 |
| PASS | 66 |
| Total Checks | 67 |

### Critical Finding

Zero high-severity issues were identified. All 66 security checks passed.

The single WARN is informational ("Storable and Cacheable Content") and relates
to the API Gateway returning HTTP 404 for non-API paths, which is expected.

### Security Controls in Place

- HTTP headers via Helmet (13 headers total)
- Rate limiting: 100/min global, 20/15min auth
- Input validation via express-validator
- Sanitization middleware strips $ and . keys
- JWT authentication with 7-day expiry
- Password hashing with bcrypt (work factor 10)
- SQL injection prevention via Sequelize parameterized queries
- Admin protection via IP allowlist and role check

### Conclusion

The scan confirms the API is resistant to common web application attacks.
