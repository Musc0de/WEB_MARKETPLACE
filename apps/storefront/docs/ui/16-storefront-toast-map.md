# Storefront Gooey Toast Map

| Event               | Type         | Desktop               | Mobile                      | Action                 |
| ------------------- | ------------ | --------------------- | --------------------------- | ---------------------- |
| Add to cart success | success      | top-right             | bottom-center above CTA/nav | View cart              |
| Wishlist added      | success/info | top-right             | bottom-center               | View wishlist optional |
| Wishlist removed    | info         | top-right             | bottom-center               | Undo                   |
| Quantity rollback   | warning      | top-right             | bottom-center               | Review item            |
| Voucher rejected    | error        | top-right + inline    | bottom-center + inline      | none                   |
| Price changed       | warning      | top-right             | bottom-center               | Review cart            |
| Checkout validation | error        | toast + error summary | toast + scroll to error     | none                   |
| Payment pending     | info         | page status preferred | page status preferred       | View order             |
| Network offline     | warning      | banner preferred      | banner preferred            | Retry optional         |

Never mount toaster inside product card, cart item, or page component.
