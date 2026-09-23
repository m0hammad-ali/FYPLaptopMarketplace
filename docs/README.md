# Documentation Index

This document provides a structured overview of the complete project documentation for the Laptop Marketplace final-year project.

## Contents

| File                               | Purpose                                              |
| ---------------------------------- | ---------------------------------------------------- |
| [API.md](API.md)                   | REST API reference                                   |
| [ARCHITECTURE.md](ARCHITECTURE.md) | system design and architectural decisions            |
| [DEPLOYMENT.md](DEPLOYMENT.md)     | GCP Cloud Run deployment guide                       |
| [TESTING.md](TESTING.md)           | testing strategy and validation results              |
| [EVALUATION.md](EVALUATION.md)     | AI engine evaluation metrics                         |
| [DEMO.md](DEMO.md)                 | viva demonstration script                            |
| [FAQ.md](FAQ.md)                   | frequently asked questions and troubleshooting notes |
| [thesis/](thesis/)                 | thesis draft containing six chapters                 |

## Quick Navigation

- **New to the project?** Begin with [ARCHITECTURE.md](ARCHITECTURE.md)
- **Need deployment instructions?** Refer to [DEPLOYMENT.md](DEPLOYMENT.md)
- **Preparing for the viva?** Review [DEMO.md](DEMO.md)
- **Writing the thesis?** Use the chapters in [thesis/](thesis/)

## System Ports

| Service                | Port |
| ---------------------- | ---- |
| Home                   | 3000 |
| Customer               | 3001 |
| Vendor                 | 3002 |
| Admin                  | 3003 |
| Auth                   | 3004 |
| API Gateway            | 5000 |
| Auth Service           | 5001 |
| Catalog Service        | 5002 |
| Inventory Service      | 5003 |
| Recommendation Service | 5004 |
| Notification Service   | 5005 |
| Location Service       | 5006 |
| PostgreSQL             | 5432 |
