import React, { useState } from 'react';
import useSWR from 'swr';
import { client } from '../../lib/api.ts';
import { Button, Input, Label, toast } from '@starsuperscare/ui';
import {
  BookUser,
  Building,
  Edit2,
  Hash,
  Home,
  Loader2,
  Map,
  MapPin,
  Navigation,
  Phone,
  Plus,
  Save,
  Trash2,
  User,
} from 'lucide-react';

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
    globalThis.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus alamat ini?')) return;
    try {
      const res = await client.v1.me.addresses[':id'].$delete({ param: { id } });
      if (!res.ok) throw new Error('Gagal menghapus');
      toast.success('Alamat berhasil dihapus!');
      mutate();
    } catch (err: any) {
      toast.error(err.message || 'Error menghapus alamat');
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
        toast.success('Alamat berhasil diperbarui!');
      } else {
        const res = await client.v1.me.addresses.$post({
          json: formData,
        });
        if (!res.ok) throw new Error('Gagal menambah alamat');
        toast.success('Alamat baru berhasil ditambahkan!');
      }
      mutate();
      resetForm();
    } catch (err: any) {
      toast.error(err.message || 'Terjadi kesalahan saat menyimpan alamat.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className='max-w-5xl mx-auto pb-12 animate-in fade-in duration-500'>
      {/* Header Banner */}
      <div className='relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 p-8 sm:p-10 shadow-xl mb-8 border border-sky-900/50'>
        <div className='absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none'>
          <div className='absolute -top-24 -right-12 w-64 h-64 bg-sky-500 rounded-full blur-[80px]' />
          <div className='absolute -bottom-24 -left-12 w-64 h-64 bg-cyan-500 rounded-full blur-[80px]' />
        </div>

        <div className='relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6'>
          <div className='flex flex-col sm:flex-row items-center gap-6'>
            <div className='w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-sky-500/20 backdrop-blur-md border border-sky-500/30 flex items-center justify-center shadow-[0_0_30px_-5px_rgba(14,165,233,0.4)]'>
              <MapPin className='w-10 h-10 sm:w-12 sm:h-12 text-sky-300' />
            </div>
            <div className='text-center sm:text-left'>
              <h1 className='text-3xl sm:text-4xl font-bold text-white mb-2 tracking-tight'>
                Buku Alamat
              </h1>
              <p className='text-sky-200 font-medium text-sm sm:text-base max-w-lg'>
                Kelola alamat pengiriman dan penagihan Anda untuk mempermudah proses checkout
                pesanan.
              </p>
            </div>
          </div>
          {!isFormOpen && (
            <Button
              onClick={() => setIsFormOpen(true)}
              className='rounded-xl shadow-lg shadow-sky-500/20 bg-sky-500 hover:bg-sky-600 text-white font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]'
            >
              <Plus className='w-5 h-5 mr-2' />
              Tambah Alamat Baru
            </Button>
          )}
        </div>
      </div>

      {isFormOpen && (
        <div className='bg-card dark:bg-background rounded-3xl p-6 sm:p-8 shadow-sm border border-border/60 mb-8 animate-in slide-in-from-top-4 fade-in duration-300'>
          <div className='flex items-center gap-3 mb-6'>
            <div className='w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center'>
              <BookUser className='w-5 h-5 text-blue-600 dark:text-blue-400' />
            </div>
            <h2 className='text-xl font-bold text-foreground'>
              {editingId ? 'Edit Alamat' : 'Form Alamat Baru'}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
              <div className='space-y-2.5 sm:col-span-2'>
                <Label htmlFor='label' className='text-muted-foreground font-semibold ml-1'>
                  Label Alamat
                </Label>
                <div className='relative'>
                  <Building className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50' />
                  <Input
                    id='label'
                    value={formData.label || ''}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    className='pl-11 h-12 rounded-xl border-input/60 focus:border-blue-500 focus:ring-blue-500/20 text-foreground bg-background'
                    placeholder='Mis. "Rumah", "Kantor", "Apartemen"'
                  />
                </div>
              </div>

              <div className='space-y-2.5'>
                <Label htmlFor='recipientName' className='text-muted-foreground font-semibold ml-1'>
                  Nama Penerima
                </Label>
                <div className='relative'>
                  <User className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50' />
                  <Input
                    id='recipientName'
                    required
                    value={formData.recipientName}
                    onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                    className='pl-11 h-12 rounded-xl border-input/60 focus:border-blue-500 focus:ring-blue-500/20 text-foreground bg-background'
                    placeholder='Nama lengkap penerima'
                  />
                </div>
              </div>

              <div className='space-y-2.5'>
                <Label htmlFor='phone' className='text-muted-foreground font-semibold ml-1'>
                  Nomor Telepon
                </Label>
                <div className='relative'>
                  <Phone className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50' />
                  <Input
                    id='phone'
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className='pl-11 h-12 rounded-xl border-input/60 focus:border-blue-500 focus:ring-blue-500/20 text-foreground bg-background'
                    placeholder='Contoh: 081234567890'
                  />
                </div>
              </div>

              <div className='space-y-2.5 sm:col-span-2'>
                <Label htmlFor='addressLine1' className='text-muted-foreground font-semibold ml-1'>
                  Alamat Baris 1
                </Label>
                <div className='relative'>
                  <MapPin className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50' />
                  <Input
                    id='addressLine1'
                    required
                    value={formData.addressLine1}
                    onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                    className='pl-11 h-12 rounded-xl border-input/60 focus:border-blue-500 focus:ring-blue-500/20 text-foreground bg-background'
                    placeholder='Nama jalan, gedung, no. rumah'
                  />
                </div>
              </div>

              <div className='space-y-2.5 sm:col-span-2'>
                <Label htmlFor='addressLine2' className='text-muted-foreground font-semibold ml-1'>
                  Alamat Baris 2 (Opsional)
                </Label>
                <div className='relative'>
                  <MapPin className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/30' />
                  <Input
                    id='addressLine2'
                    value={formData.addressLine2 || ''}
                    onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                    className='pl-11 h-12 rounded-xl border-input/60 focus:border-blue-500 focus:ring-blue-500/20 text-foreground bg-background'
                    placeholder='Detail tambahan, blok, patokan'
                  />
                </div>
              </div>

              <div className='space-y-2.5'>
                <Label htmlFor='district' className='text-muted-foreground font-semibold ml-1'>
                  Kecamatan/Kelurahan
                </Label>
                <div className='relative'>
                  <Navigation className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50' />
                  <Input
                    id='district'
                    value={formData.district || ''}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className='pl-11 h-12 rounded-xl border-input/60 focus:border-blue-500 focus:ring-blue-500/20 text-foreground bg-background'
                    placeholder='Nama kecamatan'
                  />
                </div>
              </div>

              <div className='space-y-2.5'>
                <Label htmlFor='city' className='text-muted-foreground font-semibold ml-1'>
                  Kota/Kabupaten
                </Label>
                <div className='relative'>
                  <Building className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50' />
                  <Input
                    id='city'
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className='pl-11 h-12 rounded-xl border-input/60 focus:border-blue-500 focus:ring-blue-500/20 text-foreground bg-background'
                    placeholder='Nama kota atau kabupaten'
                  />
                </div>
              </div>

              <div className='space-y-2.5'>
                <Label htmlFor='province' className='text-muted-foreground font-semibold ml-1'>
                  Provinsi
                </Label>
                <div className='relative'>
                  <Map className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50' />
                  <Input
                    id='province'
                    required
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    className='pl-11 h-12 rounded-xl border-input/60 focus:border-blue-500 focus:ring-blue-500/20 text-foreground bg-background'
                    placeholder='Nama provinsi'
                  />
                </div>
              </div>

              <div className='space-y-2.5'>
                <Label htmlFor='postalCode' className='text-muted-foreground font-semibold ml-1'>
                  Kode Pos
                </Label>
                <div className='relative'>
                  <Hash className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50' />
                  <Input
                    id='postalCode'
                    required
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className='pl-11 h-12 rounded-xl border-input/60 focus:border-blue-500 focus:ring-blue-500/20 text-foreground bg-background'
                    placeholder='Mis: 12345'
                  />
                </div>
              </div>
            </div>

            <div className='pt-6 space-y-4 border-t border-border/40'>
              <label className='flex items-center space-x-3 cursor-pointer group'>
                <input
                  type='checkbox'
                  checked={formData.isPrimaryShipping}
                  onChange={(e) =>
                    setFormData({ ...formData, isPrimaryShipping: e.target.checked })}
                  className='w-5 h-5 rounded-md border-input/60 text-blue-600 focus:ring-blue-500/30 bg-background cursor-pointer'
                />
                <span className='text-sm font-semibold text-foreground group-hover:text-blue-500 transition-colors'>
                  Jadikan Alamat Pengiriman Utama
                </span>
              </label>
              <label className='flex items-center space-x-3 cursor-pointer group'>
                <input
                  type='checkbox'
                  checked={formData.isPrimaryBilling}
                  onChange={(e) => setFormData({ ...formData, isPrimaryBilling: e.target.checked })}
                  className='w-5 h-5 rounded-md border-input/60 text-purple-600 focus:ring-purple-500/30 bg-background cursor-pointer'
                />
                <span className='text-sm font-semibold text-foreground group-hover:text-purple-500 transition-colors'>
                  Jadikan Alamat Penagihan Utama
                </span>
              </label>
            </div>

            <div className='flex flex-col-reverse sm:flex-row justify-end gap-4 pt-6 border-t border-border/40'>
              <Button
                type='button'
                variant='ghost'
                onClick={resetForm}
                className='w-full sm:w-auto h-12 px-8 rounded-xl font-semibold text-muted-foreground hover:text-foreground'
              >
                Batal
              </Button>
              <Button
                type='submit'
                disabled={isSaving}
                className='w-full sm:w-auto h-12 px-8 rounded-xl font-semibold shadow-lg shadow-blue-500/20 bg-blue-600 hover:bg-blue-700 text-white transition-all hover:scale-[1.02] active:scale-[0.98]'
              >
                {isSaving
                  ? (
                    <>
                      <Loader2 className='w-5 h-5 mr-2 animate-spin' /> Menyimpan...
                    </>
                  )
                  : (
                    <>
                      <Save className='w-5 h-5 mr-2' /> Simpan Alamat
                    </>
                  )}
              </Button>
            </div>
          </form>
        </div>
      )}

      {isLoading
        ? (
          <div className='flex flex-col items-center justify-center py-16'>
            <Loader2 className='w-10 h-10 animate-spin text-primary/50 mb-4' />
            <p className='text-muted-foreground animate-pulse text-sm font-medium'>
              Memuat buku alamat...
            </p>
          </div>
        )
        : error
        ? (
          <div className='p-8 bg-red-50 dark:bg-red-950/20 rounded-3xl border border-red-100 dark:border-red-900/30 text-center'>
            <p className='text-red-600 dark:text-red-400 font-bold text-lg'>Gagal Memuat Alamat</p>
            <p className='text-red-500/80 mt-2'>
              {error.message || 'Silakan coba muat ulang halaman.'}
            </p>
          </div>
        )
        : (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {addresses?.length === 0
              ? (
                <div className='col-span-1 md:col-span-2 flex flex-col items-center justify-center py-16 px-4 bg-card dark:bg-background rounded-3xl border border-border/60 text-center'>
                  <div className='w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-6'>
                    <MapPin className='w-10 h-10 text-muted-foreground/40' />
                  </div>
                  <h3 className='text-xl font-bold text-foreground mb-2'>Buku Alamat Kosong</h3>
                  <p className='text-muted-foreground max-w-md'>
                    Anda belum menyimpan alamat pengiriman apa pun. Tambahkan alamat pertama Anda
                    untuk mempercepat proses belanja.
                  </p>
                  <Button
                    onClick={() => setIsFormOpen(true)}
                    variant='outline'
                    className='mt-6 rounded-xl border-sky-200 text-sky-600 hover:bg-sky-50 dark:border-sky-900/50 dark:hover:bg-sky-950/30'
                  >
                    <Plus className='w-4 h-4 mr-2' />
                    Tambah Sekarang
                  </Button>
                </div>
              )
              : (
                addresses?.map((addr: any) => (
                  <div
                    key={addr.id}
                    className='bg-card dark:bg-background border border-border/60 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow'
                  >
                    <div>
                      <div className='flex items-start justify-between gap-2 mb-4'>
                        <div className='flex items-center gap-3'>
                          <div className='w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0'>
                            <Home className='w-5 h-5 text-blue-600 dark:text-blue-400' />
                          </div>
                          <h3 className='font-bold text-foreground text-lg'>
                            {addr.label || 'Utama'}
                          </h3>
                        </div>

                        <div className='flex flex-col gap-1 items-end'>
                          {addr.isPrimaryShipping && (
                            <span className='bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border border-blue-200 dark:border-blue-800/50'>
                              Utama Kirim
                            </span>
                          )}
                          {addr.isPrimaryBilling && (
                            <span className='bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border border-purple-200 dark:border-purple-800/50'>
                              Utama Tagih
                            </span>
                          )}
                        </div>
                      </div>

                      <div className='space-y-3 mt-5'>
                        <div className='flex items-start gap-3 text-sm'>
                          <User className='w-4 h-4 text-muted-foreground/60 shrink-0 mt-0.5' />
                          <p className='font-bold text-foreground'>{addr.recipientName}</p>
                        </div>
                        <div className='flex items-start gap-3 text-sm'>
                          <Phone className='w-4 h-4 text-muted-foreground/60 shrink-0 mt-0.5' />
                          <p className='font-medium text-muted-foreground'>{addr.phone}</p>
                        </div>
                        <div className='flex items-start gap-3 text-sm'>
                          <MapPin className='w-4 h-4 text-muted-foreground/60 shrink-0 mt-0.5' />
                          <div className='text-muted-foreground font-medium leading-relaxed'>
                            <p>{addr.addressLine1}</p>
                            {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                            <p className='mt-1'>
                              {addr.district ? `${addr.district}, ` : ''}
                              {addr.city}
                            </p>
                            <p>{addr.province}, {addr.postalCode}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className='mt-6 flex space-x-3 pt-5 border-t border-border/40'>
                      <Button
                        type='button'
                        variant='outline'
                        onClick={() => handleEdit(addr)}
                        className='flex-1 rounded-xl h-10 font-semibold border-indigo-200 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-900/50 dark:hover:bg-indigo-950/30 dark:text-indigo-400'
                      >
                        <Edit2 className='w-4 h-4 mr-2' />
                        Edit
                      </Button>
                      <Button
                        type='button'
                        variant='outline'
                        onClick={() => handleDelete(addr.id)}
                        className='flex-1 rounded-xl h-10 font-semibold border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-950/30 dark:text-red-400'
                      >
                        <Trash2 className='w-4 h-4 mr-2' />
                        Hapus
                      </Button>
                    </div>
                  </div>
                ))
              )}
          </div>
        )}
    </div>
  );
}
