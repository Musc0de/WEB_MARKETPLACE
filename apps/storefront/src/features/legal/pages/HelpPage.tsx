import { H1, Text } from '@starsuperscare/ui';

export function HelpPage() {
  return (
    <div className='max-w-3xl mx-auto py-12 px-4'>
      <H1 className='mb-6'>Pusat Bantuan</H1>
      <div className='space-y-6'>
        <section className='bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
          <h2 className='text-xl font-bold mb-3'>Bagaimana cara melacak pesanan saya?</h2>
          <Text className='text-gray-600'>
            Anda dapat melacak pesanan Anda melalui menu "Lacak Pesanan" di bagian atas atau bawah
            halaman. Anda akan memerlukan Nomor Resi yang dikirimkan ke email Anda saat pesanan
            diproses.
          </Text>
        </section>

        <section className='bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
          <h2 className='text-xl font-bold mb-3'>Bagaimana cara melakukan pemesanan?</h2>
          <Text className='text-gray-600'>
            1. Cari produk yang Anda inginkan menggunakan kolom pencarian.<br />
            2. Klik produk dan tekan tombol "Tambah ke Keranjang" atau "Beli Sekarang".<br />
            3. Isi detail pengiriman Anda dengan lengkap.<br />
            4. Lakukan pembayaran sesuai dengan metode yang Anda pilih.
          </Text>
        </section>

        <section className='bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
          <h2 className='text-xl font-bold mb-3'>Apakah ada garansi pengiriman?</h2>
          <Text className='text-gray-600'>
            Ya, kami memastikan setiap produk yang Anda beli sampai dengan aman di tangan Anda. Jika
            ada kerusakan akibat pengiriman, silakan ajukan komplain melalui menu Pengembalian Dana
            maksimal 2x24 jam setelah pesanan diterima.
          </Text>
        </section>
      </div>
    </div>
  );
}
