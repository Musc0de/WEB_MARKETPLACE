# Auth Gooey Toast Map

| Event                  | Toast                  | Persistent UI                 |
| ---------------------- | ---------------------- | ----------------------------- |
| Login success          | success                | redirect/session state        |
| Invalid credential     | error summary optional | inline form error wajib       |
| Signup success         | success                | verification-sent panel wajib |
| Verification accepted  | success                | result page wajib             |
| Token expired          | error                  | expired panel + resend wajib  |
| Recovery request       | info/success generic   | sent panel wajib              |
| Password reset success | success                | success panel + login CTA     |
| Session expired        | warning                | login context message         |
| Rate limited           | warning                | retry information inline      |

Desktop `top-right`; mobile `bottom-center`. Satu toaster pada auth root.
