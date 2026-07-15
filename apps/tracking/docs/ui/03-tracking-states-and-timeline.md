# Tracking States and Timeline

## State labels

- Order received.
- Preparing shipment.
- Handed to courier.
- In transit.
- Out for delivery.
- Delivered.
- Delivery exception/delayed.
- Returned to sender.

Map provider-specific events into stable user-facing labels while preserving original event detail
in expandable metadata if useful.

## Timeline rules

- Newest/current status visually emphasized.
- Timestamp uses id-ID/Asia-Jakarta.
- Future/estimated step clearly distinguished from completed event.
- Duplicate provider events deduped.
- No exact location if privacy/safety policy forbids it.
