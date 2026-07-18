import { H1, Text } from '@starsuperscare/ui';

export function AboutPage() {
  return (
    <div className='max-w-4xl mx-auto py-12 px-4 animate-in fade-in duration-500'>
      <div className='mb-12 text-center'>
        <H1 className='tracking-tight'>Tentang Kami</H1>
        <Text className='text-muted-foreground mt-3 font-medium'>
          Mengenal lebih dekat StarSuperScare Marketplace dan komitmen kami.
        </Text>
      </div>

      <div className='grid md:grid-cols-2 gap-8 items-center mb-12'>
        <div className='bg-card p-8 md:p-10 rounded-3xl shadow-sm border border-border/60'>
          <h2 className='text-2xl font-black mb-5 text-indigo-600 dark:text-indigo-400 flex items-center gap-3'>
            <div className='w-2 h-8 bg-indigo-500 rounded-full'></div>
            Visi Kami
          </h2>
          <Text className='text-muted-foreground font-medium leading-relaxed'>
            Menjadi platform e-commerce terdepan di Indonesia yang memberikan kemudahan, keamanan,
            dan pengalaman berbelanja terbaik bagi semua orang. Kami percaya bahwa teknologi harus
            memberdayakan masyarakat dan mempermudah kehidupan sehari-hari.
          </Text>
        </div>
        <div className='bg-indigo-500/5 p-8 md:p-10 rounded-3xl border border-indigo-500/20'>
          <h2 className='text-2xl font-black mb-5 text-indigo-600 dark:text-indigo-400 flex items-center gap-3'>
            <div className='w-2 h-8 bg-indigo-500 rounded-full'></div>
            Misi Kami
          </h2>
          <ul className='space-y-4 text-muted-foreground font-medium list-none'>
            <li className='flex items-start gap-3'>
              <span className='text-indigo-500 font-bold'>&bull;</span>
              Menyediakan produk berkualitas tinggi dengan harga yang kompetitif.
            </li>
            <li className='flex items-start gap-3'>
              <span className='text-indigo-500 font-bold'>&bull;</span>
              Memberikan pelayanan pelanggan yang luar biasa dan responsif.
            </li>
            <li className='flex items-start gap-3'>
              <span className='text-indigo-500 font-bold'>&bull;</span>
              Membangun ekosistem belanja yang aman dan transparan.
            </li>
            <li className='flex items-start gap-3'>
              <span className='text-indigo-500 font-bold'>&bull;</span>
              Mendukung UMKM lokal untuk tumbuh melalui platform kami.
            </li>
          </ul>
        </div>
      </div>

      <div className='bg-card p-8 md:p-12 rounded-3xl shadow-sm border border-border/60 text-center relative overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none'>
        </div>
        <div className='relative z-10'>
          <h2 className='text-3xl font-black mb-6 text-foreground'>Cerita Kami</h2>
          <Text className='text-muted-foreground font-medium leading-relaxed max-w-2xl mx-auto'>
            StarSuperScare didirikan pada tahun 2026 dengan tujuan sederhana: menghilangkan
            kerumitan dalam berbelanja online. Berawal dari ide kecil di sebuah garasi, kami terus
            berinovasi untuk membangun sistem marketplace yang tangguh, terpercaya, dan disukai oleh
            jutaan pelanggan di seluruh penjuru negeri.
          </Text>
        </div>
      </div>
    </div>
  );
}
