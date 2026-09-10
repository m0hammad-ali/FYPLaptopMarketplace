# AI-Powered Laptop Recommendation and Marketplace for Gulhaji Plaza

Final Year Project (Session 2022-2026)  
Institute of Computer Sciences & Information Technology (ICS/IT)  
The University of Agriculture, Peshawar

A web-based platform that combines an AI-powered recommendation engine with a real-time marketplace for laptop vendors in Gulhaji Plaza, Peshawar.

---

## The Problem

Local hardware buyers in Peshawar face information asymmetry:

- Complex hardware specs with no comparison tool
- Opaque pricing across dozens of vendors
- No way to verify stock without visiting each shop
- Vendors lack digital tools for inventory and pricing

## The Solution

A modern, scalable platform that delivers:

- **AI Recommendation** using weighted cosine similarity (Precision@3 >= 0.85)
- **Microservices architecture** - 7 backend services, 5 microfrontends
- **Multi-mode UI** - Voice/Visual, Simple, Pro for every literacy level
- **PKR pricing** with 100+ real laptops scraped from Pakistani marketplaces
- **Production-grade security** - JWT, rate limiting, Helmet, IP restriction
- **Cloud-native** - designed for Google Cloud Run + Cloud SQL

---

## Architecture

```
Frontend Microfrontends
  Home (Next.js) | Customer | Vendor | Admin | Auth
                          |
                          v
                  API Gateway (Express + JWT)
                          |
        +-----------------+-----------------+
        v                 v                 v
   Auth Service    Catalog Service   Inventory Service
        |                 |                 |
        +-----------------+-----------------+
                          v
                  PostgreSQL (3NF)
                          ^
        +-----------------+-----------------+
        v                 v                 v
  Recommendation   Notification     Location
     (Python)        Service          Service
```

See `docs/ARCHITECTURE.md` for detailed diagrams.

---

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm
- Docker Desktop
- Git

### Setup

```bash
# 1. Clone
git clone https://github.com/YOUR-USERNAME/laptop-marketplace.git
cd laptop-marketplace

# 2. Install dependencies
pnpm install

# 3. Start all services
docker-compose up -d --build

# 4. Seed the database
docker-compose exec catalog-service node src/seed.js
docker-compose exec location-service node src/seed.js
```

### Access

| Application | URL                   |
| ----------- | --------------------- |
| Home        | http://localhost:3000 |
| Customer    | http://localhost:3001 |
| Vendor      | http://localhost:3002 |
| Admin       | http://localhost:3003 |
| Auth        | http://localhost:3004 |
| API Gateway | http://localhost:5000 |

---

## Testing

```bash
# Integration tests
./scripts/test-integration.sh

# Load test (requires k6)
k6 run scripts/load-test.js

# Security scan (requires Docker)
docker run --rm -t ghcr.io/zaproxy/zaproxy:stable zap-baseline.py -t http://host.docker.internal:5000
```

---

## Documentation

- `docs/ARCHITECTURE.md` - System design
- `docs/API.md` - REST API reference
- `docs/DEPLOYMENT.md` - GCP deployment
- `docs/DEMO.md` - Demo script for viva

---

## Team

- **Muhammad Ali**

**Supervisor:** Mr. Asif Khan, Lecturer, ICS/IT

---

## License

Academic project - The University of Agriculture, Peshawar.
