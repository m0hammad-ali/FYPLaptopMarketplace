# CHAPTER 5: TESTING AND RESULTS

## 5.1 Test Cases

Table 5.1: Integration Test Cases (20 Tests)

| ID         | Description                        | Expected         | Status |
| ---------- | ---------------------------------- | ---------------- | ------ |
| INT-01..07 | backend health checks              | 200 OK           | PASS   |
| INT-08..12 | frontend health checks             | 200              | PASS   |
| INT-13     | featured laptops endpoint          | data returned    | PASS   |
| INT-14     | catalog authentication requirement | 401              | PASS   |
| INT-15     | registration flow                  | token returned   | PASS   |
| INT-16     | login flow                         | token returned   | PASS   |
| INT-17     | authenticated catalog access       | 200              | PASS   |
| INT-18     | recommendation generation          | results returned | PASS   |
| INT-19     | WhatsApp link generation           | URL generated    | PASS   |
| INT-20     | invalid input handling             | 400              | PASS   |

## 5.2 Unit Testing

Table 5.2: Unit Test Coverage (8 Tests)

| Module     | Test                     | Result |
| ---------- | ------------------------ | ------ |
| similarity | identical vectors        | PASS   |
| similarity | orthogonal vectors       | PASS   |
| similarity | weighted effect          | PASS   |
| similarity | Euclidean identical case | PASS   |
| similarity | NaN safety               | PASS   |
| preprocess | empty input              | PASS   |
| preprocess | returns features         | PASS   |
| preprocess | no NaN values            | PASS   |

## 5.3 Integration Testing

A total of 20 automated integration checks were executed, and all were completed successfully.

Sample output:

```text
Backend Health:
OK Port 5000 .. 5006
Auth Flow:
OK Register returns token
OK Login returns token
Results: 20 passed, 0 failed
```

## 5.4 Performance Testing

Table 5.3: k6 Load Test Results

| Metric          | Value     | Threshold | Status |
| --------------- | --------- | --------- | ------ |
| Peak VUs        | 100       | -         | -      |
| Total requests  | 3,073     | -         | -      |
| Average latency | 11.23 ms  | -         | -      |
| p95 latency     | 28.77 ms  | < 1000 ms | PASS   |
| Max latency     | 95.5 ms   | -         | -      |
| Failure rate    | 0.00%     | < 1%      | PASS   |
| Throughput      | ~40 req/s | -         | -      |

The p95 latency of 28.77 ms is approximately 35 times below the target threshold, confirming the efficiency of the implemented algorithm and the service architecture under concurrent usage.

## 5.5 AI Accuracy Evaluation

Table 5.4: Precision@K (Cosine Similarity)

| Query   | Usage       | P@3   | P@5   |
| ------- | ----------- | ----- | ----- |
| 1       | gaming      | 1.00  | 1.00  |
| 2       | office      | 1.00  | 1.00  |
| 3       | ultrabook   | 1.00  | 0.80  |
| 4       | workstation | 0.67  | 0.40  |
| 5       | everyday    | 1.00  | 0.60  |
| Average | -           | 0.933 | 0.760 |

Target: Precision@3 >= 0.85
Achieved: 0.933
Result: the target is exceeded by 8 percentage points.

## 5.6 Metric Comparison

Table 5.5: Cosine Similarity vs Euclidean Distance

| Metric     | P@3    | P@5    |
| ---------- | ------ | ------ |
| Cosine     | 0.933  | 0.760  |
| Euclidean  | 0.867  | 0.840  |
| Difference | +0.066 | -0.080 |

The weighted cosine similarity method outperforms Euclidean distance on the primary evaluation metric, Precision@3, by 6.6 percentage points.

## 5.7 Results and Discussion

Table 5.6: Objectives Versus Achieved Results

| Objective             | Target          | Achieved | Status   |
| --------------------- | --------------- | -------- | -------- |
| Precision@3           | >= 0.85         | 0.933    | EXCEEDED |
| Cosine > Euclidean    | any improvement | +0.066   | MET      |
| p95 latency < 1000 ms | yes             | 28.77 ms | EXCEEDED |
| 0% failures           | yes             | 0.00%    | MET      |

The results demonstrate the following key findings:

1. the achieved Precision@3 of 0.933 exceeds the target by 8 percentage points
2. weighted cosine similarity outperforms Euclidean distance by 6.6 percentage points on the main evaluation metric
3. the system maintains a wide latency margin under the 100-user performance threshold
4. no request failures were observed across 3,073 total requests

The evaluation also identifies several limitations:

1. the validation set is relatively small, comprising only five evaluation queries
2. the ground truth is based on category matching rather than full manual relevance labeling
3. synthetic enrichment introduces some variation within categories
4. the workstation category contains only a limited number of entries

These findings provide empirical evidence that the system meets its primary requirements and supports the conclusion that the implementation is suitable for the current deployment scale.
