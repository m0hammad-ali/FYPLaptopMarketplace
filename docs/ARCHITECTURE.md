# System Architecture

## Overview

The Laptop Marketplace is a tri-stack microservices application with:

- 5 frontends: 1 Next.js public site + 4 React SPAs
- 7 backends: 6 Node.js/Express services + 1 Python/FastAPI service
- 1 database: PostgreSQL 14 with 9 tables in 3NF
- Containerization: 13 Docker containers orchestrated with Docker Compose

## Layer Diagram

```
                Frontend Microfrontends
   Home (3000) | Customer (3001) | Vendor (3002)
   Admin (3003) | Auth (3004)
                          |
                          v
             +-----------------------+
             |   API Gateway (5000)  |
             |  Express + JWT + Helmet|
             +-----------+-----------+
                         |
     +-----------+-------+-------+-----------+-----------+
     v           v       v       v           v           v
 +--------+ +--------+ +--------+ +--------+ +--------+ +--------+
 | Auth   | |Catalog | |Invent. | |Recommend| |Notify | |Location|
 | (5001) | | (5002) | | (5003) | | (5004)  | | (5005) | | (5006) |
 +----+---+ +----+---+ +----+---+ +---------+ +--------+ +----+---+
      |          |          |                                 |
      +----------+----------+---------------+-----------------+
                                            v
                                  +------------------+
                                  |  PostgreSQL 14   |
                                  |  9 tables in 3NF |
                                  +------------------+
```

## Key Architectural Decisions

### 1. Monorepo with pnpm Workspaces

All apps and services live in one repository, sharing code via `packages/`.

- Pros: atomic commits, unified tooling, shared design system
- Cons: larger clone size, more complex CI

### 2. Microservices over Monolith

Each service has a single responsibility and can be deployed independently.

- Fault isolation: if AI service crashes, marketplace still works
- Independent scaling: scale recommendation service without scaling auth
- Technology heterogeneity: Python for AI, Node.js for I/O

### 3. API Gateway Pattern

Single entry point handles routing, auth, rate limiting, CORS.

- Frontends only know one URL
- Backend topology can change without frontend updates

### 4. JWT Authentication

Stateless tokens with role claims. No session store needed.

- API Gateway verifies tokens using jsonwebtoken
- Injects x-user-id and x-user-role headers to downstream services

### 5. No Cross-Service Foreign Keys

shops.vendor_id and inventory.vendor_id are logical references (store user_id)
but have no database FK constraint.

- Reason: microservices should be independently deployable
- Enforcement: application-layer isolation via x-user-id header

### 6. In-Memory Feature Vectors

The recommendation service loads all laptops on startup and holds feature
vectors in memory.

- Benefit: no database hits during /recommend requests
- Result: sub-30ms p95 latency at 100 concurrent users (verified with k6)

### 7. Category-Based Ground Truth for Evaluation

Precision@K uses category as relevance, not manual IDs.

- Benefit: self-documenting, extensible, reproducible
- Limitation: does not distinguish quality within a category

## Data Flow: Recommendation Request

1. Customer submits preferences in UI
2. Frontend POSTs to /api/recommend via API Gateway
3. Gateway forwards to Recommendation Service on port 5004
4. Service:
   a. Filters laptops by budget and minimum specs
   b. Builds user vector from preferences
   c. Computes weighted cosine similarity
   d. Sorts and returns top-K
5. Frontend renders result cards with WhatsApp contact buttons

## Data Flow: Vendor Adds Inventory

1. Vendor submits form (laptop_id, price, stock)
2. Frontend POSTs to /api/inventory with JWT
3. Gateway verifies JWT, injects x-user-id header
4. Inventory Service:
   a. Verifies role is vendor
   b. Creates inventory row with vendor_id = x-user-id
   c. Logs price to price_history within a transaction
5. Response returns to vendor dashboard

## Technology Stack

| Layer                   | Technology                                       |
| ----------------------- | ------------------------------------------------ |
| Public frontend         | Next.js 13, React 18, Tailwind 3.4, Lucide icons |
| Authenticated frontends | React 18, Vite 5, Tailwind 3.4, Lucide icons     |
| Backend runtime         | Node.js 18 LTS                                   |
| Backend framework       | Express 4.18                                     |
| AI framework            | FastAPI 0.104, Python 3.10                       |
| AI libraries            | Pandas, NumPy, scikit-learn                      |
| Database                | PostgreSQL 14 (3NF)                              |
| ORM                     | Sequelize 6                                      |
| Auth                    | JWT with bcrypt                                  |
| Container               | Docker, Docker Compose                           |
| Deployment target       | Google Cloud Platform (Cloud Run + Cloud SQL)    |

## Security Layers

| Layer             | Implementation                     |
| ----------------- | ---------------------------------- |
| HTTP headers      | Helmet on all Node services        |
| Authentication    | JWT (7-day expiry)                 |
| Password storage  | bcrypt (work factor 10)            |
| Rate limiting     | 100/min global, 20/15min auth      |
| Input validation  | express-validator                  |
| Sanitization      | Strips $ and . keys from bodies    |
| SQL safety        | Sequelize parameterized queries    |
| Role-based access | JWT claims + middleware            |
| IP restriction    | Admin IP allowlist                 |
| HTTPS             | Cloud Run managed TLS (production) |

## Deployment Architecture

| Component             | GCP Service                  |
| --------------------- | ---------------------------- |
| Backend microservices | Cloud Run                    |
| Frontends             | Cloud Run + Firebase Hosting |
| Database              | Cloud SQL (PostgreSQL 14)    |
| Container images      | Artifact Registry            |
| Secrets               | Secret Manager               |
| Admin restriction     | Cloud IAP                    |
| CI/CD                 | Cloud Build                  |

See docs/DEPLOYMENT.md for the full guide.
