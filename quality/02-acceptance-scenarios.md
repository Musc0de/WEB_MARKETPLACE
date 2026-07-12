# Acceptance Scenarios

1. Guest menambah produk tanpa login dan cart tetap ada setelah refresh.
2. Guest login lalu guest cart dan account cart bergabung tanpa melebihi stok.
3. Product card menampilkan net sold dan stock terbaru.
4. `Beli Sekarang` tidak membuat order ganda saat tombol diklik dua kali.
5. Payment webhook yang sama dikirim tiga kali tetapi hanya satu invoice/account event tercipta.
6. Guest baru menerima invoice dan activation link, bukan plaintext password.
7. Setelah aktivasi, login username/password berhasil dan order terlihat.
8. Existing email tidak menghasilkan user duplikat.
9. Digital item hanya dapat diunduh oleh pemilik entitlement.
10. Signed download URL kedaluwarsa dan dapat dibuat ulang.
11. History default lima item dan filter date memakai ISO.
12. Notification SSE muncul realtime dan tetap ada setelah refresh sampai dibaca.
13. Refund finalized mengurangi net sold sesuai quantity.
14. User A tidak dapat membaca order/invoice User B meski mengetahui ID.
15. Admin action sensitif tercatat pada audit log.
16. Database transient error tidak menyebabkan double payment side effect.
17. Price berubah di antara cart dan checkout; server menolak/menampilkan total baru.
18. Out-of-stock item tidak dapat dibayar.
