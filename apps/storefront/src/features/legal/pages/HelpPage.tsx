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
          <h2 className='text-xl font-bold mb-3'>Bisakah saya membatalkan pesanan saya?</h2>
          <Text className='text-gray-600'>
            Ya, pesanan dapat dibatalkan secara langsung melalui menu{' '}
            <strong>Detail Pesanan</strong>{' '}
            (bisa diakses via Lacak Pesanan), asalkan pesanan tersebut masih dalam status{' '}
            <strong>Menunggu Pembayaran</strong> atau{' '}
            <strong>Dibayar</strong>. Jika pesanan sudah diproses dan berstatus{' '}
            <strong>Dikirim</strong>, fitur pembatalan tidak dapat lagi digunakan. Jika Anda sudah
            membayar, dana akan otomatis di-refund ke metode pembayaran Anda.
          </Text>
        </section>

        <section className='bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
          <h2 className='text-xl font-bold mb-3'>
            Bagaimana cara mengajukan komplain atau retur barang?
          </h2>
          <Text className='text-gray-600'>
            Kami memastikan setiap produk yang Anda beli sampai dengan aman di tangan Anda. Jika
            terdapat ketidaksesuaian atau cacat produk, Anda dapat mengajukan{' '}
            <strong>Pengembalian Barang</strong>{' '}
            melalui halaman Detail Pesanan Anda secara online. Anda memiliki waktu maksimal{' '}
            <strong>7 hari</strong>{' '}
            setelah status pesanan berubah menjadi "Terkirim" / "Berhasil" untuk melakukan
            pengajuan. Jangan lupa siapkan foto atau video bukti unboxing.
          </Text>
        </section>
      </div>
    </div>
  );
}
