# Schema Notification, Return, dan Support

## Notifications

```text
notifications
- id
- user_id
- type
- title
- body
- action_url
- data_json
- dedupe_key UNIQUE
- read_at
- created_at
```

## Outbox/jobs

```text
outbox_events
worker_jobs
email_deliveries
```

Simpan payload minimum dan hindari secret/PII berlebihan.

## Return/refund

- `return_requests`.
- `return_items`.
- `return_messages`.
- `return_evidence` metadata.
- `refunds` dan `refund_items`.

## Support

- `support_tickets`.
- `support_messages`.
- `support_attachments`.
- `ticket_status_history`.

## Reviews

Moderation status, rating, title, content, seller response, published_at, deleted_at, dan audit.
