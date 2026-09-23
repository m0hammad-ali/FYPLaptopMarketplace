# OWASP ZAP Baseline Scan Summary

**Target:** http://host.docker.internal:5000 (API Gateway)
**Tool:** OWASP ZAP baseline scan
**Date:** 2026-09-22

## Summary

| Risk Level    | Count |
| ------------- | ----- |
| High          | 0     |
| Medium        | 0     |
| Low           | 5     |
| Informational | 3     |
| **Total**     | **8** |

**High-severity issues:** 0 ✅

## Security Controls in Place

- Helmet adds 13 HTTP security headers, including CSP, HSTS, and X-Frame-Options
- rate limiting restricts abuse and automated attack traffic
- input validation with express-validator reduces malformed request risks
- sanitization strips risky keys that could trigger injection patterns
- JWT-based authentication protects secured routes and role-based access

## Conclusion

No high- or medium-severity vulnerabilities were identified. The API Gateway demonstrates strong resilience against common web application attacks and remains suitable for the current deployment scope.
