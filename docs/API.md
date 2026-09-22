# API Reference

Base URL: `http://localhost:5000` (development)
All endpoints route through the API Gateway on port 5000.

---

## Authentication

Protected routes require a JWT in the `Authorization` header:

```
Authorization: Bearer <token>
```

Tokens are issued by `/api/auth/login` or `/api/auth/register` and expire after 7 days.

---

## Auth Service

### POST /api/auth/register

Create a new user account.

Request body:

```json
{
  "email": "user@example.com",
  "password": "min6chars",
  "role": "customer"
}
```

Response 201:

```json
{
  "token": "eyJhbGciOi...",
  "user": { "id": 1, "email": "user@example.com", "role": "customer" }
}
```

Errors: 400 (validation), 409 (duplicate email), 429 (rate limit)

### POST /api/auth/login

Authenticate an existing user.

Request body:

```json
{ "email": "user@example.com", "password": "min6chars" }
```

Response 200: same shape as register.

Errors: 401 (invalid credentials), 429 (rate limit)

### GET /api/auth/me

Returns the current user from the JWT.

Response 200:

```json
{ "id": 1, "email": "user@example.com", "role": "customer" }
```

---

## Catalog Service

### GET /api/laptops/featured

Public endpoint. Returns 4 featured laptops for the home page.

Response 200: JSON array of 4 laptop objects, each with nested Specification.

### GET /api/laptops

Auth required. Returns all 120 laptops with specifications.

Response 200: JSON array of all laptops.

### GET /api/laptops/:id

Auth required. Returns a single laptop by ID.

Response 200: Laptop object with Specification.
Errors: 404 (not found)

---

## Recommendation Service

### POST /api/recommend

Public endpoint. Returns top-K laptop recommendations.

Request body:

```json
{
  "mode": "pro",
  "usage": "gaming",
  "budget": 400000,
  "top_k": 5,
  "brand_preference": "Any",
  "cpu_min_benchmark": 0,
  "gpu_min_benchmark": 0,
  "ram_min_gb": 0,
  "storage_min_gb": 0,
  "weight_max_kg": 100,
  "battery_min_wh": 0,
  "metric": "cosine"
}
```

Field notes:

- mode: voice | simple | pro (analytics only)
- usage: gaming | office | ultrabook | workstation | everyday
- budget: max price in PKR
- metric: cosine (default) or euclidean (baseline)

Response 200:

```json
{
  "recommendations": [
    {
      "id": 1,
      "brand": "Acer",
      "model": "Nitro V15",
      "category": "gaming",
      "cpu_model": "Intel Core i7",
      "cpu_benchmark": 19612,
      "gpu_model": "NVIDIA RTX 3060",
      "gpu_benchmark": 18779,
      "ram_gb": 16,
      "storage_gb": 512,
      "storage_type": "NVMe SSD",
      "display_size": 15.6,
      "weight_kg": 2.3,
      "battery_wh": 70,
      "price_pkr": 367999,
      "similarity_score": 0.9826
    }
  ],
  "total_matched": 6,
  "mode": "pro",
  "metric": "cosine"
}
```

Errors: 503 (data not loaded)

---

## Inventory Service

All inventory endpoints require JWT with role=vendor.

### GET /api/inventory

Public. List all vendor listings.

### GET /api/inventory/mine

Returns the calling vendor's own listings.

### POST /api/inventory

Request body:

```json
{ "laptop_id": 1, "price_pkr": 180000, "stock": 5 }
```

Response 201: New inventory item.

### PUT /api/inventory/:id

Update own listing (price, stock). Logs to price_history within a transaction.

Response 200: Updated item.

### DELETE /api/inventory/:id

Delete own listing. Response 204.

---

## Location Service

### GET /api/shops

Auth required. List all shops.

### GET /api/shops/mine

Returns the calling vendor's own shops.

### POST /api/shops

Request body:

```json
{
  "name": "Ali Computers",
  "address": "Gulhaji Plaza, Floor 1, Shop 12",
  "latitude": 34.0151,
  "longitude": 71.5249,
  "phone": "+923001234567"
}
```

Response 201: New shop.

### PUT /api/shops/:id

Update own shop.

### DELETE /api/shops/:id

Delete own shop. Response 204.

---

## Admin Routes

All /api/admin/\* routes require:

1. Whitelisted IP (via ADMIN_ALLOWED_IPS)
2. JWT with role=admin

### GET /api/admin/vendors

List all vendors with user info.

Response 200:

```json
[
  {
    "id": 1,
    "shop_name": "Ali Computers",
    "phone": "+923001234567",
    "is_verified": true,
    "User": { "id": 8, "email": "vendor@test.com", "role": "vendor" }
  }
]
```

### PUT /api/admin/vendors/:id/verify

Request body:

```json
{ "is_verified": true }
```

Response 200: Updated vendor.

---

## Notification Service

### POST /api/notify/whatsapp-link

Generate a WhatsApp click-to-chat URL.

Request body:

```json
{
  "phone": "923001234567",
  "laptop_brand": "HP",
  "laptop_model": "Pavilion 15",
  "price_pkr": 185000
}
```

Response 200:

```json
{
  "url": "https://wa.me/923001234567?text=...",
  "phone": "923001234567",
  "message": "Hi, I'm interested in the HP Pavilion 15 listed at Rs. 185,000. Is it available?"
}
```

### POST /api/notify/send

Send a WhatsApp message via Twilio (simulated if credentials missing).

Response 200 (simulated):

```json
{
  "status": "simulated",
  "to": "923001234567",
  "message": "Test",
  "note": "Twilio credentials missing; message not actually sent."
}
```

---

## Health Endpoints

Every service exposes GET /health:

| Service        | Port | Endpoint |
| -------------- | ---- | -------- |
| API Gateway    | 5000 | /health  |
| Auth           | 5001 | /health  |
| Catalog        | 5002 | /health  |
| Inventory      | 5003 | /health  |
| Recommendation | 5004 | /health  |
| Notification   | 5005 | /health  |
| Location       | 5006 | /health  |

All return:

```json
{ "status": "ok", "service": "service-name" }
```

---

## Error Format

All error responses follow this shape:

```json
{ "error": "Human-readable message" }
```

Validation errors from express-validator return:

```json
{
  "errors": [
    {
      "type": "field",
      "value": "bad-input",
      "msg": "Specific validation message",
      "path": "email",
      "location": "body"
    }
  ]
}
```
