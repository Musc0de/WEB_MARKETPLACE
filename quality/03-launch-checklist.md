# Launch Checklist

## Domain dan keamanan

- [ ] Semua domain HTTPS dan redirect benar.
- [ ] CORS allowlist final.
- [ ] Cookie attributes final.
- [ ] CSP/HSTS diuji.
- [ ] Admin MFA/strong access control siap.

## Database

- [ ] Migration production direview.
- [ ] Constraints/index utama ada.
- [ ] Backup/restore test selesai.
- [ ] Runtime memakai pooled URL; migration memakai direct URL.

## Commerce

- [ ] Harga/discount/stock dihitung server.
- [ ] Checkout idempotent.
- [ ] Payment webhook verified dan replay-safe.
- [ ] Invoice dan refund diuji.
- [ ] Sold calculation diuji.

## Auth

- [ ] Login/signup/activation/reset diuji.
- [ ] Tidak ada plaintext password/token di log/email/database.
- [ ] Session rotation/revocation diuji.
- [ ] Rate limiting diuji.

## Operations

- [ ] Worker retry/dead job dashboard tersedia.
- [ ] Monitoring/alerts aktif.
- [ ] Email bounce dan webhook logs terlihat.
- [ ] Support/runbook incident tersedia.
- [ ] E2E critical path lulus di staging.
