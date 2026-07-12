# Project Risks and Mitigations

This document outlines the known technical and operational risks for the StarSuperScare Marketplace project and the strategies to mitigate them.

## 1. Missing External Credentials (Payment, Email, Storage)
- **Risk:** Integration with third-party providers (e.g., payment gateways, email services) blocks development if credentials are not provided on time.
- **Mitigation:** Use the Adapter pattern. Build deterministic "fakes" for development and testing. These fakes should simulate network latency and both success/failure responses. Do not claim successful integration until real keys are tested.

## 2. Frontend Accessing Database Directly
- **Risk:** Developers may attempt to import database modules directly into React applications, exposing connection strings and bypassing security checks.
- **Mitigation:** Enforced by Deno Workspace configuration, architectural lock (ADR-001), and code reviews. `packages/database` must never be imported in `apps/storefront`, `apps/auth`, or `apps/dashboard`.

## 3. Financial Calculation Errors
- **Risk:** Using floating-point variables for currency can result in rounding errors leading to financial discrepancies.
- **Mitigation:** Strict enforcement of integer types for all money values (IDR) in the database (Neon) and Drizzle schema. UI will format integers to display values appropriately.

## 4. Timezone Confusion
- **Risk:** Storing timestamps in local time can cause data inconsistencies when servers are in different regions.
- **Mitigation:** All `created_at`, `updated_at`, and event timestamps must be saved in UTC. The frontend is responsible for rendering this in the `id-ID` locale and `Asia/Jakarta` timezone.

## 5. Security Leaks in Frontend Bundles
- **Risk:** Accidentally bundling environment secrets into Vite builds.
- **Mitigation:** Strict separation of `.env` files. Frontend variables must explicitly be prefixed (e.g., `VITE_`) if they are meant to be public. Backend secrets must never have this prefix.

## 6. Monorepo Dependency Hell
- **Risk:** Apps tightly coupling to each other or importing files outside of designated packages.
- **Mitigation:** Use Deno's workspace features to manage explicit dependencies. Maintain strict application boundaries.
