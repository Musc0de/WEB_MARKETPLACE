# Toast Event Policy

## Toast-worthy

- User-triggered action selesai/gagal.
- Important realtime event yang relevan terhadap current user.
- Undoable optimistic action.
- Short async operation update.

## Not toast-worthy

- Initial page load.
- Setiap keystroke/validation.
- Setiap SSE heartbeat.
- Setiap row pada batch.
- Long-running operation tanpa persistent status.
- Critical payment result tanpa result page.

## Dedupe

Gunakan stable event key untuk realtime event. Update existing toast untuk promise/progress, jangan
membuat toast baru pada setiap phase.
