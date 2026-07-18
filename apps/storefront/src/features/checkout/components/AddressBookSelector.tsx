import { useEffect, useState } from 'react';
import { client } from '../../../lib/api.ts';
import { AddressForm } from './AddressForm.tsx';
import type { ShippingAddress } from '@starsuperscare/contracts';
import { toast } from '@starsuperscare/ui';
import { CheckCircle2, MapPin, Plus, X } from 'lucide-react';

interface AddressBookSelectorProps {
  userEmail: string;
  onSelect: (address: ShippingAddress & { email: string }) => void;
}

export function AddressBookSelector({ userEmail, onSelect }: AddressBookSelectorProps) {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setIsLoading(true);
      const res = await client.v1.me.addresses.$get();
      if (res.ok) {
        const data = await res.json();
        setAddresses(data.data || []);

        // Auto-show modal if no addresses exist
        if (!data.data || data.data.length === 0) {
          setShowModal(true);
        } else {
          // Auto-select primary or first
          const primary = data.data.find((a: any) => a.isPrimaryShipping) || data.data[0];
          if (primary) {
            setSelectedId(primary.id);
          }
        }
      }
    } catch (_err) {
      toast.error('Gagal memuat buku alamat');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = async (
    data: ShippingAddress & { email: string; isPrimaryShipping?: boolean },
  ) => {
    setIsSubmitting(true);
    try {
      const payload = {
        type: 'shipping' as const,
        recipientName: data.fullName,
        phone: data.phoneNumber,
        addressLine1: data.streetAddress,
        city: data.city,
        province: data.province,
        postalCode: data.postalCode,
        country: data.country || 'ID',
        isPrimaryShipping: data.isPrimaryShipping || false,
      };

      const res = await client.v1.me.addresses.$post({ json: payload });

      if (res.ok) {
        toast.success('Alamat berhasil ditambahkan');
        setShowModal(false);
        await fetchAddresses(); // reload to get the new address and its ID
      } else {
        const errData = await res.json();
        toast.error((errData as any).message || 'Gagal menyimpan alamat');
      }
    } catch (_err: any) {
      toast.error('Terjadi kesalahan saat menyimpan alamat');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmSelection = () => {
    const selected = addresses.find((a) => a.id === selectedId);
    if (!selected) {
      toast.error('Pilih alamat pengiriman terlebih dahulu');
      return;
    }

    onSelect({
      fullName: selected.recipientName,
      email: userEmail,
      phoneNumber: selected.phone,
      streetAddress: selected.addressLine1 +
        (selected.addressLine2 ? ', ' + selected.addressLine2 : ''),
      province: selected.province,
      city: selected.city,
      postalCode: selected.postalCode,
      country: selected.country || 'ID',
      notes: '',
    });
  };

  if (isLoading) {
    return (
      <div className='flex justify-center py-12'>
        <div className='animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full' />
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {addresses.length === 0
        ? (
          <div className='text-center py-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50'>
            <MapPin className='w-12 h-12 text-gray-400 mx-auto mb-3' />
            <p className='text-gray-600 mb-4'>Anda belum memiliki alamat tersimpan</p>
            <button
              type='button'
              onClick={() => setShowModal(true)}
              className='inline-flex items-center gap-2 bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800'
            >
              <Plus className='w-4 h-4' /> Tambah Alamat Baru
            </button>
          </div>
        )
        : (
          <div className='space-y-3'>
            {addresses.map((addr) => (
              <div
                key={addr.id}
                onClick={() => setSelectedId(addr.id)}
                className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedId === addr.id
                    ? 'border-blue-600 bg-blue-50/50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className='flex justify-between items-start mb-2'>
                  <div className='flex items-center gap-2'>
                    <span className='font-bold text-gray-900'>{addr.recipientName}</span>
                    <span className='text-gray-500'>|</span>
                    <span className='text-gray-600'>{addr.phone}</span>
                  </div>
                  {addr.isPrimaryShipping && (
                    <span className='text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 px-2 py-1 rounded'>
                      Utama
                    </span>
                  )}
                </div>
                <p className='text-gray-600 text-sm leading-relaxed'>
                  {addr.addressLine1} {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}
                  <br />
                  {addr.city}, {addr.province} {addr.postalCode}
                </p>

                {selectedId === addr.id && (
                  <div className='absolute -right-2 -top-2 bg-blue-600 text-white rounded-full p-0.5 shadow-sm'>
                    <CheckCircle2 className='w-5 h-5' />
                  </div>
                )}
              </div>
            ))}

            <button
              type='button'
              onClick={() => setShowModal(true)}
              className='w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors flex items-center justify-center gap-2'
            >
              <Plus className='w-4 h-4' /> Tambah Alamat Baru
            </button>

            <div className='pt-4'>
              <button
                type='button'
                onClick={handleConfirmSelection}
                disabled={!selectedId}
                className='w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-300'
              >
                Gunakan Alamat Ini
              </button>
            </div>
          </div>
        )}

      {/* Modal Tambah Alamat Baru */}
      {showModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm'>
          <div className='bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden'>
            <div className='px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10'>
              <h3 className='text-xl font-bold'>Tambah Alamat Baru</h3>
              {addresses.length > 0 && (
                <button
                  type='button'
                  onClick={() => setShowModal(false)}
                  className='p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500'
                >
                  <X className='w-5 h-5' />
                </button>
              )}
            </div>
            <div className='p-6 overflow-y-auto'>
              <AddressForm
                initialValues={{ email: userEmail }}
                hideEmail
                showPrimaryOption
                onSubmit={handleAddNew}
                isLoading={isSubmitting}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
