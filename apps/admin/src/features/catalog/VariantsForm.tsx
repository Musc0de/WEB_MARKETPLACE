import React, { useEffect, useState } from 'react';
import { client } from '../../lib/rpc.ts';
import { goeyToast as toast } from 'goey-toast';

interface Variant {
  id: string;
  sku: string;
  price: number;
  comparePrice?: number | null;
  availableStock?: number;
  initialStock?: number;
  size?: string | null;
}

export function VariantsForm({ productId }: { productId: string }) {
  const [variants, setVariants] = useState<Variant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [comparePrice, setComparePrice] = useState('');
  const [initialStock, setInitialStock] = useState('');
  const [size, setSize] = useState('');

  const fetchVariants = async () => {
    try {
      setIsLoading(true);
      const res = await client.v1.admin.catalog.products[':id'].variants.$get({
        param: { id: productId },
      });
      if (res.ok) {
        const json = await res.json();
        setVariants((json.data as Variant[]) ?? []);
      }
    } catch (_e) {
      toast.error('Gagal memuat varian produk');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVariants();
  }, [productId]);

  const handleEditClick = (v: Variant) => {
    setEditingId(v.id);
    setSku(v.sku);
    setName((v as any).name || '');
    setPrice(v.price.toLocaleString('id-ID'));
    setComparePrice(v.comparePrice ? v.comparePrice.toLocaleString('id-ID') : '');
    setSize(v.size || '');
    setInitialStock('');
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setSku('');
    setName('');
    setPrice('');
    setComparePrice('');
    setInitialStock('');
    setSize('');
  };

  const handleDelete = async (variantId: string) => {
    if (!globalThis.confirm('Apakah Anda yakin ingin menghapus varian ini?')) return;
    try {
      // Temporary use any cast since we added DELETE dynamically
      const res = await (client.v1.admin.catalog.products[':id'].variants as any)[':variantId']
        .$delete({
          param: { id: productId, variantId },
        });
      if (!res.ok) throw new Error('Gagal menghapus varian');
      toast.success('Varian dihapus');
      fetchVariants();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Terjadi kesalahan');
    }
  };

  const formatNumberInput = (val: string) => {
    const numericVal = val.replace(/\D/g, '');
    if (!numericVal) return '';
    return parseInt(numericVal, 10).toLocaleString('id-ID');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = Number(price.replace(/\D/g, ''));
    if (!priceNum || priceNum <= 0) {
      toast.error('Harga harus lebih dari 0');
      return;
    }
    const comparePriceNum = comparePrice ? Number(comparePrice.replace(/\D/g, '')) : undefined;
    setIsAdding(true);
    try {
      const payload: any = {
        sku: sku.trim() || undefined,
        name: name.trim() || undefined,
        price: priceNum,
        comparePrice: comparePriceNum,
        initialStock: initialStock ? Number(initialStock) : undefined,
        size: size.trim() || undefined,
      };

      if (editingId) {
        // Edit mode
        const res = await (client.v1.admin.catalog.products[':id'].variants as any)[':variantId']
          .$put({
            param: { id: productId, variantId: editingId },
            json: payload,
          });
        if (!res.ok) throw new Error('Gagal menyimpan varian');
        toast.success('Varian berhasil diperbarui!');
      } else {
        // Create mode
        const res = await client.v1.admin.catalog.products[':id'].variants.$post({
          param: { id: productId },
          json: payload,
        });
        if (!res.ok) throw new Error('Gagal menambahkan varian');
        toast.success('Varian berhasil ditambahkan!');
      }

      handleCancelForm();
      fetchVariants();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setIsAdding(false);
    }
  };

  const formatRupiah = (val: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })
      .format(val);

  return (
    <div className='space-y-4'>
      {/* Variants Table */}
      {isLoading
        ? (
          <div className='flex items-center gap-2 py-6 text-gray-400 text-sm'>
            <svg className='w-4 h-4 animate-spin' fill='none' viewBox='0 0 24 24'>
              <circle
                className='opacity-25'
                cx='12'
                cy='12'
                r='10'
                stroke='currentColor'
                strokeWidth='4'
              />
              <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z' />
            </svg>
            Memuat varian...
          </div>
        )
        : variants.length === 0
        ? (
          <div className='border border-dashed border-gray-200 rounded-xl py-8 flex flex-col items-center gap-2 text-center'>
            <div className='w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center'>
              <svg
                className='w-5 h-5 text-gray-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={1.5}
                  d='M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z'
                />
              </svg>
            </div>
            <p className='text-sm font-medium text-gray-600'>Belum ada varian</p>
            <p className='text-xs text-gray-400'>
              Tambahkan minimal satu varian untuk menetapkan harga produk
            </p>
          </div>
        )
        : (
          <div className='overflow-hidden border border-gray-200 rounded-xl'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='bg-gray-50 border-b border-gray-200'>
                  <th className='text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3'>
                    SKU
                  </th>
                  <th className='text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3'>
                    Nama / Warna
                  </th>
                  <th className='text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3'>
                    Ukuran
                  </th>
                  <th className='text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3'>
                    Harga Jual
                  </th>
                  <th className='text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3'>
                    Harga Coret
                  </th>
                  <th className='text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3'>
                    Stok Awal
                  </th>
                  <th className='text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3'>
                    Stok Tersedia
                  </th>
                  <th className='text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3'>
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-100'>
                {variants.map((v) => (
                  <tr key={v.id} className='hover:bg-gray-50 transition-colors'>
                    <td className='px-4 py-3 font-mono text-xs text-gray-700 font-medium'>
                      {v.sku}
                    </td>
                    <td className='px-4 py-3 text-xs text-gray-700 font-medium'>
                      {(v as any).name || '—'}
                    </td>
                    <td className='px-4 py-3 text-xs text-gray-700 font-medium'>{v.size || '—'}</td>
                    <td className='px-4 py-3 text-gray-900 font-semibold'>
                      {formatRupiah(v.price)}
                    </td>
                    <td className='px-4 py-3 text-gray-400 line-through text-xs'>
                      {v.comparePrice ? formatRupiah(v.comparePrice) : '—'}
                    </td>
                    <td className='px-4 py-3 text-gray-500 font-medium text-xs'>
                      {v.initialStock ?? 0}
                    </td>
                    <td className='px-4 py-3'>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                          (v.availableStock ?? 0) > 0
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-red-50 text-red-600'
                        }`}
                      >
                        {v.availableStock ?? 0} unit
                      </span>
                    </td>
                    <td className='px-4 py-3 text-right'>
                      <div className='flex items-center justify-end gap-2'>
                        <button
                          type='button'
                          onClick={() => handleEditClick(v)}
                          className='text-blue-600 hover:text-blue-800 text-xs font-semibold px-2 py-1'
                        >
                          Edit
                        </button>
                        <button
                          type='button'
                          onClick={() => handleDelete(v.id)}
                          className='text-red-500 hover:text-red-700 text-xs font-semibold px-2 py-1'
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      {/* Add/Edit Variant Form */}
      {!showForm
        ? (
          <button
            type='button'
            onClick={() => setShowForm(true)}
            className='flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors mt-2'
          >
            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 4v16m8-8H4'
              />
            </svg>
            Tambah Varian Baru
          </button>
        )
        : (
          <div className='border border-blue-100 bg-blue-50/40 rounded-xl p-4 space-y-4 mt-4'>
            <p className='text-sm font-semibold text-gray-700'>
              {editingId ? 'Edit Varian' : 'Varian Baru'}
            </p>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
              {/* Name/Color */}
              <div className='space-y-1'>
                <label className='text-xs font-semibold text-gray-600'>
                  Nama Varian / Warna (opsional)
                </label>
                <input
                  type='text'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder='cth: WARNA BIRU'
                  className='w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white'
                />
              </div>
              {/* SKU */}
              <div className='space-y-1'>
                <label className='text-xs font-semibold text-gray-600'>
                  SKU (opsional, auto-generated)
                </label>
                <input
                  type='text'
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder='Otomatis jika dikosongkan'
                  className='w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white'
                />
              </div>
              {/* Price */}
              <div className='space-y-1'>
                <label className='text-xs font-semibold text-gray-600'>
                  Harga Jual (Rp) <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  value={price}
                  onChange={(e) => setPrice(formatNumberInput(e.target.value))}
                  placeholder='cth: 150.000'
                  className='w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white'
                  required
                />
              </div>
              {/* Compare Price */}
              <div className='space-y-1'>
                <label className='text-xs font-semibold text-gray-600'>
                  Harga Coret (opsional)
                </label>
                <input
                  type='text'
                  value={comparePrice}
                  onChange={(e) => setComparePrice(formatNumberInput(e.target.value))}
                  placeholder='cth: 200.000'
                  className='w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white'
                />
              </div>
              {/* Size */}
              <div className='space-y-1'>
                <label className='text-xs font-semibold text-gray-600'>Ukuran (opsional)</label>
                <input
                  type='text'
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  placeholder='cth: XL, L, 42'
                  className='w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white'
                />
              </div>
              {/* Initial Stock (Only for new variants) */}
              {!editingId && (
                <div className='space-y-1'>
                  <label className='text-xs font-semibold text-gray-600'>
                    Stok Awal (Sistem Permanen)
                  </label>
                  <input
                    type='number'
                    value={initialStock}
                    onChange={(e) => setInitialStock(e.target.value)}
                    placeholder='cth: 10'
                    min={0}
                    className='w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white'
                  />
                </div>
              )}
            </div>
            <div className='flex items-center gap-2 pt-1'>
              <button
                type='button'
                onClick={handleSubmit}
                disabled={isAdding}
                className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all'
              >
                {isAdding
                  ? (
                    <>
                      <svg className='w-4 h-4 animate-spin' fill='none' viewBox='0 0 24 24'>
                        <circle
                          className='opacity-25'
                          cx='12'
                          cy='12'
                          r='10'
                          stroke='currentColor'
                          strokeWidth='4'
                        />
                        <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z' />
                      </svg>
                      Menyimpan...
                    </>
                  )
                  : (
                    editingId ? 'Simpan Perubahan' : 'Simpan Varian'
                  )}
              </button>
              <button
                type='button'
                onClick={handleCancelForm}
                className='px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all'
              >
                Batal
              </button>
            </div>
          </div>
        )}
    </div>
  );
}
