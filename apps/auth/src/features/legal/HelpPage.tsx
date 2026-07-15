import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronDown, LifeBuoy } from 'lucide-react';
import { Link } from 'react-router-dom';

const faqs = [
  {
    question: 'Bagaimana cara membuat pesanan baru?',
    answer: 'Untuk membuat pesanan baru, pastikan Anda sudah masuk ke akun Anda. Buka menu Dasbor, lalu klik tombol "Pesanan Baru". Pilih layanan atau produk yang Anda inginkan, masukkan detail yang diperlukan, dan selesaikan pembayaran.',
  },
  {
    question: 'Bagaimana cara melacak pesanan saya?',
    answer: 'Setelah pesanan berhasil dibuat, Anda dapat melacaknya melalui Dasbor di bagian "Riwayat Pesanan". Anda juga akan menerima notifikasi email setiap kali ada pembaruan status pesanan Anda.',
  },
  {
    question: 'Bagaimana cara mereset kata sandi saya?',
    answer: 'Jika Anda lupa kata sandi, klik tautan "Lupa kata sandi?" di halaman login. Masukkan alamat email Anda, dan kami akan mengirimkan tautan untuk mengatur ulang kata sandi Anda.',
  },
  {
    question: 'Saya tidak menerima email verifikasi, apa yang harus dilakukan?',
    answer: 'Silakan periksa folder Spam atau Junk di email Anda. Jika Anda masih tidak dapat menemukannya, cobalah untuk meminta ulang pengiriman email dari halaman pendaftaran atau hubungi dukungan.',
  },
  {
    question: 'Bagaimana cara menghubungi tim dukungan?',
    answer: 'Jika Anda membutuhkan bantuan lebih lanjut, silakan hubungi tim dukungan kami di support@starsuperscare.com. Kami akan merespon dalam waktu 1x24 jam kerja.',
  }
];

function FAQItem({ faq, isOpen, onToggle }: { faq: typeof faqs[0], isOpen: boolean, onToggle: () => void }) {
  return (
    <div className='bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden'>
      <button
        type='button'
        onClick={onToggle}
        className='w-full flex items-center justify-between p-6 text-left focus:outline-none transition-colors hover:bg-gray-50/50'
      >
        <h2 className='font-semibold text-gray-900 text-base md:text-lg pr-4'>{faq.question}</h2>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className='flex-shrink-0 text-gray-400'
        >
          <ChevronDown className='w-5 h-5' />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className='px-6 pb-6 text-gray-600 text-sm leading-relaxed border-t border-gray-50 pt-4'>
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function HelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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
            <LifeBuoy className='w-6 h-6' />
          </div>
          <h1 className='text-3xl font-bold text-gray-900'>Pusat Bantuan</h1>
        </div>
        <p className='text-gray-500'>Temukan jawaban untuk pertanyaan umum (FAQ) atau pelajari cara menggunakan layanan kami.</p>
      </motion.div>

      <motion.div variants={itemVariants} className='space-y-4'>
        {faqs.map((faq, idx) => (
          <FAQItem
            key={idx}
            faq={faq}
            isOpen={openIndex === idx}
            onToggle={() => setOpenIndex(openIndex === idx ? null : idx)}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
