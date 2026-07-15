# Threat Model & Security Posture

## 1. Authentication & Authorization
- **Sessions & Tokens:** Managed securely with HTTPOnly, Secure, and SameSite=Lax cookies to prevent XSS exposure and limit CSRF.
- **RBAC (Role-Based Access Control):** Enforced via `requirePermission` middleware. The UI also visually hides elements, but the backend is the definitive gatekeeper.

## 2. Insecure Direct Object References (IDOR)
- All user-specific queries (e.g., `/orders/:id`, `/me/profile`) enforce that the requested resource belongs to the currently authenticated user (`userId`).
- Administrator endpoints `/admin/*` are strictly segregated and require elevated permissions.

## 3. Cross-Site Request Forgery (CSRF)
- Prevented using a combination of the `SameSite` cookie policy and the `csrfProtection` middleware which validates the `Origin` header against an allowed list.

## 4. Webhooks
- External services (e.g., Payment Provider, Shipping Provider) send webhooks to `/v1/webhooks/*`.
- These endpoints **must** validate cryptographic signatures (e.g., HMAC) provided in headers to prevent payload spoofing. 

## 5. Rate Limiting & Denial of Service (DoS)
- Implemented global rate limiting (100 req/10s per IP) to mitigate aggressive scraping.
- Strict rate limiting (10 req/30s per IP) on `/auth/*` endpoints to prevent brute-force credential stuffing.
- **Note:** In a multi-instance production environment, the in-memory store should be backed by Redis to share state across nodes.

## 6. Logging & Data Privacy
- Passwords are hashed using Argon2id before storage.
- Logs strictly avoid echoing sensitive request payloads or PII (Personally Identifiable Information). Only metadata like method, path, status, and duration are logged.

## Current High-Risk Remediations Completed:
- ✅ Rate-limiting added to API entry points.
- ✅ CSP added to secure headers to block unauthorized scripts or frames.
- ✅ IDOR checks comprehensively covered by DB `where` clauses ensuring `userId` bounds.
