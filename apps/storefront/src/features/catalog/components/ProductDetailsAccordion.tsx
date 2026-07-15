import { useRef, useState } from 'react';
import type { ProductDetail } from '@starsuperscare/contracts';
import { ProductReviews } from './ProductReviews.tsx';
import { ChevronDown } from 'lucide-react';

// ─── Smooth-collapse Description Block ───────────────────────────────────────
const COLLAPSED_HEIGHT = 160; // px shown when collapsed

function DescriptionBlock({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Only show toggle if content is long enough
  const needsToggle = text.length > 300;

  return (
    <div>
      <div
        ref={contentRef}
        className='relative overflow-hidden transition-all duration-500 ease-in-out'
        style={{
          maxHeight: needsToggle && !expanded ? `${COLLAPSED_HEIGHT}px` : '2000px',
        }}
      >
        <p className='whitespace-pre-wrap text-gray-700 leading-relaxed text-sm'>
          {text}
        </p>

        {/* Fade-out gradient when collapsed */}
        {needsToggle && !expanded && (
          <div className='absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none' />
        )}
      </div>

      {needsToggle && (
        <button
          type='button'
          onClick={() => setExpanded((v) => !v)}
          className='mt-2 flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors'
        >
          {expanded ? 'Sembunyikan' : 'Lihat Selengkapnya'}
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
          />
        </button>
      )}
    </div>
  );
}

// ─── Main Accordion ───────────────────────────────────────────────────────────
export const ProductDetailsAccordion = (
  { product }: { product: ProductDetail },
) => {
  const [activeTab, setActiveTab] = useState<
    'description' | 'shipping' | 'reviews'
  >('description');

  return (
    <div className='mt-10 border-t border-gray-200 pt-6'>
      {/* Tab Nav */}
      <div className='flex border-b border-gray-200 mb-5 overflow-x-auto no-scrollbar'>
        {(
          [
            { key: 'description', label: 'Deskripsi & Manfaat' },
            { key: 'shipping', label: 'Info Pengiriman' },
            { key: 'reviews', label: `Ulasan (${product.reviewCount})` },
          ] as const
        ).map(({ key, label }) => (
          <button
            key={key}
            type='button'
            onClick={() => setActiveTab(key)}
            className={`px-5 py-2.5 font-medium text-sm transition-colors whitespace-nowrap border-b-2 ${
              activeTab === key
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className='min-h-[200px]'>
        {/* ── Description ── */}
        {activeTab === 'description' && (
          <div className='max-w-none'>
            {product.description
              ? <DescriptionBlock text={product.description} />
              : (
                <p className='italic text-gray-400 text-sm'>
                  Belum ada deskripsi untuk produk ini.
                </p>
              )}
          </div>
        )}

        {/* ── Shipping ── */}
        {activeTab === 'shipping' && (
          <div className='flex flex-col gap-6 text-sm text-gray-600'>
            {/* Section 1 */}
            <div>
              <h4 className='font-bold text-gray-900 text-base mb-2'>
                1. Ketentuan Pengiriman Produk Digital
              </h4>
              <p className='leading-relaxed mb-3'>
                Kami memahami bahwa efisiensi waktu adalah prioritas Anda. Oleh karena itu, seluruh
                produk digital (seperti e-book, lisensi software, template, atau akses kursus) akan
                dikirimkan secara otomatis dan instan ke alamat email yang Anda daftarkan segera
                setelah sistem kami menerima konfirmasi pembayaran yang sukses.
              </p>
              <div className='bg-blue-50 border border-blue-200 rounded-md p-3 text-blue-800 text-xs leading-relaxed'>
                <span className='font-semibold'>Catatan Penting:</span> Mohon periksa folder{' '}
                <em>Spam</em> atau <em>Promotions</em>{' '}
                di email Anda apabila tautan akses tidak muncul di kotak masuk utama dalam waktu 5
                menit. Jika setelah 1 jam produk belum diterima, silakan hubungi tim dukungan
                pelanggan kami dengan melampirkan bukti pembayaran.
              </div>
            </div>

            {/* Section 2 */}
            <div>
              <h4 className='font-bold text-gray-900 text-base mb-2'>
                2. Ketentuan Pengiriman Produk Fisik
              </h4>
              <p className='leading-relaxed mb-3'>
                Kami berkomitmen untuk memastikan setiap produk fisik sampai ke tangan Anda dengan
                kondisi terbaik. Pengiriman produk fisik dilakukan pada hari kerja, yaitu Senin
                hingga Jumat (09:00 – 17:00 WIB), dengan ketentuan sebagai berikut:
              </p>
              <ul className='flex flex-col gap-2'>
                <li className='flex gap-2'>
                  <span className='mt-0.5 text-blue-500 font-bold shrink-0'>
                    ▸
                  </span>
                  <span>
                    <strong className='text-gray-800'>
                      Batas Waktu Pemrosesan:
                    </strong>{' '}
                    Pesanan yang masuk dan pembayarannya terverifikasi sebelum jam 14:00 WIB akan
                    kami proses dan serahkan kepada kurir pada hari yang sama.
                  </span>
                </li>
                <li className='flex gap-2'>
                  <span className='mt-0.5 text-blue-500 font-bold shrink-0'>
                    ▸
                  </span>
                  <span>
                    <strong className='text-gray-800'>
                      Pesanan di Luar Jam Operasional:
                    </strong>{' '}
                    Pesanan yang masuk setelah jam 14:00 WIB, pada akhir pekan (Sabtu-Minggu), atau
                    pada hari libur nasional, akan diproses pada hari kerja berikutnya.
                  </span>
                </li>
                <li className='flex gap-2'>
                  <span className='mt-0.5 text-blue-500 font-bold shrink-0'>
                    ▸
                  </span>
                  <span>
                    <strong className='text-gray-800'>
                      Estimasi Waktu:
                    </strong>{' '}
                    Durasi pengiriman akan menyesuaikan dengan layanan kurir yang Anda pilih saat
                    checkout. Kami akan memberikan nomor resi segera setelah paket diproses agar
                    Anda dapat memantau perjalanan paket secara real-time.
                  </span>
                </li>
              </ul>
            </div>

            {/* Section 3 */}
            <div>
              <h4 className='font-bold text-gray-900 text-base mb-2'>
                3. Verifikasi Data & Alamat Pengiriman
              </h4>
              <p className='leading-relaxed mb-3'>
                Ketepatan data adalah tanggung jawab bersama demi kelancaran pengiriman. Sebelum
                menyelesaikan transaksi (checkout), kami sangat menyarankan Anda untuk:
              </p>
              <ul className='flex flex-col gap-2'>
                <li className='flex gap-2'>
                  <span className='mt-0.5 text-green-500 font-bold shrink-0'>
                    ✓
                  </span>
                  <span>
                    Memastikan detail alamat pengiriman (nama penerima, alamat lengkap, kode pos,
                    dan nomor telepon aktif) sudah benar dan akurat.
                  </span>
                </li>
                <li className='flex gap-2'>
                  <span className='mt-0.5 text-yellow-500 font-bold shrink-0'>
                    ⚠
                  </span>
                  <span>
                    Perubahan alamat setelah pesanan diproses tidak dapat kami jamin keberhasilannya
                    karena paket mungkin sudah dalam penanganan pihak logistik.
                  </span>
                </li>
                <li className='flex gap-2'>
                  <span className='mt-0.5 text-red-400 font-bold shrink-0'>
                    ✕
                  </span>
                  <span>
                    Kami tidak bertanggung jawab atas keterlambatan atau kegagalan pengiriman yang
                    disebabkan oleh ketidaklengkapan data alamat yang diberikan oleh pembeli.
                  </span>
                </li>
              </ul>
            </div>

            {/* Section 4 */}
            <div className='bg-green-50 border border-green-200 rounded-md p-4'>
              <h4 className='font-bold text-green-800 text-sm mb-1'>
                4. Kendala & Bantuan
              </h4>
              <p className='text-green-700 text-xs leading-relaxed'>
                Apabila terjadi kendala pada proses pengiriman, baik itu kendala teknis pada
                pengiriman digital maupun keterlambatan pengiriman fisik oleh pihak ekspedisi, tim
                kami siap membantu Anda. Jangan ragu untuk menghubungi layanan pelanggan kami
                melalui detail kontak yang tersedia di halaman utama situs kami.
              </p>
            </div>
          </div>
        )}

        {/* ── Reviews ── */}
        {activeTab === 'reviews' && <ProductReviews productId={product.id} />}
      </div>
    </div>
  );
};
