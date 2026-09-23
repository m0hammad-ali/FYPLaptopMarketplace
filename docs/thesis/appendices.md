# APPENDICES

## Appendix A: Source Code

The most relevant project files are listed below for reference and traceability:

- services/api-gateway/src/index.js — API Gateway
- services/auth-service/src/index.js — authentication endpoints
- services/catalog-service/src/index.js — laptop CRUD operations
- services/catalog-service/src/seed.js — catalog seeding script
- services/inventory-service/src/index.js — inventory CRUD operations
- services/recommendation-service/main.py — FastAPI recommendation service
- services/recommendation-service/app/preprocess.py — preprocessing module
- services/recommendation-service/app/similarity.py — recommendation similarity logic
- services/recommendation-service/app/user_profile.py — user profile generation
- services/notification-service/src/index.js — WhatsApp notification logic
- services/location-service/src/index.js — location and shop management
- apps/home/pages/index.js — Home page
- apps/customer/src/App.jsx — customer application
- apps/vendor/src/App.jsx — vendor dashboard
- apps/admin/src/App.jsx — admin panel
- apps/auth/src/App.jsx — authentication application
- docker-compose.yml — service orchestration

## Appendix B: User Manual

### B.1 Setup

```bash
git clone <repo>
cd laptop-marketplace
pnpm install
docker-compose up -d --build
sleep 30
docker-compose exec catalog-service node src/seed.js
```

### B.2 Access

| Application | URL                   |
| ----------- | --------------------- |
| Home        | http://localhost:3000 |
| Customer    | http://localhost:3001 |
| Vendor      | http://localhost:3002 |
| Admin       | http://localhost:3003 |
| Auth        | http://localhost:3004 |

### B.3 Test Accounts

| Role     | Email             | Password |
| -------- | ----------------- | -------- |
| Customer | customer@test.com | test123  |
| Vendor   | vendor@test.com   | test123  |
| Admin    | admin@test.com    | admin123 |

## Appendix C: Installation Guide

### C.1 Prerequisites

- Node.js 18+
- pnpm
- Docker Desktop
- Git

### C.2 Installation Procedure

1. Clone the repository.
2. Install the project dependencies:

   ```bash
   pnpm install
   ```

3. Start the application stack:

   ```bash
   docker-compose up -d --build
   ```

4. Seed the database:

   ```bash
   docker-compose exec catalog-service node src/seed.js
   ```

5. Open the home application in the browser at http://localhost:3000.

### C.3 Health Check

```bash
./scripts/health.sh
```

## Appendix D: Test Data

### D.1 Laptop Distribution

| Category    | Count |
| ----------- | ----- |
| gaming      | 25    |
| office      | 42    |
| everyday    | 42    |
| ultrabook   | 9     |
| workstation | 2     |

## Appendix E: Environment Variables

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=laptop_marketplace
DATABASE_URL=postgresql://postgres:postgres@db:5432/laptop_marketplace
JWT_SECRET=supersecretkey
JWT_EXPIRES_IN=7d
AUTH_RATE_LIMIT=500
ADMIN_ALLOWED_IPS=127.0.0.1,::1
```

## Appendix F: Glossary

| Term         | Definition                                             |
| ------------ | ------------------------------------------------------ |
| ACID         | Atomicity, Consistency, Isolation, and Durability      |
| API Gateway  | single entry point for backend services                |
| CBF          | content-based filtering                                |
| Docker       | containerization platform                              |
| FastAPI      | Python web framework                                   |
| JWT          | JSON Web Token                                         |
| Microservice | independently deployable software service              |
| MinMaxScaler | feature scaling method that normalizes values to [0,1] |
| Precision@K  | proportion of relevant items within the top K results  |
| PWA          | progressive web app                                    |
| 3NF          | third normal form                                      |
