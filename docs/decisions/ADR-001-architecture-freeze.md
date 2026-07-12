# ADR-001 — Architecture Freeze and Domain Boundaries

- Status: Accepted
- Date: 2026-07-12
- Owners: AI Build Playbook (Day 01)

## Context

To ensure the StarSuperScare Marketplace scales securely and development remains focused, we need to
establish immutable boundaries for domains, databases, and core application principles right at the
beginning. Drifting from these principles causes scattered logic, security vulnerabilities (like
frontend direct database access), and a degraded user experience.

## Decision

We lock down the following architectural constraints for the MVP and beyond. Any deviation from
these rules requires a new Architecture Decision Record (ADR).

1. **Domain and Routing Isolation:**
   - `starsuperscare.net`: Landing page and public information only.
   - `shop.starsuperscare.net`: Catalog, product details, cart, and checkout. _Cart and checkout
     logic must never be moved to the dashboard._
   - `auth.starsuperscare.net`: All login, signup, account activation, and password recovery flows.
   - `dashboard.starsuperscare.net`: Exclusive area for authenticated client users to manage orders,
     history, invoices, and settings.
   - `admin.starsuperscare.net`: Internal operations and management.
   - `api.starsuperscare.net/v1`: Centralized REST API and SSE endpoints.
   - `tracking.starsuperscare.net`: Public tracking using opaque tokens.

2. **Database Access Rules:**
   - **Only** `apps/api` and `apps/worker` are permitted to connect to the Neon PostgreSQL database
     via `packages/database`.
   - Frontend applications (React/Vite) **must never** hold database URLs or connect directly to the
     database.

3. **Data Formatting Standards:**
   - **Money:** All monetary values are stored and calculated as integers (IDR). Floating-point
     arithmetic is strictly prohibited for financial totals.
   - **Time:** All timestamps are stored in UTC. The UI is responsible for rendering them in `id-ID`
     locale and `Asia/Jakarta` timezone.

4. **Account Provisioning Principles:**
   - Login uses `username + password`.
   - Email is strictly used for verification, invoices, activation links, recovery, and
     notifications.
   - Passwords are never sent via email.
   - Guest accounts are auto-provisioned **only after** a verified successful payment. The user
     receives an activation link to set their password.

## Alternatives considered

- _Single monolithic frontend app:_ Rejected because separating `shop`, `auth`, and `dashboard`
  provides better bundle splitting, security isolation, and clear boundaries of responsibility.
- _Floating-point money storage:_ Rejected due to rounding errors which are unacceptable in
  e-commerce.

## Consequences

- Frontend developers must always route data fetching through `api.starsuperscare.net`.
- Cross-domain authentication (e.g., from `auth` to `shop`/`dashboard`) requires secure, HTTP-only
  session cookies set for the parent domain or explicit token handoffs.
- All database schema changes are strictly contained within `packages/database`.

## Migration/rollback

N/A. This is the foundational decision.

## Security and data impact

- High security improvement by isolating database credentials from all public-facing frontends.
- Storing passwords securely (hashing) and never transmitting them in plain text via email prevents
  massive data breach liabilities.

## Related routes, schema, and docs

- `docs/00-overview/02-domains-and-routes.md`
- `docs/00-overview/03-technology-decisions.md`
- `README.md`
- `START-HERE.md`
