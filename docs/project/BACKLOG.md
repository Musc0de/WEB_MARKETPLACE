# Project Backlog & MVP Scope

## MVP Goals

The Minimum Viable Product (MVP) focuses on launching a secure, end-to-end purchasing flow and user management system.

1. **Identity and Access Management (`auth`)**
   - User registration (username + password)
   - Account activation via email link
   - Login and secure session management
   - Password recovery (forgot/reset)
   - Auto-account provisioning for guest checkout

2. **Storefront & Catalog (`shop`)**
   - Public product listing and details
   - Search and category filtering
   - Shopping cart (guest and authenticated)
   - Checkout flow (shipping, payment integration)
   - Stock reservation and validation

3. **Client Dashboard (`dashboard`)**
   - View order history and status tracking
   - Manage user profile and addresses
   - Access digital downloads and invoices
   - Request returns/refunds and submit reviews

4. **Core API & Infrastructure (`api` & `worker`)**
   - Database schema and Drizzle migrations
   - API endpoints with Zod validation
   - Background worker for email, invoice generation, and outbox pattern
   - Integration with Payment Gateway (via adapters)

## Non-Goals for MVP

To ensure timely delivery, the following features are strictly excluded from the initial release:
- **Complex Event Streaming:** No Kafka. The MVP will rely on PostgreSQL transactional outbox.
- **Advanced Analytics:** Basic sales tracking only (`net_sold`). No machine learning recommendations or complex BI dashboards.
- **Multi-tenant / Multi-vendor:** The marketplace is single-vendor for the MVP.
- **Mobile Apps:** Development is exclusively focused on responsive web views. No native iOS/Android development.
- **Direct Database Access from Client:** Strictly prohibited by architecture rules.

## Branch and Commit Conventions

- Changes to architecture rules must be preceded by a new ADR.
- Commits should follow conventional commits format: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`.
- All features must pass the daily acceptance criteria before being marked as done.
