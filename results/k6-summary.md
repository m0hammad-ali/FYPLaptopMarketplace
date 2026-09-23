# k6 Load Test Summary

**Date:** 2026-09-22
**Script:** scripts/load-test.js
**Target:** POST http://host.docker.internal:5004/recommend

## Test Configuration

| Parameter       | Value                                             |
| --------------- | ------------------------------------------------- |
| Ramp-up         | 20 → 50 → 100 → 0 VUs over 75 seconds             |
| Peak VUs        | 100                                               |
| Request payload | {"budget": 400000, "usage": "gaming", "top_k": 5} |
| Thresholds      | p(95) < 1000 ms, failure rate < 1%                |

## Results

| Metric                | Value        |
| --------------------- | ------------ |
| Total Requests        | 3,073        |
| Average Response Time | 11.23 ms     |
| Median Response Time  | 7.85 ms      |
| 95th Percentile       | **28.77 ms** |
| Max Response Time     | 95.5 ms      |
| Failed Requests       | 0            |
| Failure Rate          | **0.00%**    |
| Throughput            | ~40 req/s    |

## Conclusion

Both thresholds were satisfied:

- ✅ p(95) < 1000 ms (achieved 28.77 ms, which is 35x below the target)
- ✅ failure rate < 1% (achieved 0.00%)

The recommendation engine demonstrates strong performance under realistic concurrent load and remains well within the accepted latency budget.
