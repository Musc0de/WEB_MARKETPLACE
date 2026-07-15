# Tracking Gooey Toast Map

- Invalid input format: inline; no toast required.
- Provider/API unavailable: error toast + inline retry.
- Status refreshed: no toast unless user explicitly requested and meaningful change occurred.
- New status found: info/success toast; timeline remains authoritative.
- Tracking code copied: success toast with short duration.
- Offline: banner preferred; toast only when action fails.

Desktop top-right; mobile bottom-center.
