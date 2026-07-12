# Security dan Observability

## Security baseline

- Hash password yang lambat/memory-hard.
- Secure session dan CSRF.
- Parameterized query/ORM.
- Ownership checks.
- Rate limit auth, checkout, download, support upload.
- File type/size validation dan malware scanning bila tersedia.
- Signed URLs singkat.
- Webhook signature dan replay protection.
- Audit log admin dan security events.

## Logging

Structured JSON fields:

```text
timestamp
level
service
environment
request_id
user_id_hash
route
status
latency_ms
error_code
```

Jangan log password, raw session, activation/reset token, payment credential, signed URL, atau full
sensitive payload.

## Metrics

- API latency/error rate.
- Login failure/rate limit.
- Checkout conversion/failure.
- Webhook delay/failure.
- Worker queue age/retry/dead jobs.
- Email bounce.
- SSE connections/reconnect.
- Inventory discrepancy.

## Alerts

Alert pada payment webhook backlog, database failure, elevated 5xx, dead jobs, email activation
failure, dan negative inventory attempt.
