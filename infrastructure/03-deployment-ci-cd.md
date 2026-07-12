# Deployment dan CI/CD

## Pipeline pull request

1. Install/cache dependencies.
2. Format check.
3. Lint.
4. Type check.
5. Unit/integration tests.
6. Build frontend/API.
7. Scan secret/dependency.
8. Create preview deployment + Neon preview branch bila diperlukan.

## Staging

1. Apply migration.
2. Deploy API/worker.
3. Deploy frontends.
4. Run smoke/E2E.
5. Verify webhook, email sandbox, SSE, dan object storage.

## Production

1. Review backward compatibility.
2. Apply safe migration.
3. Deploy API/worker.
4. Deploy UI.
5. Smoke test payment non-destructive atau provider test mode.
6. Monitor error, latency, queue backlog, webhook failure.
7. Rollback app bila perlu; database rollback memakai forward fix kecuali migration benar-benar
   reversible.
