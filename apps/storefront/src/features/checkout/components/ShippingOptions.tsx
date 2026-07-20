import { useShippingOptions } from '../api/useCheckout.ts';
import { formatIDR } from '@starsuperscare/ui';
import { Loader2 } from 'lucide-react';

interface ShippingOptionsProps {
  province: string;
  city: string;
  postalCode: string;
  selectedOptionId: string | null;
  onSelect: (optionId: string) => void;
  onNext: () => void;
}

export function ShippingOptions(
  { province, city, postalCode, selectedOptionId, onSelect, onNext }: ShippingOptionsProps,
) {
  const { data, isLoading } = useShippingOptions(province, city, postalCode);

  if (isLoading) {
    return (
      <div className='flex flex-col items-center justify-center py-12'>
        <Loader2 className='w-8 h-8 animate-spin text-gray-500 mb-4' />
        <p className='text-gray-500'>Mencari opsi pengiriman...</p>
      </div>
    );
  }

  const options = data?.options || [];
  return (
    <div className='space-y-6'>
      {options.length === 0
        ? (
          <p className='text-gray-500 text-center py-8'>
            Tidak ada opsi pengiriman tersedia ke alamat Anda.
          </p>
        )
        : (
          <div className='space-y-3'>
            {options.map((option: any) => (
              <div
                key={option.id}
                onClick={() => onSelect(option.id)}
                className={`p-4 border rounded-xl cursor-pointer transition-all flex items-center justify-between ${
                  selectedOptionId === option.id
                    ? 'border-black bg-gray-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className='flex items-center gap-4'>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      selectedOptionId === option.id ? 'border-black' : 'border-gray-300'
                    }`}
                  >
                    {selectedOptionId === option.id && (
                      <div className='w-3 h-3 rounded-full bg-black' />
                    )}
                  </div>
                  <div>
                    <h3 className='font-medium'>{option.name}</h3>
                    {option.description && (
                      <p className='text-sm text-gray-500'>{option.description}</p>
                    )}
                    <p className='text-xs text-gray-400 mt-1'>Estimasi: {option.estimatedDays}</p>
                  </div>
                </div>
                <div className='font-semibold'>{formatIDR(option.cost)}</div>
              </div>
            ))}
          </div>
        )}

      <div className='flex justify-end pt-4'>
        <button
          type='button'
          onClick={onNext}
          disabled={!selectedOptionId}
          className='bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50'
        >
          Lanjutkan ke Pembayaran
        </button>
      </div>
    </div>
  );
}
