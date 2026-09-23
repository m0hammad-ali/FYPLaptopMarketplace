# AI-Powered Laptop Recommendation and Marketplace

Final Year Project (Session 2022-2026)
Institute of Computer Sciences and Information Technology (ICS/IT)
The University of Agriculture, Peshawar

This project presents the design and implementation of a web-based marketplace and recommendation platform for laptop buyers and vendors in Gulhaji Plaza, Peshawar. The system integrates artificial intelligence, microservice-based backend architecture, and transparent market data to reduce information asymmetry in the local technology marketplace.

---

## Problem Statement

Local hardware buyers in Peshawar face several structural challenges, including:

- complex laptop specifications without a standardized comparison mechanism
- non-transparent and inconsistent pricing across vendors
- limited visibility into stock availability
- inefficient manual inventory and pricing workflows

These issues inhibit informed purchasing decisions and reduce consumer confidence in local marketplace transactions.

## Solution Overview

The proposed platform addresses these limitations through the following components:

- AI-based recommendations using weighted cosine similarity
- Precision@3 target of 0.85, achieved at 0.933
- a microservice architecture comprising 7 backend services and 5 frontend applications
- multi-mode user interfaces designed for diverse literacy and technical proficiency levels
- PKR-based pricing derived from local market data
- security-focused implementation with cloud deployment readiness

---

## System Architecture

```text
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

A detailed discussion of the system design and architectural rationale is provided in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

---

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm
- Docker Desktop
- Git

### Setup Procedure

```bash
git clone https://github.com/YOUR-USERNAME/laptop-marketplace.git
cd laptop-marketplace
pnpm install
docker-compose up -d --build
docker-compose exec catalog-service node src/seed.js
docker-compose exec location-service node src/seed.js
```

### Local Access

| Application | URL                   |
| ----------- | --------------------- |
| Home        | http://localhost:3000 |
| Customer    | http://localhost:3001 |
| Vendor      | http://localhost:3002 |
| Admin       | http://localhost:3003 |
| Auth        | http://localhost:3004 |
| API Gateway | http://localhost:5000 |

---

## Testing and Validation

```bash
./scripts/test-integration.sh
k6 run scripts/load-test.js
docker run --rm -t ghcr.io/zaproxy/zaproxy:stable zap-baseline.py -t http://host.docker.internal:5000
```

---

## Documentation

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) - system architecture and design decisions
- [docs/API.md](docs/API.md) - REST API reference
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) - GCP deployment guide
- [docs/DEMO.md](docs/DEMO.md) - viva demonstration script
- [docs/FAQ.md](docs/FAQ.md) - frequently asked questions and troubleshooting guidance

---

## Team

- Muhammad Ali

Supervisor: Mr. Asif Khan, Lecturer, ICS/IT

---

## License

Academic project of The University of Agriculture, Peshawar.
