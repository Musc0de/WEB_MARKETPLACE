import { useRef, useState } from 'react';
import type { ProductDetail } from '@starsuperscare/contracts';
import { ProductReviews } from './ProductReviews.tsx';
import { Text } from '@starsuperscare/ui';
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
          <div className='text-gray-600 flex flex-col gap-3 text-sm'>
            <h4 className='font-bold text-gray-900 text-base'>
              Kebijakan Pengiriman Umum
            </h4>
            <Text>
              Produk digital akan dikirimkan secara instan ke email Anda setelah pembayaran berhasil
              dikonfirmasi.
            </Text>
            <Text>
              Untuk produk fisik, pengiriman dilakukan pada hari kerja (Senin - Jumat). Pesanan
              sebelum jam 14:00 WIB akan diproses di hari yang sama.
            </Text>
            <div className='bg-yellow-50 p-3 rounded-md border border-yellow-200 mt-2 text-xs text-yellow-800'>
              Catatan: Pastikan alamat pengiriman Anda sudah benar sebelum melakukan checkout.
            </div>
          </div>
        )}

        {/* ── Reviews ── */}
        {activeTab === 'reviews' && <ProductReviews productId={product.id} />}
      </div>
    </div>
  );
};
