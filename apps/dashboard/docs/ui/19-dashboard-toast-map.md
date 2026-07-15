# Dashboard Client Gooey Toast Map

| Event                      | Type                         | Action/Note                        |
| -------------------------- | ---------------------------- | ---------------------------------- |
| Profile saved              | success                      | none                               |
| Password changed           | success                      | security notification also created |
| Session revoked            | success                      | none                               |
| Buy again                  | success                      | View cart                          |
| Invoice ready/downloaded   | success                      | Open optional                      |
| Address default changed    | success                      | none                               |
| Wishlist removed           | info                         | Undo if reversible                 |
| New important notification | info/success                 | View                               |
| Return submitted           | success                      | View return                        |
| Refund status update       | info/success                 | View refund                        |
| Support message sent       | success                      | inline status also present         |
| Review saved               | success                      | View review optional               |
| SSE disconnected           | warning only after threshold | Retry/refresh optional             |

Desktop top-right; mobile bottom-center above bottom navigation/sticky action.
