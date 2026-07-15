import { H1, H2, Text } from '@starsuperscare/ui';

export function TermsPage() {
  return (
    <div className='max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-white rounded-lg shadow-sm mt-8 mb-16'>
      <div className='space-y-8'>
        <div className='text-center space-y-4'>
          <H1>Syarat & Ketentuan</H1>
          <Text className='text-gray-500'>
            Pembaruan Terakhir: {new Date().toLocaleDateString('id-ID')}
          </Text>
        </div>

        <div className='space-y-6 text-gray-700 leading-relaxed'>
          <section className='space-y-3'>
            <H2 className='text-xl'>1. Penerimaan Syarat</H2>
            <Text>
              Dengan mengakses dan menggunakan StarSuperScare Marketplace, Anda menyetujui untuk
              terikat oleh Syarat dan Ketentuan ini. Jika Anda tidak setuju dengan bagian apa pun
              dari persyaratan ini, Anda tidak diperkenankan menggunakan layanan kami.
            </Text>
          </section>

          <section className='space-y-3'>
            <H2 className='text-xl'>2. Penggunaan Layanan</H2>
            <Text>
              Anda setuju untuk menggunakan layanan kami hanya untuk tujuan yang sah dan dengan cara
              yang tidak melanggar hak atau membatasi penggunaan platform oleh pihak lain.
            </Text>
          </section>

          <section className='space-y-3'>
            <H2 className='text-xl'>3. Akun Pengguna</H2>
            <Text>
              Saat membuat akun, Anda harus memberikan informasi yang akurat dan lengkap. Anda
              bertanggung jawab untuk menjaga kerahasiaan kata sandi Anda dan untuk semua aktivitas
              yang terjadi di bawah akun Anda.
            </Text>
          </section>

          <section className='space-y-3'>
            <H2 className='text-xl'>4. Pembelian dan Pembayaran</H2>
            <Text>
              Semua harga di marketplace dapat berubah sewaktu-waktu. Kami berhak menolak atau
              membatalkan pesanan kapan saja dengan alasan tertentu, termasuk namun tidak terbatas
              pada ketersediaan produk atau kesalahan pada harga produk.
            </Text>
          </section>

          <section className='space-y-3'>
            <H2 className='text-xl'>5. Kebijakan Pengembalian</H2>
            <Text>
              Silakan tinjau Kebijakan Pengembalian kami yang merupakan bagian terpisah namun tetap
              terintegrasi dengan Syarat dan Ketentuan ini.
            </Text>
          </section>

          <section className='space-y-3'>
            <H2 className='text-xl'>6. Hak Kekayaan Intelektual</H2>
            <Text>
              Seluruh konten, merek dagang, logo, dan kekayaan intelektual lainnya di platform ini
              adalah milik StarSuperScare Marketplace atau pemegang lisensinya dan dilindungi oleh
              undang-undang hak cipta yang berlaku.
            </Text>
          </section>
        </div>
      </div>
    </div>
  );
}
