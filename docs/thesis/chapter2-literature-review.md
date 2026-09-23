# CHAPTER 2: LITERATURE REVIEW

## 2.1 Recommender Systems

Recommender systems are designed to suggest items or services based on user preferences and behavioural patterns. Ricci et al. (2011) describe these systems as tools that support decision-making in contexts where users are required to evaluate a large number of alternatives. Two principal approaches are widely used: collaborative filtering and content-based filtering.

Collaborative filtering predicts user interest by identifying patterns among similar users, whereas content-based filtering recommends items whose attributes match those preferred by the user. Content-based filtering is especially suitable in scenarios where no historical interaction data exists, as is the case in a newly established local marketplace.

This project adopts a content-based recommendation strategy because laptop specifications are explicitly available as structured attributes and the system is intended to assist new users who do not yet have prior purchasing history.

## 2.2 Content-Based Filtering

Lops et al. (2011) explain that content-based filtering models user preferences by analysing item features and matching them with the user’s requirements. In such systems, similarity metrics such as cosine similarity are used to compare feature vectors and rank candidate items.

Weighted cosine similarity extends the standard cosine similarity approach by assigning different importance values to different features. For example, a gaming user may prioritise graphics capability, whereas a mobile professional may prioritise battery life and portability. This weighting mechanism is especially relevant in the laptop domain, where user intent is strongly shaped by usage context.

The proposed system therefore employs dynamic weighting based on declared usage preferences to generate more relevant and user-centred recommendations.

## 2.3 Microservices Architecture

Newman (2021) defines microservices as a software architectural approach in which applications are structured as a collection of small, autonomous services that collaborate to deliver a larger system. This design offers several important advantages, including fault isolation, independent deployment, technology diversity, and horizontal scalability.

In a marketplace application, microservices are beneficial because distinct functionalities such as authentication, inventory management, recommendation processing, and notification delivery can evolve independently. This reduces system coupling and improves maintainability in a project that includes several frontend applications and multiple backend services.

The present system adopts a microservice-based architecture with an API gateway to centralise request routing, security enforcement, and access control.

## 2.4 Database Design and ACID Properties

Silberschatz et al. (2019) emphasise that normalisation is a core principle of relational database design that reduces redundancy and improves consistency. The third normal form (3NF) eliminates transitive dependencies and promotes data integrity by ensuring that non-key attributes are functionally dependent only on the primary key.

ACID properties, which include atomicity, consistency, isolation, and durability, are essential for managing transactional operations such as inventory updates and price-history logging. In this project, PostgreSQL is used as the relational database, and Sequelize transactions provide support for reliable multi-step operations.

## 2.5 Existing Solutions

Several existing platforms partially address aspects of laptop comparison or general marketplace functionality, but they do not fully satisfy the requirements of this project. Examples include:

- NotebookCheck: provides detailed laptop specifications but lacks an integrated local marketplace workflow.
- PCPartPicker: focuses primarily on desktop hardware and is not well suited to local laptop retail scenarios.
- Daraz and OLX: provide marketplace functionality, but they do not offer AI-based recommendation or user-specific filtering.
- PriceOye: offers price comparison but lacks a strong recommendation engine and vendor-specific trust features.

These systems highlight a clear gap in the market: none of them fully integrate AI recommendation, local price transparency, communication mechanisms, and vendor inventory management within a unified platform.

## 2.6 Summary

The literature reviewed in this chapter supports the architectural and algorithmic decisions adopted in this project. A content-based recommendation approach is appropriate for a marketplace without historical user data, microservices provide scalability and separation of concerns, and a normalised relational database ensures transactional integrity. The combination of these elements addresses a clear gap in current digital retail solutions for local laptop markets.

## References

Akerlof, G. A. (1970). The market for “lemons”: Quality uncertainty and the market mechanism. The Quarterly Journal of Economics, 84(3), 488–500. https://doi.org/10.2307/1879431

Lops, P., de Gemmis, M., & Semeraro, G. (2011). Content-based recommender systems: State of the art and trends. In F. Ricci, L. Rokach, B. Shapira, & P. B. Kantor (Eds.), Recommender Systems Handbook (pp. 73–105). Springer. https://doi.org/10.1007/978-0-387-85820-3_3

Newman, S. (2021). Building Microservices: Designing Fine-Grained Systems (2nd ed.). O’Reilly Media.

Ricci, F., Rokach, L., Shapira, B., & Kantor, P. B. (Eds.). (2011). Recommender Systems Handbook. Springer.

Silberschatz, A., Korth, H. F., & Sudarshan, S. (2019). Database System Concepts (7th ed.). McGraw-Hill Education.
