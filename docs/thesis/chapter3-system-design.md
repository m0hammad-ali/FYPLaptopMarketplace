# CHAPTER 3: SYSTEM ANALYSIS AND DESIGN

## 3.1 Existing System

The Gulhaji Plaza laptop market currently operates largely through an offline retail model. Buyers are often required to visit multiple shops in person, while vendors maintain their own records manually. This results in inconsistent pricing, unclear product comparison, incomplete stock visibility, and limited access to objective product information. In its current state, the market is characterized by inefficiency and a lack of digital transparency.

The primary limitations of the existing system are as follows:

- information asymmetry between buyers and sellers
- the absence of a standardized product comparison mechanism
- inconsistent pricing across vendors
- manual inventory tracking and limited stock visibility
- no recommendation mechanism for personalized purchasing decisions
- a time-consuming and fragmented buyer journey

## 3.2 Proposed System

The proposed system is an AI-powered laptop marketplace and recommendation platform designed to improve transparency, improve consumer confidence, and streamline the purchasing process in the local market context.

### 3.2.1 Features for Customers

- personalized AI-based recommendations
- transparent PKR pricing
- vendor verification indicators
- direct vendor communication through WhatsApp
- Google Maps integration for shop locations
- three user experience modes: Easy, Simple, and Pro

### 3.2.2 Features for Vendors

- digital inventory management
- real-time stock and pricing updates
- price history tracking
- shop registration and GPS-based location management

### 3.2.3 Features for Administrators

- vendor verification and approval workflows
- platform monitoring and governance
- IP-restricted administrative access

## 3.3 System Architecture

[Figure 3.1: Tri-Stack Microservices Architecture]

The system follows a tri-stack architecture that integrates five frontend applications, one API gateway, seven backend services, and a PostgreSQL database. This structure supports service separation, modularity, and scalable implementation across multiple user roles.

### 3.3.1 Frontend Applications

- Home (Next.js, port 3000)
- Customer (React, port 3001)
- Vendor (React, port 3002)
- Admin (React, port 3003)
- Auth (React, port 3004)

### 3.3.2 API Gateway

The API Gateway operates on port 5000 and serves as the single entry point for all client requests. It is responsible for routing, JWT validation, rate limiting, and the enforcement of security headers through Helmet middleware.

### 3.3.3 Backend Services

- Auth Service (port 5001)
- Catalog Service (port 5002)
- Inventory Service (port 5003)
- Recommendation Service (port 5004)
- Notification Service (port 5005)
- Location Service (port 5006)

### 3.3.4 Database Layer

The database layer uses PostgreSQL 14 and implements a nine-table schema normalized to third normal form (3NF). This design supports strong data integrity and transactional consistency for inventory updates, price changes, and related market operations.

The architecture is designed to emphasize decoupling, security, scalability, and maintainability.

## 3.4 Use Case Diagram

[Figure 3.2: Use Case Diagram]

The primary actors in the system are the customer, vendor, administrator, and external services such as WhatsApp and Google Maps.

### 3.4.1 Customer Use Cases

- register an account
- sign in to the platform
- provide purchase preferences
- view AI-generated recommendations
- compare laptop options
- contact vendors through WhatsApp messaging

### 3.4.2 Vendor Use Cases

- register and authenticate
- manage inventory items
- update stock and pricing information
- manage shop and location data

### 3.4.3 Admin Use Cases

- access the administrative panel
- verify and approve vendors
- monitor platform activity and user operations

## 3.5 Entity Relationship Diagram

[Figure 3.3: Entity Relationship Diagram]

The data model defines the following relationships:

- users to vendors: one-to-one
- vendors to shops: one-to-many
- laptops to specifications: one-to-one
- vendors to inventory: one-to-many
- laptops to inventory: one-to-many
- inventory to price history: one-to-many
- users to reviews: one-to-many
- laptops to reviews: one-to-many
- users to notifications: one-to-many

The design intentionally avoids cross-service foreign key constraints, which is consistent with the loose-coupling principles of microservice architecture.

## 3.6 Data Flow Diagram

[Figure 3.4: Data Flow Diagram]

### Level 0

External entities, including customers, vendors, and administrators, interact with the system through frontend interfaces and backend services.

### Level 1

The system processes include authentication, catalog management, inventory handling, recommendation generation, notification dispatch, and location management.

## 3.7 Database Design

Table 3.1: Database Entities

| Table          | Purpose                            |
| -------------- | ---------------------------------- |
| users          | authentication and role assignment |
| vendors        | vendor profiles                    |
| shops          | physical shop locations            |
| laptops        | static laptop models               |
| specifications | hardware specification details     |
| inventory      | vendor listings and stock          |
| price_history  | audit trail of price changes       |
| reviews        | user and product reviews           |
| notifications  | message and notification records   |

The schema is normalized to 3NF to minimize data redundancy and ensure consistency. ACID transaction guarantees preserve data integrity for multi-table operations such as inventory updates and price-history logging.
