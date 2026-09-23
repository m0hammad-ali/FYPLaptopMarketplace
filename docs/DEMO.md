# Viva Demonstration Script

Total time: 10-12 minutes

## Preparation

Before commencing the demonstration, ensure that the application environment is running correctly and that the required services are operational.

1. Start the Docker stack:

   ```bash
   cd ~/Documents/fyp/laptop-marketplace
   docker-compose up -d
   sleep 30
   ./scripts/health.sh
   ```

2. Confirm that all services are healthy and the system is ready for presentation.

3. Open the following browser tabs in sequence:
   - http://localhost:3000 (Home)
   - http://localhost:3004 (Auth)
   - http://localhost:3001 (Customer)
   - http://localhost:3002 (Vendor)
   - http://localhost:3003 (Admin)

4. Prepare the demonstration accounts:
   - customer-demo@test.com / test123
   - vendor-demo@test.com / test123
   - admin-demo@test.com / admin123

## Part 1: Presentation Slides (2 minutes)

Slide 1: Title
Slide 2: Problem - information asymmetry
Slide 3: Objectives - AI recommendation, PKR pricing, vendor transparency, and administrative governance
Slide 4: Architecture diagram (Figure 3.1)

The opening statement may be framed as follows:

> "Good morning. We present the AI-powered laptop recommendation and marketplace for Gulhaji Plaza. The central problem is information asymmetry: buyers face complex specifications and opaque pricing. Our solution is a microservices-based platform powered by a content-based filtering recommendation engine."

## Part 2: Home Page Demonstration (30 seconds)

Open http://localhost:3000 and highlight the following features:

- sticky navigation header
- hero section with key statistics (120+ laptops, 93% precision)
- featured products retrieved from the public catalog API
- embedded Google Maps interface
- multi-column footer structure

## Part 3: Authentication Flow (30 seconds)

Open http://localhost:3004 and demonstrate the following:

- sign-in and sign-up tabs
- role selection for Customer and Vendor
- account creation and role-based redirection

The explanation may include:

> "Authentication is implemented using JWTs stored in localStorage and validated on protected routes at the application layer."

## Part 4: Customer Application (2 minutes)

Sign in as a customer and demonstrate the recommendation flow.

### Easy Mode

- select the Easy Mode interface
- choose the Gaming category
- set a budget such as Rs. 400,000
- display three recommendations with similarity scores
- activate the speech output to demonstrate accessibility features

### Simple Mode

- return to the mode selection view
- select Simple Mode
- answer the three guided questions
- display the recommendation results

### Pro Mode

- return to the mode selection view
- select Pro Mode
- present the full technical form and its associated outputs

### Recommendation Result Card

Highlight the following elements:

- similarity score badge
- technical specification chips
- local PKR pricing
- Contact Shop button that opens WhatsApp with a pre-filled message

## Part 5: Vendor Dashboard (1.5 minutes)

Log out and sign in as a vendor.

Demonstrate the following:

- Inventory tab with existing listings
- Add Item action and associated laptop selection fields
- price and stock entry workflow
- result after submission
- Shops tab and Add Shop workflow with GPS values

The explanation may include:

> "Vendor access is restricted to the user's own records through the x-user-id header propagated from the API Gateway."

## Part 6: Admin Panel (1 minute)

Log out and sign in as the administrator.

Demonstrate the following:

- summary stat cards
- vendor verification table
- verification action on a pending vendor account

The explanation may include:

> "The administrative interface is protected by IP-based access control through the ADMIN_ALLOWED_IPS environment variable."

## Part 7: Technical Highlights (1 minute)

Use the terminal or presentation slides to present the evidence:

```text
k6 Load Test:
  - 100 concurrent users
  - p95 latency: 28.77 ms (threshold: 1000 ms)
  - failure rate: 0%

Precision@K:
  - Precision@3: 0.933 (target: 0.85)
  - cosine similarity outperforms Euclidean distance by 6.6 points

OWASP ZAP:
  - 0 high-severity vulnerabilities
  - 66 checks passed
```

The discussion may include:

> "The system comprises 13 Docker containers, 5 microfrontends, 7 backend microservices, and a PostgreSQL 14 database normalized to 3NF."

## Part 8: Q&A Preparation

### Q: Why use microservices?

A: Microservices provide fault isolation, independent scaling, and technology heterogeneity.

### Q: Why choose cosine similarity over Euclidean distance?

A: The empirical evaluation indicates that cosine similarity achieved 0.933 Precision@3 compared with 0.867 for Euclidean distance.

### Q: How is vendor isolation enforced?

A: The API Gateway injects x-user-id after JWT validation, and downstream inventory and shop services filter records according to this header.

### Q: What about security?

A: The system implements multiple security layers, including Helmet headers, JWT authentication, bcrypt hashing, rate limiting, input validation, sanitization, and IP allowlisting. The ZAP assessment reported zero critical issues.

### Q: How does the system scale?

A: The k6 benchmark recorded a p95 latency of 28.77 ms under 100 concurrent users. In-memory feature vectors reduce repeated database access during recommendation generation, and Cloud Run supports horizontal scaling.

### Q: Is the platform deployed?

A: The architecture is designed for GCP Cloud Run, and the deployment process is documented in docs/DEPLOYMENT.md. The local Docker Compose setup mirrors the production deployment structure for evaluation and demonstration purposes.

## Backup Plan

In the event of a live demonstration failure:

- play a pre-recorded video if one is available in docs/demo-video.mp4
- use screenshots from docs/screenshots/
- continue with the slide-based presentation sequence

## Closing Statement

> "Thank you. We welcome your questions."
