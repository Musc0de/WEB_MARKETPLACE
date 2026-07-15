# Motion and Feedback

## Motion hierarchy

- Micro: hover/press/focus 120–180ms.
- Component: accordion, dropdown, tab 180–240ms.
- Page/overlay: drawer/modal 220–360ms.
- Gooey Toast mengikuti animation preset library tetapi harus menghormati reduced motion.

## Button feedback

- Press: subtle scale/translate, tidak lebih dari 2%.
- Loading: label stabil bila memungkinkan, spinner tidak mengubah lebar.
- Success: toast atau inline confirmation; jangan membuat button hijau permanen tanpa alasan.

## Optimistic UI

Diperbolehkan untuk wishlist, notification read, dan cart quantity jika rollback jelas. Checkout, payment, refund, dan inventory adjustment harus menunggu konfirmasi server.

## Error

Error menjelaskan apa yang gagal, dampaknya, dan langkah berikutnya. Jangan hanya menulis “Something went wrong”.
