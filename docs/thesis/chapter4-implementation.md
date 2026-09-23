# CHAPTER 4: IMPLEMENTATION

## 4.1 Development Environment

The project was implemented as a monorepo using pnpm workspaces and Turborepo. The development environment was configured on Windows 11 with WSL2 for Docker compatibility, while VS Code served as the primary development environment. Git was used for version control, and conventional commit standards were enforced through Husky and Commitlint.

The repository structure consists of the following major components:

- apps/ — five frontend applications
- services/ — seven backend services
- packages/ — four shared packages
- infrastructure/ — Docker and GCP configuration files
- scripts/ — automation and utility scripts
- docs/ — project documentation and thesis materials

## 4.2 Tools and Technologies

Table 4.1: Technology Stack

| Layer            | Technology                               |
| ---------------- | ---------------------------------------- |
| Public frontend  | Next.js 13, Tailwind 3.4, Lucide         |
| Auth frontends   | React 18, Vite 5, Tailwind 3.4, Lucide   |
| Backend          | Node.js 18, Express 4.18                 |
| AI               | FastAPI 0.104, Python 3.10, scikit-learn |
| Database         | PostgreSQL 14, Sequelize 6               |
| Authentication   | JWT + bcrypt                             |
| Containerization | Docker, Docker Compose                   |

## 4.3 Docker Setup

The system is deployed using 13 containers in a custom bridge network. The root repository directory serves as the build context to support Docker builds and to ensure compatibility with project-level configuration files such as the root-level .dockerignore file. Docker volumes are used to maintain persistent data while minimizing issues with node_modules during local development.

Table 4.2: Container Inventory

| Container              | Port |
| ---------------------- | ---- |
| laptop-db              | 5432 |
| api-gateway            | 5000 |
| auth-service           | 5001 |
| catalog-service        | 5002 |
| inventory-service      | 5003 |
| recommendation-service | 5004 |
| notification-service   | 5005 |
| location-service       | 5006 |
| home-frontend          | 3000 |
| customer-frontend      | 3001 |
| vendor-frontend        | 3002 |
| admin-frontend         | 3003 |
| auth-frontend          | 3004 |

## 4.4 Database Implementation

The database layer was implemented using Sequelize models distributed across multiple services. Associations are defined within each service boundary, and no cross-service foreign keys are used by design in order to preserve microservice independence.

The main transactional operations include:

- creation of laptop and specification records
- inventory updates and associated price history logging

## 4.5 Data Acquisition

The project uses a Python-based scraper to collect laptop data and price information from priceoye.pk. A total of 120 laptop records were stored with PKR pricing and then enriched using category heuristics and per-model variation logic before being saved to the seed dataset.

## 4.6 AI Recommendation Engine

The recommendation engine is implemented as a FastAPI service comprising three key modules:

- preprocess.py: JSON flattening, MinMaxScaler normalization, OneHotEncoder handling, and derived features such as performance_index, portability, and price_performance
- similarity.py: weighted cosine similarity, Euclidean baseline comparison, and NaN-safe calculations
- user_profile.py: user preference vector generation using dynamic usage weights

The recommendation endpoint accepts a POST request to /recommend and applies hard filtering before returning the top-K results.

The overall computational complexity is O(n log n), where filtering is O(n), similarity calculation is O(n), and sorting is O(n log n).

## 4.7 API Gateway

The API Gateway is implemented using Express and http-proxy-middleware. Proxy routes are registered before express.json() is initialized to preserve request payload integrity during proxy forwarding.

The gateway enforces the following middleware layers:

1. Helmet security headers
2. CORS validation
3. rate limiting (100 requests per minute globally, 20 requests per 15 minutes for authentication routes, and a higher development limit)
4. JWT authentication and injection of x-user-id and x-user-role headers
5. admin IP access validation

## 4.8 Frontend Implementation

The frontend layer consists of five applications:

- Home (Next.js): landing page, feature highlights, product card, map embed, and footer layout
- Customer (React): three-mode interface with Easy, Simple, and Pro flows, recommendation cards, and WhatsApp contact actions
- Vendor (React): inventory and shop management interfaces
- Admin (React): dashboard with summary metrics and vendor verification controls
- Auth (React): tabbed sign-in and sign-up workflow with role-based redirection

## 4.9 Authentication Service

The authentication service uses bcrypt for password hashing with a cost factor of 10, JWT tokens with a seven-day expiry period, express-validator for request validation, and sanitization middleware to defend against malformed input.

## 4.10 Inventory Service

The inventory service enforces vendor isolation by reading the x-user-id header generated by the API Gateway. This ensures that vendors can only access and modify their own records. Price updates are recorded in the price_history table within the same transaction to preserve auditing integrity.

## 4.11 Vendor Dashboard

The vendor dashboard includes two primary tabs: Inventory and Shops. Vendors can add, edit, and delete inventory items and shop records, including GPS coordinates. Toast notifications and a responsive interface improve usability and provide immediate feedback during management operations.

## 4.12 Admin Panel

The admin dashboard includes a dark theme, summary metric cards, and a vendor verification table. Administrative actions are protected by both role-based checks and IP-based restrictions.

## 4.13 Home Page

The home page includes a sticky navigation bar, responsive layout, hero section, statistics panels, feature highlights, featured laptop cards, a process overview section, a Google Maps embed, and a four-column footer.

## 4.14 WhatsApp Integration

The notification service generates wa.me links for direct vendor communication. When the customer clicks the Contact Shop button, the system opens WhatsApp with a pre-filled message containing the selected laptop and relevant vendor details.

## 4.15 Google Maps Integration

The home page embeds a Google Maps iframe to help users locate nearby vendor shops. This approach requires no API key for basic embedding and provides a lightweight geographic overview of the local marketplace.

## 4.16 PWA Implementation

The customer-facing frontend uses vite-plugin-pwa to generate both a manifest and a service worker for offline support. The application is therefore installable as a progressive web app in supported browsers such as Chrome.

## 4.17 Cloud Deployment Architecture

Table 4.12: GCP Service Mapping

| Component | GCP Service          |
| --------- | -------------------- |
| Backend   | Cloud Run            |
| Frontends | Cloud Run + Firebase |
| Database  | Cloud SQL            |
| Images    | Artifact Registry    |
| Secrets   | Secret Manager       |
| Admin     | Cloud IAP            |

The proposed deployment model is serverless, auto-scaling, and fully managed. It separates public-facing services from administrative access, supports private database connectivity, and ensures that admin functions remain restricted to authenticated and authorized users. The overall design is appropriate for local evaluation and potential production deployment.

The estimated cost is $0 under the free tier for basic usage, increasing to approximately $10 per month for light production usage beyond the free-tier threshold.

The complete deployment guide is available in [docs/DEPLOYMENT.md](../DEPLOYMENT.md).

## 4.18 Security Hardening

Table 4.13: Security Layers

| Layer            | Implementation                                                           |
| ---------------- | ------------------------------------------------------------------------ |
| HTTP headers     | Helmet                                                                   |
| Authentication   | JWT                                                                      |
| Password storage | bcrypt                                                                   |
| Rate limiting    | 100 requests/minute globally, 20 requests per 15 minutes for auth routes |
| Validation       | express-validator                                                        |
| Sanitization     | strips unsafe keys                                                       |
| SQL safety       | Sequelize parameterized queries                                          |
| Role access      | JWT claims                                                               |
| IP restriction   | admin allowlist                                                          |

## 4.19 OWASP ZAP Security Scan Results

Table 4.14: ZAP Scan Findings

| Risk Level | Count             |
| ---------- | ----------------- |
| High       | 0                 |
| Low        | 1 (informational) |
| Pass       | 66                |

The scan did not reveal any high-severity findings. The full report is available in [results/zap/zap-summary.md](../../results/zap/zap-summary.md).

## 4.20 CI/CD Pipeline

The project uses GitHub Actions for continuous integration and delivery. The pipeline performs the following steps:

1. checkout the repository
2. set up pnpm and Node.js 18
3. install dependencies using pnpm install --frozen-lockfile
4. validate the docker-compose configuration
5. build all Docker images

## 4.21 Notification Service

The notification service generates click-to-chat WhatsApp links and includes a Twilio-compatible fallback path for future messaging integrations.

## 4.22 Location Service

The location service supports shop CRUD operations with GPS coordinates. The demo dataset includes three sample shop records in Gulhaji Plaza.

## 4.23 Vendor Shop Management

The vendor dashboard includes a dedicated Shops tab where vendors can add, edit, and delete shop entries and view their GPS metadata on cards.

## 4.24 Screenshots

The project documentation includes a screenshot collection in docs/screenshots/ for visual reference and viva demonstration support.

## 4.25 Role-Based Authentication Flow

The platform uses a single authentication application for all user roles. Following login, users are redirected based on their assigned role. Protected routes enforce both role validation and token expiration checks.

## 4.26 Inclusive Design

The customer interface provides three access modes:

- Easy: icon-based experience with speech support and simplified interaction flow
- Simple: plain-language guided recommendation interface
- Pro: detailed technical input for advanced users

All modes route to the same recommendation endpoint and produce a consistent output structure.

## 4.27 Web Data Acquisition

Table 4.15: Data Sources

| Source        | Records    | Status |
| ------------- | ---------- | ------ |
| priceoye.pk   | 201 -> 120 | Active |
| whatmobile.pk | 0          | 404    |

## 4.28 PKR Localization

The system stores all prices in PKR using the price_pkr field. During preprocessing, MinMaxScaler is applied to normalize feature ranges uniformly across the dataset.

## 4.29 Cross-Service Reference Design

The system intentionally avoids direct foreign key constraints between vendor references across services. For example, shops.vendor_id and inventory.vendor_id are logical application references rather than database-level foreign keys. This preserves the microservice design principle of self-contained service data ownership and maintains loose coupling between services.
