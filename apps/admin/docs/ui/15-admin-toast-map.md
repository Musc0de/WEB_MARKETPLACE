# Admin Gooey Toast Map

| Event                | Type              | Required persistent detail   |
| -------------------- | ----------------- | ---------------------------- |
| Record saved         | success           | updated state on page        |
| Publish/unpublish    | success/warning   | status badge/audit           |
| Upload               | promise           | media list/result            |
| Inventory adjustment | success/error     | movement ledger              |
| Status transition    | success/error     | timeline/audit               |
| Batch operation      | promise/update    | result summary               |
| Export               | info then success | download center/link         |
| Conflict             | warning/error     | conflict panel/reload action |
| Permission denied    | error             | disabled/permission state    |
| Support reply        | success           | message in thread            |

Desktop top-right. Tablet/mobile bottom-center. Do not emit a toast for every row in a batch.
