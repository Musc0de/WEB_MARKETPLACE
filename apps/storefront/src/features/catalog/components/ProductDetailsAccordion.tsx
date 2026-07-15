import { useState } from 'react';
import type { ProductDetail } from '@starsuperscare/contracts';
import { ProductReviews } from './ProductReviews.tsx';
import { Text } from '@starsuperscare/ui';

export const ProductDetailsAccordion = ({ product }: { product: ProductDetail }) => {
  const [activeTab, setActiveTab] = useState<'description' | 'shipping' | 'reviews'>('description');

  return (
    <div className='mt-12 border-t border-gray-200 pt-8'>
      <div className='flex border-b border-gray-200 mb-6 overflow-x-auto no-scrollbar'>
        <button
          type='button'
          onClick={() => setActiveTab('description')}
          className={`px-6 py-3 font-medium text-sm transition-colors whitespace-nowrap border-b-2 ${
            activeTab === 'description'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Deskripsi & Manfaat
        </button>
        <button
          type='button'
          onClick={() => setActiveTab('shipping')}
          className={`px-6 py-3 font-medium text-sm transition-colors whitespace-nowrap border-b-2 ${
            activeTab === 'shipping'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Info Pengiriman
        </button>
        <button
          type='button'
          onClick={() => setActiveTab('reviews')}
          className={`px-6 py-3 font-medium text-sm transition-colors whitespace-nowrap border-b-2 ${
            activeTab === 'reviews'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Ulasan ({product.reviewCount})
        </button>
      </div>

      <div className='min-h-[300px]'>
        {activeTab === 'description' && (
          <div className='prose prose-sm md:prose-base text-gray-600 max-w-none'>
            {product.description
              ? <p className='whitespace-pre-wrap'>{product.description}</p>
              : <p className='italic text-gray-400'>Belum ada deskripsi untuk produk ini.</p>}
            {/* Stub content as requested for benefits, composition, warning */}
            <div className='mt-8 bg-blue-50 p-6 rounded-lg'>
              <h4 className='text-lg font-bold text-blue-900 mb-3'>Informasi Tambahan (Sistem)</h4>
              <ul className='list-disc list-inside text-blue-800 space-y-2'>
                <li>Manfaat: (Menunggu pembaruan data)</li>
                <li>Komposisi: (Menunggu pembaruan data)</li>
                <li>Cara Penggunaan: (Menunggu pembaruan data)</li>
                <li>Peringatan: Jauhkan dari jangkauan anak-anak (Default)</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'shipping' && (
          <div className='text-gray-600 flex flex-col gap-4'>
            <h4 className='font-bold text-gray-900'>Kebijakan Pengiriman Umum</h4>
            <Text>
              Produk digital akan dikirimkan secara instan ke email Anda setelah pembayaran berhasil
              dikonfirmasi.
            </Text>
            <Text>
              Untuk produk fisik, pengiriman dilakukan pada hari kerja (Senin - Jumat). Pesanan
              sebelum jam 14:00 WIB akan diproses di hari yang sama.
            </Text>
            <div className='bg-yellow-50 p-4 rounded-md border border-yellow-200 mt-4 text-sm text-yellow-800'>
              Catatan: Pastikan alamat pengiriman Anda sudah benar sebelum melakukan checkout.
            </div>
          </div>
        )}

        {activeTab === 'reviews' && <ProductReviews productId={product.id} />}
      </div>
    </div>
  );
};
