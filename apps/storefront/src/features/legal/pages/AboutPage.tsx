import { H1, Text } from '@starsuperscare/ui';

export function AboutPage() {
  return (
    <div className='max-w-4xl mx-auto py-12 px-4'>
      <H1 className='mb-8 text-center'>Tentang Kami</H1>
      
      <div className='grid md:grid-cols-2 gap-12 items-center mb-16'>
        <div>
          <h2 className='text-2xl font-bold mb-4 text-blue-600'>Visi Kami</h2>
          <Text className='text-gray-700 leading-relaxed'>
            Menjadi platform e-commerce terdepan di Indonesia yang memberikan kemudahan, keamanan, dan pengalaman berbelanja terbaik bagi semua orang. Kami percaya bahwa teknologi harus memberdayakan masyarakat dan mempermudah kehidupan sehari-hari.
          </Text>
        </div>
        <div className='bg-blue-50 p-8 rounded-2xl border border-blue-100'>
          <h2 className='text-2xl font-bold mb-4 text-blue-600'>Misi Kami</h2>
          <ul className='space-y-3 text-gray-700 list-disc pl-5'>
            <li>Menyediakan produk berkualitas tinggi dengan harga yang kompetitif.</li>
            <li>Memberikan pelayanan pelanggan yang luar biasa dan responsif.</li>
            <li>Membangun ekosistem belanja yang aman dan transparan.</li>
            <li>Mendukung UMKM lokal untuk tumbuh melalui platform kami.</li>
          </ul>
        </div>
      </div>

      <div className='bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center'>
        <h2 className='text-2xl font-bold mb-4'>Cerita Kami</h2>
        <Text className='text-gray-700 leading-relaxed max-w-2xl mx-auto'>
          StarSuperScare didirikan pada tahun 2026 dengan tujuan sederhana: menghilangkan kerumitan dalam berbelanja online. Berawal dari ide kecil di sebuah garasi, kami terus berinovasi untuk membangun sistem marketplace yang tangguh, terpercaya, dan disukai oleh jutaan pelanggan di seluruh penjuru negeri.
        </Text>
      </div>
    </div>
  );
}
