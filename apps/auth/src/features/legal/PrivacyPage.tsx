import { motion } from 'framer-motion';
import { ArrowLeft, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export function PrivacyPage() {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div variants={containerVariants} initial='hidden' animate='visible' className='w-full max-w-2xl mx-auto'>
      <motion.div variants={itemVariants} className='mb-8'>
        <Link to='/login' className='inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors'>
          <ArrowLeft className='w-4 h-4 mr-2' />
          Kembali
        </Link>
        <div className='flex items-center gap-3 mb-4'>
          <div className='p-2 bg-indigo-100 text-indigo-600 rounded-lg'>
            <Shield className='w-6 h-6' />
          </div>
          <h1 className='text-3xl font-bold text-gray-900'>Kebijakan Privasi</h1>
        </div>
        <p className='text-gray-500'>Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric', day: 'numeric' })}</p>
      </motion.div>

      <motion.div variants={itemVariants} className='prose prose-sm prose-indigo text-gray-600'>
        <p>Di StarSuperScare, privasi Anda sangat penting bagi kami. Kebijakan ini menguraikan jenis informasi yang kami kumpulkan, cara kami menggunakannya, dan langkah-langkah yang kami ambil untuk melindunginya.</p>
        
        <h3 className='font-semibold text-gray-900 text-lg mt-6 mb-2'>1. Informasi yang Kami Kumpulkan</h3>
        <p>Kami mengumpulkan informasi yang Anda berikan secara langsung kepada kami saat mendaftar akun, seperti nama pengguna dan alamat email Anda. Kami juga dapat mengumpulkan informasi non-pribadi seperti alamat IP dan data penggunaan browser.</p>

        <h3 className='font-semibold text-gray-900 text-lg mt-6 mb-2'>2. Bagaimana Kami Menggunakan Informasi Anda</h3>
        <p>Kami menggunakan informasi yang kami kumpulkan untuk mengoperasikan, memelihara, dan menyediakan fitur-fitur layanan kami. Ini juga digunakan untuk berkomunikasi dengan Anda terkait akun, pembaruan, dan masalah dukungan.</p>

        <h3 className='font-semibold text-gray-900 text-lg mt-6 mb-2'>3. Berbagi Informasi Anda</h3>
        <p>Kami tidak menjual atau menyewakan informasi pribadi Anda kepada pihak ketiga. Kami mungkin membagikan informasi secara agregat yang tidak mengidentifikasi Anda secara pribadi untuk keperluan analitik layanan.</p>

        <h3 className='font-semibold text-gray-900 text-lg mt-6 mb-2'>4. Keamanan Data</h3>
        <p>Kami menerapkan langkah-langkah keamanan standar industri untuk melindungi data Anda. Namun, tidak ada metode transmisi di Internet yang 100% aman, sehingga kami tidak dapat menjamin keamanan mutlak.</p>

      </motion.div>
    </motion.div>
  );
}
