import { useState } from 'react';
import type { ProductDetail } from '@starsuperscare/contracts';

export const ProductGallery = ({ product }: { product: ProductDetail }) => {
  const allImages = product.images.length > 0
    ? product.images
    : (product.primaryImage ? [product.primaryImage] : []);
  const [selectedImage, setSelectedImage] = useState<string | null>(
    allImages.length > 0 ? allImages[0] : null,
  );

  return (
    <div className='flex flex-col gap-4'>
      <div className='aspect-square relative bg-gray-100 rounded-lg overflow-hidden border border-gray-200'>
        {selectedImage
          ? (
            <img
              src={selectedImage}
              alt={product.name}
              className='object-cover w-full h-full'
            />
          )
          : (
            <div className='flex items-center justify-center w-full h-full text-gray-400'>
              Tidak ada gambar
            </div>
          )}
      </div>
      {allImages.length > 1 && (
        <div className='grid grid-cols-5 gap-2'>
          {allImages.map((img: string, i: number) => (
            <button
              key={i}
              type='button'
              onClick={() => setSelectedImage(img)}
              className={`aspect-square bg-gray-100 rounded cursor-pointer overflow-hidden border-2 transition-colors ${
                selectedImage === img
                  ? 'border-blue-600'
                  : 'border-transparent hover:border-blue-400'
              }`}
            >
              <img
                src={img}
                alt={`${product.name} - thumbnail ${i + 1}`}
                className='object-cover w-full h-full'
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
