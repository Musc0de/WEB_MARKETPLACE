import { useState } from 'react';
import type { ShippingAddress } from '@starsuperscare/contracts';

interface AddressFormProps {
  initialValues?: Partial<ShippingAddress> & { email?: string };
  onSubmit: (data: ShippingAddress & { email: string }) => void;
  isLoading?: boolean;
}

export function AddressForm({ initialValues, onSubmit, isLoading }: AddressFormProps) {
  const [formData, setFormData] = useState({
    fullName: initialValues?.fullName || '',
    email: initialValues?.email || '',
    phoneNumber: initialValues?.phoneNumber || '',
    streetAddress: initialValues?.streetAddress || '',
    province: initialValues?.province || '',
    city: initialValues?.city || '',
    postalCode: initialValues?.postalCode || '',
    notes: initialValues?.notes || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName) newErrors.fullName = 'Nama wajib diisi';
    if (!formData.email) newErrors.email = 'Email wajib diisi';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Email tidak valid';
    if (!formData.phoneNumber) newErrors.phoneNumber = 'No HP wajib diisi';
    if (!formData.streetAddress) newErrors.streetAddress = 'Alamat wajib diisi';
    if (!formData.province) newErrors.province = 'Provinsi wajib diisi';
    if (!formData.city) newErrors.city = 'Kota wajib diisi';
    if (!formData.postalCode) newErrors.postalCode = 'Kode pos wajib diisi';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData as any);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm font-medium mb-1'>Nama Lengkap</label>
          <input
            name='fullName'
            value={formData.fullName}
            onChange={handleChange}
            className={`w-full border rounded p-2 ${
              errors.fullName ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.fullName && <p className='text-red-500 text-xs mt-1'>{errors.fullName}</p>}
        </div>
        <div>
          <label className='block text-sm font-medium mb-1'>Email</label>
          <input
            name='email'
            type='email'
            value={formData.email}
            onChange={handleChange}
            className={`w-full border rounded p-2 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.email && <p className='text-red-500 text-xs mt-1'>{errors.email}</p>}
        </div>
      </div>

      <div>
        <label className='block text-sm font-medium mb-1'>No HP</label>
        <input
          name='phoneNumber'
          value={formData.phoneNumber}
          onChange={handleChange}
          className={`w-full border rounded p-2 ${
            errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.phoneNumber && <p className='text-red-500 text-xs mt-1'>{errors.phoneNumber}</p>}
      </div>

      <div>
        <label className='block text-sm font-medium mb-1'>Alamat Lengkap</label>
        <textarea
          name='streetAddress'
          value={formData.streetAddress}
          onChange={handleChange}
          rows={3}
          className={`w-full border rounded p-2 ${
            errors.streetAddress ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.streetAddress && <p className='text-red-500 text-xs mt-1'>{errors.streetAddress}
        </p>}
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div>
          <label className='block text-sm font-medium mb-1'>Provinsi</label>
          <input
            name='province'
            value={formData.province}
            onChange={handleChange}
            className={`w-full border rounded p-2 ${
              errors.province ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.province && <p className='text-red-500 text-xs mt-1'>{errors.province}</p>}
        </div>
        <div>
          <label className='block text-sm font-medium mb-1'>Kota</label>
          <input
            name='city'
            value={formData.city}
            onChange={handleChange}
            className={`w-full border rounded p-2 ${
              errors.city ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.city && <p className='text-red-500 text-xs mt-1'>{errors.city}</p>}
        </div>
        <div>
          <label className='block text-sm font-medium mb-1'>Kode Pos</label>
          <input
            name='postalCode'
            value={formData.postalCode}
            onChange={handleChange}
            className={`w-full border rounded p-2 ${
              errors.postalCode ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.postalCode && <p className='text-red-500 text-xs mt-1'>{errors.postalCode}</p>}
        </div>
      </div>

      <div>
        <label className='block text-sm font-medium mb-1'>Catatan Tambahan (Opsional)</label>
        <input
          name='notes'
          value={formData.notes}
          onChange={handleChange}
          className='w-full border border-gray-300 rounded p-2'
        />
      </div>

      <div className='pt-4 flex justify-end'>
        <button
          type='submit'
          disabled={isLoading}
          className='bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50'
        >
          {isLoading ? 'Menyimpan...' : 'Lanjutkan ke Pengiriman'}
        </button>
      </div>
    </form>
  );
}
