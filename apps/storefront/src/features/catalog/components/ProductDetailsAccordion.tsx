import { useRef, useState } from 'react';
import type { ProductDetail } from '@starsuperscare/contracts';
import { ProductReviews } from './ProductReviews.tsx';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Info,
  PackageCheck,
  ShieldAlert,
  Truck,
  XCircle,
} from 'lucide-react';

// ─── Smooth-collapse Description Block ───────────────────────────────────────
const COLLAPSED_HEIGHT = 160; // px shown when collapsed

function DescriptionBlock({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Only show toggle if content is long enough
  const needsToggle = text.length > 300;

  return (
    <div className='bg-card border border-border/60 p-5 lg:p-6 rounded-3xl shadow-sm'>
      <div
        ref={contentRef}
        className='relative overflow-hidden transition-all duration-500 ease-in-out'
        style={{
          maxHeight: needsToggle && !expanded ? `${COLLAPSED_HEIGHT}px` : '2000px',
        }}
      >
        <p className='whitespace-pre-wrap text-muted-foreground font-medium leading-relaxed text-sm'>
          {text}
        </p>

        {/* Fade-out gradient when collapsed */}
        {needsToggle && !expanded && (
          <div className='absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-card to-transparent pointer-events-none' />
        )}
      </div>

      {needsToggle && (
        <button
          type='button'
          onClick={() => setExpanded((v) => !v)}
          className='mt-3 flex items-center justify-center w-full py-2.5 gap-2 text-sm font-bold text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 bg-indigo-500/5 hover:bg-indigo-500/10 rounded-xl transition-colors active:scale-[0.98]'
        >
          {expanded ? 'Tutup Deskripsi' : 'Baca Selengkapnya'}
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
    <div className='mt-12'>
      {/* Tab Nav */}
      <div className='flex gap-2 overflow-x-auto no-scrollbar p-1.5 bg-muted/30 rounded-2xl border border-border/60 mb-6'>
        {(
          [
            { key: 'description', label: 'Deskripsi & Manfaat', icon: Info },
            { key: 'shipping', label: 'Info Pengiriman', icon: Truck },
            { key: 'reviews', label: `Ulasan (${product.reviewCount})`, icon: StarIcon },
          ] as const
        ).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type='button'
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-5 py-3 font-bold text-sm transition-all whitespace-nowrap rounded-xl shrink-0 justify-center active:scale-95 ${
              activeTab === key
                ? 'bg-background text-indigo-600 dark:text-indigo-400 shadow-sm border border-border/40'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <Icon className='w-4 h-4' />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className='min-h-[200px] animate-in fade-in duration-500'>
        {/* ── Description ── */}
        {activeTab === 'description' && (
          <div className='max-w-none'>
            {product.description
              ? <DescriptionBlock text={product.description} />
              : (
                <div className='py-12 flex flex-col items-center justify-center text-center bg-card border border-border/60 rounded-3xl'>
                  <Info className='w-10 h-10 text-muted-foreground/30 mb-3' />
                  <p className='font-bold text-muted-foreground'>
                    Belum ada deskripsi untuk produk ini.
                  </p>
                </div>
              )}
          </div>
        )}

        {/* ── Shipping ── */}
        {activeTab === 'shipping' && (
          <div className='flex flex-col gap-6 text-sm bg-card border border-border/60 p-5 lg:p-6 rounded-3xl shadow-sm'>
            {/* Section 1 */}
            <div>
              <h4 className='font-black text-foreground text-base mb-3 flex items-center gap-2'>
                <div className='w-1.5 h-4 bg-indigo-500 rounded-full' />
                Ketentuan Pengiriman Produk Digital
              </h4>
              <p className='leading-relaxed mb-4 text-muted-foreground font-medium'>
                Kami memahami bahwa efisiensi waktu adalah prioritas Anda. Oleh karena itu, seluruh
                produk digital (seperti e-book, lisensi software, template, atau akses kursus) akan
                dikirimkan secara otomatis dan instan ke alamat email yang Anda daftarkan segera
                setelah sistem kami menerima konfirmasi pembayaran yang sukses.
              </p>
              <div className='bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex gap-3'>
                <ShieldAlert className='w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5' />
                <p className='text-amber-800 dark:text-amber-300 text-xs leading-relaxed font-medium'>
                  <span className='font-bold'>Catatan Penting:</span> Mohon periksa folder{' '}
                  <em>Spam</em> atau <em>Promotions</em>{' '}
                  di email Anda apabila tautan akses tidak muncul di kotak masuk utama dalam waktu 5
                  menit. Jika setelah 1 jam produk belum diterima, silakan hubungi tim dukungan
                  pelanggan kami dengan melampirkan bukti pembayaran.
                </p>
              </div>
            </div>

            <hr className='border-border/60' />

            {/* Section 2 */}
            <div>
              <h4 className='font-black text-foreground text-base mb-3 flex items-center gap-2'>
                <div className='w-1.5 h-4 bg-emerald-500 rounded-full' />
                Ketentuan Pengiriman Produk Fisik
              </h4>
              <p className='leading-relaxed mb-4 text-muted-foreground font-medium'>
                Kami berkomitmen untuk memastikan setiap produk fisik sampai ke tangan Anda dengan
                kondisi terbaik. Pengiriman produk fisik dilakukan pada hari kerja, yaitu Senin
                hingga Jumat (09:00 – 17:00 WIB), dengan ketentuan sebagai berikut:
              </p>
              <ul className='flex flex-col gap-4 text-muted-foreground font-medium'>
                <li className='flex gap-3'>
                  <PackageCheck className='w-5 h-5 text-emerald-500 shrink-0 mt-0.5' />
                  <span>
                    <strong className='text-foreground'>Batas Waktu Pemrosesan:</strong>{' '}
                    Pesanan yang masuk dan pembayarannya terverifikasi sebelum jam 14:00 WIB akan
                    kami proses dan serahkan kepada kurir pada hari yang sama.
                  </span>
                </li>
                <li className='flex gap-3'>
                  <PackageCheck className='w-5 h-5 text-emerald-500 shrink-0 mt-0.5' />
                  <span>
                    <strong className='text-foreground'>Pesanan di Luar Jam Operasional:</strong>
                    {' '}
                    Pesanan yang masuk setelah jam 14:00 WIB, pada akhir pekan (Sabtu-Minggu), atau
                    pada hari libur nasional, akan diproses pada hari kerja berikutnya.
                  </span>
                </li>
              </ul>
            </div>

            <hr className='border-border/60' />

            {/* Section 3 */}
            <div>
              <h4 className='font-black text-foreground text-base mb-3 flex items-center gap-2'>
                <div className='w-1.5 h-4 bg-rose-500 rounded-full' />
                Verifikasi Data & Alamat Pengiriman
              </h4>
              <ul className='flex flex-col gap-4 font-medium text-muted-foreground bg-muted/30 p-5 rounded-2xl border border-border/40'>
                <li className='flex gap-3'>
                  <CheckCircle2 className='w-5 h-5 text-emerald-500 shrink-0 mt-0.5' />
                  <span>
                    Pastikan detail alamat pengiriman (nama penerima, alamat lengkap, kode pos, dan
                    nomor telepon aktif) sudah benar dan akurat.
                  </span>
                </li>
                <li className='flex gap-3'>
                  <AlertTriangle className='w-5 h-5 text-amber-500 shrink-0 mt-0.5' />
                  <span>
                    Perubahan alamat setelah pesanan diproses tidak dapat kami jamin
                    keberhasilannya.
                  </span>
                </li>
                <li className='flex gap-3'>
                  <XCircle className='w-5 h-5 text-rose-500 shrink-0 mt-0.5' />
                  <span>
                    Kami tidak bertanggung jawab atas keterlambatan jika data alamat tidak lengkap.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* ── Reviews ── */}
        {activeTab === 'reviews' && <ProductReviews productId={product.id} />}
      </div>
    </div>
  );
};

function StarIcon(props: any) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      {...props}
    >
      <polygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2' />
    </svg>
  );
}
