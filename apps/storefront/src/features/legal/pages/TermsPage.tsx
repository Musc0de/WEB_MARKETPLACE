import { H1, Text } from '@starsuperscare/ui';

export function TermsPage() {
  return (
    <div className='max-w-4xl mx-auto py-12 px-4 animate-in fade-in duration-500'>
      <div className='mb-10 text-center'>
        <H1 className='tracking-tight'>Syarat & Ketentuan</H1>
        <Text className='text-muted-foreground mt-3 font-medium bg-muted/50 inline-block px-4 py-1.5 rounded-full border border-border/50'>
          Pembaruan Terakhir:{' '}
          <span className='font-bold text-foreground'>
            {new Date().toLocaleDateString('id-ID')}
          </span>
        </Text>
      </div>

      <div className='bg-card p-6 md:p-10 rounded-3xl shadow-sm border border-border/60 space-y-10 text-muted-foreground font-medium leading-relaxed'>
        <section>
          <h2 className='text-2xl font-black text-foreground border-b border-border/60 pb-3 mb-5 flex items-center gap-3'>
            <span className='bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 w-8 h-8 rounded-full flex items-center justify-center text-sm'>
              1
            </span>
            Penerimaan Syarat
          </h2>
          <Text>
            Dengan mengakses dan menggunakan StarSuperScare Marketplace, Anda menyetujui untuk
            terikat oleh Syarat dan Ketentuan ini. Jika Anda tidak setuju dengan bagian apa pun dari
            persyaratan ini, Anda tidak diperkenankan menggunakan layanan kami.
          </Text>
        </section>

        <section>
          <h2 className='text-2xl font-black text-foreground border-b border-border/60 pb-3 mb-5 flex items-center gap-3'>
            <span className='bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 w-8 h-8 rounded-full flex items-center justify-center text-sm'>
              2
            </span>
            Penggunaan Layanan
          </h2>
          <Text>
            Anda setuju untuk menggunakan layanan kami hanya untuk tujuan yang sah dan dengan cara
            yang tidak melanggar hak atau membatasi penggunaan platform oleh pihak lain.
          </Text>
        </section>

        <section>
          <h2 className='text-2xl font-black text-foreground border-b border-border/60 pb-3 mb-5 flex items-center gap-3'>
            <span className='bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 w-8 h-8 rounded-full flex items-center justify-center text-sm'>
              3
            </span>
            Akun Pengguna
          </h2>
          <Text>
            Saat membuat akun, Anda harus memberikan informasi yang akurat dan lengkap. Anda
            bertanggung jawab untuk menjaga kerahasiaan kata sandi Anda dan untuk semua aktivitas
            yang terjadi di bawah akun Anda.
          </Text>
        </section>

        <section>
          <h2 className='text-2xl font-black text-foreground border-b border-border/60 pb-3 mb-5 flex items-center gap-3'>
            <span className='bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 w-8 h-8 rounded-full flex items-center justify-center text-sm'>
              4
            </span>
            Pembelian dan Pembayaran
          </h2>
          <Text>
            Semua harga di marketplace dapat berubah sewaktu-waktu. Kami berhak menolak atau
            membatalkan pesanan kapan saja dengan alasan tertentu, termasuk namun tidak terbatas
            pada ketersediaan produk atau kesalahan pada harga produk.
          </Text>
        </section>

        <section>
          <h2 className='text-2xl font-black text-foreground border-b border-border/60 pb-3 mb-5 flex items-center gap-3'>
            <span className='bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 w-8 h-8 rounded-full flex items-center justify-center text-sm'>
              5
            </span>
            Kebijakan Pengembalian
          </h2>
          <Text>
            Silakan tinjau <strong className='text-foreground'>Kebijakan Pengembalian</strong>{' '}
            kami yang merupakan bagian terpisah namun tetap terintegrasi dengan Syarat dan Ketentuan
            ini.
          </Text>
        </section>

        <section>
          <h2 className='text-2xl font-black text-foreground border-b border-border/60 pb-3 mb-5 flex items-center gap-3'>
            <span className='bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 w-8 h-8 rounded-full flex items-center justify-center text-sm'>
              6
            </span>
            Hak Kekayaan Intelektual
          </h2>
          <Text>
            Seluruh konten, merek dagang, logo, dan kekayaan intelektual lainnya di platform ini
            adalah milik <strong className='text-foreground'>StarSuperScare Marketplace</strong>
            {' '}
            atau pemegang lisensinya dan dilindungi oleh undang-undang hak cipta yang berlaku.
          </Text>
        </section>
      </div>
    </div>
  );
}
