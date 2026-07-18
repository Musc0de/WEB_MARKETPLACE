import { H1, Text } from '@starsuperscare/ui';

export function PrivacyPage() {
  return (
    <div className='max-w-4xl mx-auto py-12 px-4 animate-in fade-in duration-500'>
      <div className='mb-10 text-center'>
        <H1 className='tracking-tight'>Kebijakan Privasi</H1>
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
            Pengumpulan Informasi
          </h2>
          <Text>
            Kami mengumpulkan informasi dari Anda ketika Anda mendaftar di situs kami, masuk ke akun
            Anda, melakukan pembelian, mengikuti kontes, atau ketika Anda keluar dari situs.
            Informasi yang dikumpulkan mencakup{' '}
            <strong className='text-foreground'>
              nama, alamat email, nomor telepon, dan kartu kredit.
            </strong>
          </Text>
        </section>

        <section>
          <h2 className='text-2xl font-black text-foreground border-b border-border/60 pb-3 mb-5 flex items-center gap-3'>
            <span className='bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 w-8 h-8 rounded-full flex items-center justify-center text-sm'>
              2
            </span>
            Penggunaan Informasi
          </h2>
          <Text>
            Setiap informasi yang kami kumpulkan dari Anda dapat digunakan untuk menyesuaikan
            pengalaman Anda dan menanggapi kebutuhan individual Anda, menyediakan konten periklanan
            yang disesuaikan, meningkatkan situs web kami, dan meningkatkan layanan pelanggan kami.
          </Text>
        </section>

        <section>
          <h2 className='text-2xl font-black text-foreground border-b border-border/60 pb-3 mb-5 flex items-center gap-3'>
            <span className='bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 w-8 h-8 rounded-full flex items-center justify-center text-sm'>
              3
            </span>
            Perlindungan Informasi
          </h2>
          <Text>
            Kami menerapkan berbagai langkah keamanan untuk menjaga keamanan informasi pribadi Anda.
            Kami menggunakan <strong className='text-foreground'>enkripsi mutakhir</strong>{' '}
            untuk melindungi informasi sensitif yang dikirimkan secara online.
          </Text>
        </section>

        <section>
          <h2 className='text-2xl font-black text-foreground border-b border-border/60 pb-3 mb-5 flex items-center gap-3'>
            <span className='bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 w-8 h-8 rounded-full flex items-center justify-center text-sm'>
              4
            </span>
            Penggunaan Cookie
          </h2>
          <Text>
            Ya. Cookie adalah file kecil yang ditransfer situs atau penyedia layanannya ke hard
            drive komputer Anda melalui browser Web Anda (jika Anda mengizinkan). Hal ini
            memungkinkan situs untuk mengenali browser Anda dan menangkap serta mengingat informasi
            tertentu demi mempermudah Anda.
          </Text>
        </section>

        <section>
          <h2 className='text-2xl font-black text-foreground border-b border-border/60 pb-3 mb-5 flex items-center gap-3'>
            <span className='bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 w-8 h-8 rounded-full flex items-center justify-center text-sm'>
              5
            </span>
            Pengungkapan kepada Pihak Ketiga
          </h2>
          <Text>
            Kami{' '}
            <strong className='text-destructive'>
              tidak menjual, memperdagangkan, atau mentransfer
            </strong>{' '}
            informasi pribadi Anda yang dapat diidentifikasi secara pribadi ke pihak luar. Ini tidak
            termasuk pihak ketiga tepercaya yang membantu kami beroperasi, melakukan bisnis, atau
            melayani Anda.
          </Text>
        </section>

        <section>
          <h2 className='text-2xl font-black text-foreground border-b border-border/60 pb-3 mb-5 flex items-center gap-3'>
            <span className='bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 w-8 h-8 rounded-full flex items-center justify-center text-sm'>
              6
            </span>
            Persetujuan Anda
          </h2>
          <Text>
            Dengan menggunakan situs kami, Anda menyetujui Kebijakan Privasi kami. Jika kami
            memutuskan untuk mengubah kebijakan privasi kami, kami akan memposting perubahan
            tersebut di halaman ini.
          </Text>
        </section>
      </div>
    </div>
  );
}
