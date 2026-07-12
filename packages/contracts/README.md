# Shared Contracts

## Tujuan

Satu definisi Zod untuk request, response, event payload, enum, pagination, dan error code.

## Folder

```text
auth/
catalog/
cart/
checkout/
orders/
notifications/
returns/
common/
events/
```

## Aturan

- Validate di boundary API dan worker event.
- Jangan mengekspos database row langsung.
- Response public memakai DTO terpisah.
- Semua enum status mempunyai transition map di domain service.
- Event memiliki `event_id`, `event_type`, `occurred_at`, `aggregate_id`, `version`, dan payload.
