import React, { useState } from 'react';
import useSWR from 'swr';
import { client } from '../../lib/api.ts';
import { Button, Input, Label } from '@starsuperscare/ui';

const fetchAddresses = async () => {
  const res = await client.v1.me.addresses.$get();
  if (!res.ok) throw new Error('Failed to fetch addresses');
  const result = await res.json();
  return result.data;
};

export function AddressesPage() {
  const { data: addresses, error, isLoading, mutate } = useSWR(
    '/api/v1/me/addresses',
    fetchAddresses,
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type: 'shipping' as 'shipping' | 'billing' | 'both',
    label: '',
    recipientName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    district: '',
    city: '',
    province: '',
    postalCode: '',
    country: 'ID',
    isPrimaryShipping: false,
    isPrimaryBilling: false,
  });
  const [isSaving, setIsSaving] = useState(false);

  const resetForm = () => {
    setFormData({
      type: 'shipping',
      label: '',
      recipientName: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      district: '',
      city: '',
      province: '',
      postalCode: '',
      country: 'ID',
      isPrimaryShipping: false,
      isPrimaryBilling: false,
    });
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleEdit = (address: any) => {
    setFormData({ ...address });
    setEditingId(address.id);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus alamat ini?')) return;
    try {
      const res = await client.v1.me.addresses[':id'].$delete({ param: { id } });
      if (!res.ok) throw new Error('Gagal menghapus');
      mutate();
    } catch (_err) {
      alert('Error menghapus alamat');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingId) {
        const res = await client.v1.me.addresses[':id'].$put({
          param: { id: editingId },
          json: formData,
        });
        if (!res.ok) throw new Error('Gagal memperbarui alamat');
      } else {
        const res = await client.v1.me.addresses.$post({
          json: formData,
        });
        if (!res.ok) throw new Error('Gagal menambah alamat');
      }
      mutate();
      resetForm();
    } catch (_err) {
      alert('Terjadi kesalahan saat menyimpan alamat.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className='max-w-4xl space-y-8'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold text-gray-900'>Buku Alamat</h1>
        {!isFormOpen && <Button onClick={() => setIsFormOpen(true)}>Tambah Alamat</Button>}
      </div>

      {isFormOpen && (
        <div className='bg-white rounded-lg shadow p-6'>
          <h2 className='text-lg font-semibold mb-4'>
            {editingId ? 'Edit Alamat' : 'Alamat Baru'}
          </h2>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <div className='space-y-2 sm:col-span-2'>
                <Label htmlFor='label'>Label (opsional, mis. "Rumah", "Kantor")</Label>
                <Input
                  id='label'
                  value={formData.label || ''}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='recipientName'>Nama Penerima</Label>
                <Input
                  id='recipientName'
                  required
                  value={formData.recipientName}
                  onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='phone'>Telepon</Label>
                <Input
                  id='phone'
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className='space-y-2 sm:col-span-2'>
                <Label htmlFor='addressLine1'>Alamat Baris 1</Label>
                <Input
                  id='addressLine1'
                  required
                  value={formData.addressLine1}
                  onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                />
              </div>
              <div className='space-y-2 sm:col-span-2'>
                <Label htmlFor='addressLine2'>Alamat Baris 2 (opsional)</Label>
                <Input
                  id='addressLine2'
                  value={formData.addressLine2 || ''}
                  onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='district'>Kecamatan/Kelurahan</Label>
                <Input
                  id='district'
                  value={formData.district || ''}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='city'>Kota/Kabupaten</Label>
                <Input
                  id='city'
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='province'>Provinsi</Label>
                <Input
                  id='province'
                  required
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='postalCode'>Kode Pos</Label>
                <Input
                  id='postalCode'
                  required
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                />
              </div>
            </div>

            <div className='pt-4 space-y-4'>
              <label className='flex items-center space-x-2'>
                <input
                  type='checkbox'
                  checked={formData.isPrimaryShipping}
                  onChange={(e) =>
                    setFormData({ ...formData, isPrimaryShipping: e.target.checked })}
                  className='rounded border-gray-300'
                />
                <span className='text-sm'>Jadikan Alamat Pengiriman Utama</span>
              </label>
              <label className='flex items-center space-x-2'>
                <input
                  type='checkbox'
                  checked={formData.isPrimaryBilling}
                  onChange={(e) => setFormData({ ...formData, isPrimaryBilling: e.target.checked })}
                  className='rounded border-gray-300'
                />
                <span className='text-sm'>Jadikan Alamat Penagihan Utama</span>
              </label>
            </div>

            <div className='flex space-x-4 pt-4'>
              <Button type='submit' disabled={isSaving}>
                {isSaving ? 'Menyimpan...' : 'Simpan Alamat'}
              </Button>
              <Button type='button' variant='outline' onClick={resetForm}>Batal</Button>
            </div>
          </form>
        </div>
      )}

      {isLoading
        ? <div>Memuat alamat...</div>
        : error
        ? <div className='text-red-500'>Gagal memuat alamat.</div>
        : (
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            {addresses?.length === 0
              ? <p className='text-gray-500 sm:col-span-2'>Belum ada alamat tersimpan.</p>
              : (
                addresses?.map((addr: any) => (
                  <div
                    key={addr.id}
                    className='bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col justify-between'
                  >
                    <div>
                      <div className='flex items-center space-x-2 mb-2'>
                        <h3 className='font-semibold text-gray-900'>{addr.label || 'Alamat'}</h3>
                        {addr.isPrimaryShipping && (
                          <span className='bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded'>
                            Utama (Kirim)
                          </span>
                        )}
                        {addr.isPrimaryBilling && (
                          <span className='bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded'>
                            Utama (Tagih)
                          </span>
                        )}
                      </div>
                      <p className='text-sm font-medium text-gray-800'>{addr.recipientName}</p>
                      <p className='text-sm text-gray-600'>{addr.phone}</p>
                      <p className='text-sm text-gray-600 mt-2'>{addr.addressLine1}</p>
                      {addr.addressLine2 && (
                        <p className='text-sm text-gray-600'>{addr.addressLine2}</p>
                      )}
                      <p className='text-sm text-gray-600'>
                        {addr.district ? `${addr.district}, ` : ''}
                        {addr.city}
                      </p>
                      <p className='text-sm text-gray-600'>{addr.province}, {addr.postalCode}</p>
                    </div>
                    <div className='mt-4 flex space-x-3 pt-4 border-t border-gray-100'>
                      <button
                        type='button'
                        onClick={() => handleEdit(addr)}
                        className='text-sm text-indigo-600 hover:text-indigo-900 font-medium'
                      >
                        Edit
                      </button>
                      <button
                        type='button'
                        onClick={() => handleDelete(addr.id)}
                        className='text-sm text-red-600 hover:text-red-900 font-medium'
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))
              )}
          </div>
        )}
    </div>
  );
}
