# Dashboard Endpoints

```text
GET   /v1/me/summary
GET   /v1/me/profile
PATCH /v1/me/profile
POST  /v1/me/change-password

GET    /v1/me/history
GET    /v1/me/invoices
GET    /v1/me/invoices/{invoice_number}
POST   /v1/me/invoices/{invoice_number}/download
GET    /v1/me/downloads
POST   /v1/me/downloads/{entitlement_id}/link

GET    /v1/me/addresses
POST   /v1/me/addresses
PATCH  /v1/me/addresses/{id}
DELETE /v1/me/addresses/{id}

GET   /v1/me/wishlist
POST  /v1/me/wishlist/items
DELETE /v1/me/wishlist/items/{id}

GET   /v1/me/notifications
PATCH /v1/me/notifications/{id}/read
POST  /v1/me/notifications/read-all
GET   /v1/notifications/stream
```

Returns, reviews, dan tickets mengikuti pola ownership yang sama. Download endpoint tidak
mengembalikan permanent asset URL.
