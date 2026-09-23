# CHAPTER 6: CONCLUSION AND FUTURE WORK

## 6.1 Summary of the Work

This project implemented an AI-powered laptop recommendation and marketplace platform for Gulhaji Plaza, Peshawar. The system addresses the information asymmetry inherent in local hardware markets by combining content-based filtering techniques with real-time vendor inventory data and transparent pricing information.

The platform includes the following core components:

- five microfrontends (Home, Customer, Vendor, Admin, and Auth)
- seven backend microservices
- a nine-table PostgreSQL schema normalized to 3NF
- a FastAPI-based recommendation engine
- JWT-based authentication with bcrypt password hashing
- WhatsApp and Google Maps integration
- a three-mode inclusive user interface
- progressive web app support for the customer experience
- a GitHub Actions pipeline for CI/CD automation
- an architecture designed for deployment on Google Cloud Run

The principal achievements of the project are as follows:

1. Precision@3 = 0.933 against a target of 0.85
2. weighted cosine similarity outperforms Euclidean distance by 6.6 percentage points
3. p95 latency of 28.77 ms under 100 concurrent users
4. zero high-severity security findings in the OWASP ZAP assessment
5. 120 laptop records with PKR pricing
6. vendor-level data isolation enforced through application-layer validation

## 6.2 Limitations

Although the system demonstrates positive results, several limitations remain:

1. the validation set is relatively small, consisting of only five evaluation queries
2. the ground truth is based on category matching rather than manual expert evaluation
3. the catalog size is suitable for a prototype marketplace rather than a large-scale public retail system
4. vendor onboarding remains limited to demo accounts during the development phase
5. Twilio integration remains simulated rather than fully deployed in production
6. reservation functionality remains deferred to future development

## 6.3 Future Improvements

### Short-Term Improvements (v1.1)

1. 24-hour reservation locking with automatic release scheduling
2. live Twilio integration
3. scheduled web scraping for catalog refresh
4. admin analytics dashboard

### Medium-Term Improvements (v1.2)

5. hybrid collaborative filtering model
6. React Native mobile application
7. machine learning-based price prediction
8. review and rating system for laptops and vendors

### Long-Term Improvements (v2.0)

9. expansion beyond Gulhaji Plaza to multiple local markets
10. payment integration through Stripe or JazzCash
11. AI-powered vendor assistant for recommendation support
12. blockchain-backed price history verification

### Research Directions

13. explainable recommendation models with feature attribution
14. active learning for dynamic user preference refinement
15. federated learning across distributed regional market datasets

## 6.4 Final Remarks

The Laptop Marketplace project demonstrates that an AI-driven recommendation platform and a user-friendly marketplace can be developed within the scope of a final-year project. The empirical results—93.3% Precision@3, 28.77 ms p95 latency, and zero high-severity security findings—confirm that the principal design decisions were technically sound.

Beyond technical feasibility, the system addresses a genuine market challenge: information asymmetry in local laptop purchasing. The three-mode interface—Easy, Simple, and Pro—also promotes accessibility across different literacy and technical skill levels, which aligns with broader goals of equitable digital access.

The platform therefore represents a viable foundation for real-world deployment and can serve as a strong base for future expansion in Gulhaji Plaza and similar local technology markets.
