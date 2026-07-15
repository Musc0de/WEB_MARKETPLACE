import { useEffect, useState } from 'react';
import type { ProductDetail } from '@starsuperscare/contracts';

export const ProductGallery = ({ product }: { product: ProductDetail }) => {
  const allImages = product.images.length > 0
    ? product.images
    : (product.primaryImage ? [product.primaryImage] : []);
  const [selectedImage, setSelectedImage] = useState<string | null>(
    allImages.length > 0 ? allImages[0] : null,
  );
  const [direction, setDirection] = useState<1 | -1>(1);

  useEffect(() => {
    if (allImages.length <= 1) return;

    // Preload all images in the background to cache them for a smooth slider experience
    allImages.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });

    const interval = setInterval(() => {
      setSelectedImage((prevImg) => {
        if (!prevImg) return allImages[0];
        const prevIdx = allImages.indexOf(prevImg);

        if (prevIdx >= allImages.length - 1) {
          setDirection(-1);
          return allImages[prevIdx - 1];
        }
        if (prevIdx <= 0) {
          setDirection(1);
          return allImages[prevIdx + 1];
        }
        return allImages[prevIdx + direction];
      });
    }, 3500); // 3.5 seconds

    return () => clearInterval(interval);
  }, [allImages, direction]);

  return (
    <div className='flex flex-col gap-4'>
      <div className='aspect-square relative bg-gray-100 rounded-lg overflow-hidden border border-gray-200'>
        {selectedImage
          ? (
            <img
              src={selectedImage}
              alt={product.name}
              className='object-cover w-full h-full'
              loading='eager'
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
