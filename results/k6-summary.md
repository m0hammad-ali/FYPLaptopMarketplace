# k6 Load Test Results

**Date:** 2026-09-22
**Script:** scripts/load-test.js
**Target:** POST http://host.docker.internal:5004/recommend

## Test Configuration

| Parameter | Value |
|-----------|-------|
| Ramp-up | 20 → 50 → 100 → 0 VUs over 75s |
| Peak VUs | 100 |
| Request payload | `{"budget":400000,"usage":"gaming","top_k":5}` |
| Thresholds | p(95) < 1000ms, failure rate < 1% |

## Results

| Metric | Value |
|--------|-------|
| Total Requests | 3,073 |
| Avg Response Time | 11.23 ms |
| Median Response Time | 7.85 ms |
| 95th Percentile | **28.77 ms** |
| Max Response Time | 95.5 ms |
| Failed Requests | 0 |
| Failure Rate | **0.00%** |
| Throughput | ~40 req/s |

## Conclusion

Both thresholds passed:
- ✅ p(95) < 1000ms (achieved 28.77ms — 35x under budget)
- ✅ Failure rate < 1% (achieved 0.00%)

The recommendation engine is production-ready and handles 100 concurrent users with sub-30ms latency.
