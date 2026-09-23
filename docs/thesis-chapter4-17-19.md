# Thesis Sections 4.17 and 4.19

## Section 4.17 - Cloud Deployment Architecture

The application is designed for deployment on Google Cloud Platform using a serverless, container-based architecture.

### Table 4.25: GCP Service Mapping

| Component             | GCP Service                  | Purpose                           |
| --------------------- | ---------------------------- | --------------------------------- |
| Backend microservices | Cloud Run                    | serverless container hosting      |
| Frontends             | Cloud Run + Firebase Hosting | static and SSR hosting            |
| Database              | Cloud SQL (PostgreSQL 14)    | managed relational database       |
| Container images      | Artifact Registry            | Docker image storage              |
| Secrets               | Secret Manager               | encrypted credential storage      |
| Admin access control  | Cloud IAP                    | identity-based access restriction |
| CI/CD                 | Cloud Build                  | automated image build on push     |

### Table 4.26: Cloud Run Configuration

| Service                | Memory | CPU | Min Instances | Max Instances |
| ---------------------- | ------ | --- | ------------- | ------------- |
| api-gateway            | 256 MB | 1   | 0             | 10            |
| auth-service           | 256 MB | 1   | 0             | 5             |
| catalog-service        | 256 MB | 1   | 0             | 5             |
| inventory-service      | 256 MB | 1   | 0             | 5             |
| recommendation-service | 512 MB | 1   | 0             | 3             |

### Key Architectural Choices

1. Serverless deployment: Cloud Run can scale to zero when idle, reducing cost and improving efficiency.
2. Auto-scaling: the platform scales dynamically under increased traffic.
3. Managed database: Cloud SQL handles backup, patching, and high availability.
4. Private networking: services access the database through Cloud SQL connections.
5. Admin isolation: Cloud IAP restricts admin access to verified identities.

### Cost Profile

Under the free-tier model, light demo usage can operate at $0 per month. For modest production usage beyond the free tier, the estimated operating cost is approximately $10 per month.

### Deployment Workflow

1. build Docker images for each service
2. push images to Artifact Registry
3. deploy services using gcloud run deploy
4. seed Cloud SQL with the application data
5. configure Cloud IAP for admin access restrictions

The complete deployment guide is available in [docs/DEPLOYMENT.md](DEPLOYMENT.md).

---

## Section 4.19 - OWASP ZAP Security Scan Results

A baseline security scan was performed using OWASP ZAP against the API Gateway.

### Table 4.27: ZAP Scan Findings

| Risk Level      | Count |
| --------------- | ----- |
| FAIL-NEW (High) | 0     |
| WARN-NEW (Low)  | 1     |
| INFO            | 0     |
| PASS            | 66    |
| Total Checks    | 67    |

### Key Finding

No high-severity issues were identified, and all 66 checks passed successfully.

The single warning is informational and relates to the API Gateway returning HTTP 404 responses for non-API paths, which is expected and does not indicate a security vulnerability.

### Security Controls in Place

- HTTP headers via Helmet (13 headers total)
- rate limiting at 100 requests/minute globally and 20 requests/15 minutes for auth routes
- input validation via express-validator
- sanitization middleware strips unsafe keys
- JWT authentication with 7-day expiry
- password hashing using bcrypt with work factor 10
- SQL injection prevention via Sequelize parameterized queries
- admin protection via IP allowlist and role-based access control

### Conclusion

The scan confirms that the API is resistant to common web application attacks and satisfies the project’s security requirements for the current implementation.
