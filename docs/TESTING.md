# Testing Documentation

## Test Strategy

The validation strategy for this project follows a three-tier structure:

1. unit tests to verify algorithmic correctness
2. integration tests to validate end-to-end system behavior
3. load tests to measure performance under concurrent usage

This approach ensures that both functional and non-functional requirements are evaluated systematically before deployment or presentation.

## 1. Unit Tests (Python)

The unit tests for the recommendation engine are located in services/recommendation-service/tests/.

Run:

```bash
docker-compose exec recommendation-service python tests/test_similarity.py
docker-compose exec recommendation-service python tests/test_preprocess.py
```

### Test Coverage

| Test Purpose                     | Description                                             |
| :------------------------------- | :------------------------------------------------------ |
| test_identical_vectors           | Cosine similarity for identical vectors is 1.0          |
| test_orthogonal_vectors          | Orthogonal vectors yield a similarity of 0.0            |
| test_weighted_effect             | Weighting adjusts ranking correctly                     |
| test_euclidean_identical         | Euclidean distance is 0 for identical vectors           |
| test_nan_safety                  | NaN inputs are handled without producing invalid output |
| test_preprocess_empty_input      | Empty input is handled gracefully                       |
| test_preprocess_returns_features | Feature matrix has the expected structure               |
| test_preprocess_no_nan           | The processed dataset contains no NaN values            |

## 2. Integration Tests (Bash)

The integration suite is stored in scripts/test-integration.sh.

Run:

```bash
./scripts/test-integration.sh
```

This suite performs 20 checks across the following areas:

- 7 backend health endpoints
- 5 frontend HTTP checks
- public catalog access
- authentication register/login flow
- authenticated catalog access
- recommendation engine execution
- notification service operation
- input validation behavior

Expected terminal output concludes with:

```text
Results: 20 passed, 0 failed
```

## 3. Load Tests (k6)

The load test script is located at scripts/load-test.js.

Run:

```bash
docker run --rm --network=host -i grafana/k6 run - < scripts/load-test.js
```

### Configuration

- Ramp: 20 -> 50 -> 100 -> 0 virtual users
- Duration: 75 seconds
- Target: /recommend endpoint

### Results

- p95 latency: 28.77 ms (threshold: 1000 ms) - PASS
- failure rate: 0.00% (threshold: < 1%) - PASS
- total requests: 3,073

## 4. Security Tests

OWASP ZAP baseline scan results:

| Risk Level | Count             |
| :--------- | :---------------- |
| High       | 0                 |
| Medium     | 0                 |
| Low        | 1 (informational) |
| Pass       | 66                |

Report: results/zap/zap-summary.md

## 5. Manual Smoke Tests

Before each commit, run:

```bash
./scripts/health.sh
```

The expected outcome is that all services are healthy and operational.

## Coverage Summary

| Layer         | Coverage              |
| :------------ | :-------------------- |
| AI similarity | 100%                  |
| preprocessing | 100%                  |
| API endpoints | 20 integration checks |
| frontends     | 5 applications        |
| security      | ZAP verified          |
| performance   | 100 concurrent users  |

## Conclusion

All validation checks passed successfully. The system satisfies its functional requirements, maintains low response latency under load, and demonstrates zero high-severity security findings.
