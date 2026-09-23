# CHAPTER 1: INTRODUCTION

## 1.1 Background of the Study

The rapid advancement of laptop hardware technology has created a significant information gap between consumers and vendors in local technology markets. Modern laptops include increasingly complex specifications, such as multiple processor generations, different memory technologies, thermal design power (TDP), graphics architecture, storage configurations, and battery efficiency. These technical details are often difficult for non-specialist buyers to interpret, particularly when evaluated without a standardized comparison framework.

In local markets such as Gulhaji Plaza, Peshawar, customers frequently rely on informal vendor guidance, which may be incomplete, biased, or inconsistent. This creates a scenario of information asymmetry, a concept discussed by Akerlof (1970), in which sellers possess more reliable information than buyers. Consequently, purchasing decisions are often made without a full understanding of product suitability, value for money, or market comparability.

This project addresses this issue by developing an AI-powered laptop recommendation and marketplace system tailored to the local market context. The platform applies content-based filtering to compare hardware specifications against user preferences and generates objective recommendations. It also integrates vendor pricing and inventory information to improve market transparency, increase consumer confidence, and support more informed purchasing decisions.

## 1.2 Problem Statement

The local laptop marketplace is characterised by two significant barriers to efficient decision-making:

- consumer confusion: the technical complexity of modern laptop specifications makes direct comparison difficult for ordinary buyers
- market distrust: pricing inconsistencies and limited visibility into stock availability discourage informed purchasing and increase the likelihood of inefficient transactions

These challenges indicate the need for a digital solution that combines product comparison, recommendation intelligence, local market pricing, and vendor transparency within a unified system.

## 1.3 Objectives

The objectives of this project are as follows:

1. To design and implement a content-based filtering algorithm using vector space modelling and cosine similarity, with a target Precision@K of at least 0.85.
2. To implement a decoupled tri-stack microservice architecture orchestrated through Docker, separating I/O-intensive marketplace operations from compute-heavy AI processes.
3. To maintain strict data integrity using a PostgreSQL schema normalised to third normal form (3NF).
4. To acquire and curate a local dataset containing at least 100 unique laptop models with real pricing information.
5. To perform a comparative evaluation of cosine similarity and Euclidean distance in order to justify the selected recommendation strategy.

## 1.4 Scope

The proposed system includes the following components:

- a public landing page developed using Next.js
- a customer portal with AI-driven recommendations
- a vendor dashboard for inventory and shop management
- an administrative panel for governance and verification
- a backend implemented through seven microservices
- integration with WhatsApp Business and Google Maps services
- deployment preparation for Google Cloud Platform

The scope of the project excludes mobile-native applications, integrated payment systems, and full e-commerce checkout functionality.

## 1.5 Methodology

The project was developed using an agile-inspired methodology comprising five primary phases:

1. requirement analysis and system planning
2. data and database foundation development
3. core implementation of the AI engine, API layer, and frontend applications
4. deployment configuration and local data acquisition
5. evaluation, testing, and thesis documentation

## 1.6 Report Organization

This report is organized as follows:

- Chapter 2: Literature Review
- Chapter 3: System Analysis and Design
- Chapter 4: Implementation
- Chapter 5: Testing and Results
- Chapter 6: Conclusion and Future Work
