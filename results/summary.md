# Evaluation Results

## Precision@K Comparison

| Metric | Precision@3 | Precision@5 |
|--------|-------------|-------------|
| Weighted Cosine Similarity | **0.933** | 0.76 |
| Euclidean Distance | 0.867 | 0.84 |
| Difference (Cosine − Euclidean) | **+0.066** | −0.08 |

**Winner on Precision@3:** Weighted Cosine Similarity

## Per-Query Results (Cosine)

| Query | Usage | P@3 | P@5 | R@3 | R@5 |
|-------|-------|-----|-----|-----|-----|
| 1 | gaming | 1.00 | 1.00 | 0.12 | 0.16 |
| 2 | office | 1.00 | 1.00 | 0.07 | 0.12 |
| 3 | ultrabook | 1.00 | 0.80 | 0.33 | 0.44 |
| 4 | workstation | 0.67 | 0.40 | 1.00 | 1.00 |
| 5 | everyday | 1.00 | 0.60 | 0.07 | 0.07 |
| **Average** | | **0.933** | 0.76 | 0.319 | 0.359 |

## Objective Met

- Target: Precision@3 ≥ 0.85
- Achieved: **0.933** ✅

## Notes

Recall is expected to be low because each category has 25-42 laptops, but we only return top 3-5.
