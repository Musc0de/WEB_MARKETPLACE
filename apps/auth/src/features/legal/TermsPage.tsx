import { motion } from 'framer-motion';
import { ArrowLeft, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export function TermsPage() {
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
            <FileText className='w-6 h-6' />
          </div>
          <h1 className='text-3xl font-bold text-gray-900'>Syarat dan Ketentuan</h1>
        </div>
        <p className='text-gray-500'>Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric', day: 'numeric' })}</p>
      </motion.div>

      <motion.div variants={itemVariants} className='prose prose-sm prose-indigo text-gray-600'>
        <p>Selamat datang di StarSuperScare. Dengan mengakses atau menggunakan layanan kami, Anda setuju untuk mematuhi dan terikat oleh Ketentuan Layanan ini. Silakan baca dengan seksama.</p>
        
        <h3 className='font-semibold text-gray-900 text-lg mt-6 mb-2'>1. Penggunaan Layanan</h3>
        <p>Anda setuju untuk menggunakan layanan kami hanya untuk tujuan yang sah dan dengan cara yang tidak melanggar hak-hak orang lain, membatasi, atau menghalangi siapa pun dalam menggunakan dan menikmati layanan kami.</p>

        <h3 className='font-semibold text-gray-900 text-lg mt-6 mb-2'>2. Akun Pengguna</h3>
        <p>Saat mendaftar untuk sebuah akun, Anda harus memberikan informasi yang akurat, lengkap, dan terkini setiap saat. Anda bertanggung jawab untuk menjaga kerahasiaan kata sandi Anda dan untuk setiap aktivitas atau tindakan di bawah kata sandi Anda.</p>

        <h3 className='font-semibold text-gray-900 text-lg mt-6 mb-2'>3. Penghentian</h3>
        <p>Kami berhak untuk menghentikan atau menangguhkan akses Anda ke layanan kami kapan saja, tanpa pemberitahuan atau tanggung jawab sebelumnya, atas alasan apa pun, termasuk tanpa batasan jika Anda melanggar Ketentuan ini.</p>

        <h3 className='font-semibold text-gray-900 text-lg mt-6 mb-2'>4. Batasan Tanggung Jawab</h3>
        <p>Dalam keadaan apa pun, StarSuperScare, maupun para direktur, karyawan, mitra, agen, pemasok, atau afiliasinya, tidak akan bertanggung jawab atas kerugian tidak langsung, insidental, khusus, konsekuensial, atau hukuman, termasuk hilangnya keuntungan, data, atau niat baik yang diakibatkan oleh akses Anda ke atau penggunaan dari layanan kami.</p>

      </motion.div>
    </motion.div>
  );
}
