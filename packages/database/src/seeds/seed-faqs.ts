import { db } from '../db';
import { faqs } from '../schema/aftercare';

async function seedFaqs() {
  const newFaqs = [
    {
      question: 'Bagaimana cara melacak pesanan saya?',
      answer:
        'Anda dapat melacak pesanan melalui menu "Pesanan Saya" di dashboard. Klik pada pesanan yang ingin dilacak untuk melihat status pengiriman secara real-time dan nomor resi kurir.',
      category: 'Pengiriman',
      isPublished: true,
      sortOrder: 1,
    },
    {
      question: 'Berapa lama waktu pengiriman barang?',
      answer:
        'Waktu pengiriman bergantung pada layanan kurir yang dipilih dan lokasi tujuan. Estimasi standar adalah 1-3 hari kerja untuk pengiriman reguler, dan maksimal 24 jam untuk pengiriman instan/sameday.',
      category: 'Pengiriman',
      isPublished: true,
      sortOrder: 2,
    },
    {
      question: 'Bagaimana cara mengajukan pengembalian dana (refund)?',
      answer:
        'Untuk mengajukan pengembalian dana, Anda dapat membuat tiket bantuan (Support Ticket) dengan memilih kategori "Pengembalian Dana & Retur". Mohon sertakan nomor pesanan, foto produk yang diterima, dan alasan pengembalian untuk mempercepat proses.',
      category: 'Pembayaran & Refund',
      isPublished: true,
      sortOrder: 3,
    },
    {
      question: 'Apakah produk yang dijual di sini 100% original?',
      answer:
        'Ya, semua penjual di platform kami telah melewati proses verifikasi ketat. Kami menjamin keaslian dan kualitas seluruh produk yang ada di marketplace kami.',
      category: 'Produk & Kualitas',
      isPublished: true,
      sortOrder: 4,
    },
    {
      question: 'Bagaimana cara memberikan ulasan produk?',
      answer:
        'Setelah pesanan berstatus "Selesai", Anda dapat memberikan ulasan melalui halaman "Ulasan" di dashboard. Anda hanya dapat mengulas produk yang telah Anda beli dan terima.',
      category: 'Ulasan Produk',
      isPublished: true,
      sortOrder: 5,
    },
    {
      question: 'Metode pembayaran apa saja yang didukung?',
      answer:
        'Kami mendukung berbagai metode pembayaran seperti Transfer Bank (Virtual Account), Kartu Kredit/Debit, e-Wallet (Gopay, OVO, Dana, ShopeePay), dan pembayaran instan lainnya (QRIS).',
      category: 'Pembayaran & Refund',
      isPublished: true,
      sortOrder: 6,
    },
  ];

  console.log('Seeding FAQs...');

  // First clear existing FAQs to avoid duplicates if they were dummy data
  await db.delete(faqs);

  // Insert new ones
  for (const faq of newFaqs) {
    await db.insert(faqs).values(faq);
  }

  console.log('Successfully seeded FAQs!');
  process.exit(0);
}

seedFaqs().catch((err) => {
  console.error('Error seeding FAQs:', err);
  process.exit(1);
});
