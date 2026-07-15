import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { client } from '../../lib/rpc.ts';
import { goeyToast as toast } from 'goey-toast';
import { AdminProductCreateSchema } from '@starsuperscare/contracts';
import { ImageUploader } from './ImageUploader.tsx';
import { VariantsForm } from './VariantsForm.tsx';

// ─── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status?: string | undefined }) {
  const s = status?.toLowerCase();
  const cfg = s === 'published'
    ? {
      cls: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-500',
      label: 'Published',
    }
    : s === 'draft'
    ? { cls: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-400', label: 'Draft' }
    : s === 'archived'
    ? { cls: 'bg-gray-100 text-gray-500 border-gray-200', dot: 'bg-gray-400', label: 'Diarsipkan' }
    : { cls: 'bg-gray-100 text-gray-500 border-gray-200', dot: 'bg-gray-400', label: s ?? '—' };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.cls}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// ─── Section Card ──────────────────────────────────────────────────────────────
function SectionCard({ title, icon, children, description }: {
  title: string;
  icon: React.ReactNode;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className='bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm'>
      <div className='flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/50'>
        <div className='text-gray-500'>{icon}</div>
        <div>
          <h2 className='text-sm font-bold text-gray-800'>{title}</h2>
          {description && <p className='text-xs text-gray-400 mt-0.5'>{description}</p>}
        </div>
      </div>
      <div className='p-6'>{children}</div>
    </div>
  );
}

// ─── Form Field ────────────────────────────────────────────────────────────────
function Field({ label, required, hint, children }: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className='space-y-1.5'>
      <label className='block text-xs font-semibold text-gray-600 uppercase tracking-wide'>
        {label} {required && <span className='text-red-500 normal-case tracking-normal'>*</span>}
      </label>
      {children}
      {hint && <p className='text-xs text-gray-400'>{hint}</p>}
    </div>
  );
}

// ─── Input class ───────────────────────────────────────────────────────────────
const inputCls =
  'w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent bg-white transition placeholder-gray-300';

export function ProductForm() {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    storeId: '',
    name: '',
    type: 'physical',
    description: '',
    purchaseLimit: 0,
    version: 1,
    brandId: '',
    categoryIds: [] as string[],
  });
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isLoadingProduct, setIsLoadingProduct] = useState(isEditing);

  const [categoriesList, setCategoriesList] = useState<{ id: string; name: string }[]>([]);
  const [brandsList, setBrandsList] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          client.v1.admin.catalog.categories.$get({ query: {} }),
          client.v1.admin.catalog.brands.$get({ query: {} }),
        ]);
        if (catRes.ok) {
          const catData = await catRes.json();
          setCategoriesList(catData.data.items);
        }
        if (brandRes.ok) {
          const brandData = await brandRes.json();
          setBrandsList(brandData.data.items);
        }
      } catch (e) {
        console.error('Failed to fetch options', e);
      }
    };
    fetchOptions();
  }, []);

  // Unsaved changes guard
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    globalThis.addEventListener('beforeunload', handleBeforeUnload);
    return () => globalThis.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Fetch product if editing
  useEffect(() => {
    if (!isEditing) return;
    const fetchProduct = async () => {
      setIsLoadingProduct(true);
      try {
        const res = await client.v1.admin.catalog.products[':id'].$get({ param: { id } });
        if (res.ok) {
          const data = await res.json();
          setFormData({
            storeId: data.data.storeId ?? '',
            name: data.data.name ?? '',
            type: data.data.type ?? 'physical',
            description: data.data.description ?? '',
            purchaseLimit: data.data.purchaseLimit ?? 0,
            version: data.data.version ?? 1,
            brandId: data.data.brandId ?? '',
            categoryIds: (data.data as any).categoryIds ?? [],
          });
          setStatus(data.data.status);
        }
      } catch (_e) {
        toast.error('Gagal memuat data produk');
      } finally {
        setIsLoadingProduct(false);
      }
    };
    fetchProduct();
  }, [id, isEditing]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setIsDirty(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (isEditing) {
        const payload = {
          version: formData.version,
          name: formData.name,
          type: formData.type as 'physical' | 'digital' | 'service',
          description: formData.description,
          purchaseLimit: formData.purchaseLimit,
          brandId: formData.brandId || undefined,
          categoryIds: formData.categoryIds,
        };
        const res = await client.v1.admin.catalog.products[':id'].$put({
          param: { id },
          json: payload,
        });
        if (!res.ok) throw new Error('Gagal memperbarui produk');
        toast.success('Produk berhasil disimpan!');
        setFormData((prev) => ({ ...prev, version: prev.version + 1 }));
      } else {
        const payload = {
          storeId: formData.storeId || undefined,
          name: formData.name,
          type: formData.type as 'physical' | 'digital' | 'service',
          description: formData.description,
          purchaseLimit: formData.purchaseLimit,
          brandId: formData.brandId || undefined,
          categoryIds: formData.categoryIds,
        };
        const parsed = AdminProductCreateSchema.safeParse(payload);
        if (!parsed.success) {
          toast.error(parsed.error.issues[0].message);
          return;
        }
        const res = await client.v1.admin.catalog.products.$post({ json: parsed.data });
        if (!res.ok) throw new Error('Gagal membuat produk');
        toast.success('Produk berhasil dibuat!');
        navigate('/catalog');
      }
      setIsDirty(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menyimpan');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!id) return;
    setIsPublishing(true);
    try {
      const res = await client.v1.admin.catalog.products[':id'].publish.$post({ param: { id } });
      if (!res.ok) throw new Error('Gagal mempublikasikan produk');
      toast.success('Produk berhasil dipublikasikan! 🎉');
      setStatus('published');
      setFormData((prev) => ({ ...prev, version: prev.version + 1 }));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal publikasi');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleUnpublish = async () => {
    if (!id) return;
    setIsPublishing(true);
    try {
      const res = await client.v1.admin.catalog.products[':id'].unpublish.$post({ param: { id } });
      if (!res.ok) throw new Error('Gagal membatalkan publikasi');
      toast.success('Produk berhasil ditarik dari toko');
      setStatus('draft');
      setFormData((prev) => ({ ...prev, version: prev.version + 1 }));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal unpublish');
    } finally {
      setIsPublishing(false);
    }
  };

  const confirmBack = () => {
    if (isDirty && !globalThis.confirm('Ada perubahan yang belum disimpan. Tetap keluar?')) return;
    navigate('/catalog');
  };

  if (isLoadingProduct) {
    return (
      <div className='min-h-[60vh] flex flex-col items-center justify-center gap-3 text-gray-400'>
        <svg className='w-8 h-8 animate-spin' fill='none' viewBox='0 0 24 24'>
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
        <p className='text-sm'>Memuat data produk...</p>
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto space-y-6 pb-16 pt-8'>
      {/* ── Page Header Card ─────────────────────────────────────────────────── */}
      <div className='bg-white border border-gray-200 rounded-2xl px-6 py-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div className='flex flex-col'>
          <div className='flex items-center gap-2 text-sm text-gray-500 mb-1'>
            <button
              type='button'
              onClick={confirmBack}
              className='flex items-center gap-1 hover:text-gray-900 transition-colors'
            >
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 19l-7-7 7-7'
                />
              </svg>
              Kembali
            </button>
            <span className='text-gray-300'>|</span>
            <span>{isEditing ? 'Edit Produk' : 'Produk Baru'}</span>
          </div>
          <div className='flex items-center gap-3'>
            <h1 className='text-2xl font-bold text-gray-900'>
              {formData.name || 'Produk Tanpa Nama'}
            </h1>
            {isEditing && <StatusBadge status={status} />}
          </div>
        </div>

        <div className='flex items-center gap-2'>
          {isDirty && (
            <span className='text-xs text-amber-600 font-medium animate-pulse mr-1'>
              • Belum disimpan
            </span>
          )}

          {/* Publish / Unpublish */}
          {isEditing && status === 'draft' && (
            <button
              type='button'
              onClick={handlePublish}
              disabled={isPublishing || isDirty}
              title={isDirty ? 'Simpan perubahan dulu sebelum publikasi' : ''}
              className='flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-all'
            >
              {isPublishing
                ? (
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
                )
                : (
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                )}
              Publikasikan
            </button>
          )}

          {isEditing && status === 'published' && (
            <button
              type='button'
              onClick={handleUnpublish}
              disabled={isPublishing}
              className='flex items-center gap-2 px-4 py-2 bg-amber-500 text-white text-sm font-semibold rounded-xl hover:bg-amber-600 disabled:opacity-50 transition-all'
            >
              {isPublishing
                ? (
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
                )
                : (
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636'
                    />
                  </svg>
                )}
              Tarik dari Toko
            </button>
          )}

          {/* Save Button */}
          <button
            type='submit'
            form='product-form'
            disabled={isSaving || (!isDirty && isEditing)}
            className='flex items-center gap-2 px-5 py-2 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-700 disabled:opacity-40 transition-all'
          >
            {isSaving
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
                <>
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4'
                    />
                  </svg>
                  {isEditing ? 'Simpan Perubahan' : 'Buat Produk'}
                </>
              )}
          </button>
        </div>
      </div>

      {/* ── Form ───────────────────────────────────────────────────────────────── */}
      <form id='product-form' onSubmit={handleSubmit} className='space-y-6 pt-2'>
        {/* Informasi Dasar */}
        <SectionCard
          title='Informasi Produk'
          description='Nama, tipe, dan deskripsi produk Anda'
          icon={
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1.5}
                d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
              />
            </svg>
          }
        >
          <div className='space-y-5'>
            {/* Store ID — only for create */}
            {!isEditing && (
              <Field label='Store ID' required hint='ID toko pemilik produk ini'>
                <input
                  name='storeId'
                  value={formData.storeId}
                  onChange={handleChange}
                  placeholder='UUID toko (otomatis jika kosong)'
                  className={inputCls}
                />
              </Field>
            )}

            {/* Name */}
            <Field label='Nama Produk' required>
              <input
                name='name'
                value={formData.name}
                onChange={handleChange}
                placeholder='cth: Kemeja Batik Premium Lengan Panjang'
                className={inputCls}
                required
              />
            </Field>

            {/* Type */}
            <Field
              label='Tipe Produk'
              required
              hint='Menentukan apakah produk perlu pengiriman fisik atau tidak'
            >
              <select
                name='type'
                value={formData.type}
                onChange={handleChange}
                className={inputCls}
              >
                <option value='physical'>🏪 Produk Fisik — Memerlukan pengiriman</option>
                <option value='digital'>💾 Produk Digital — File / unduhan</option>
                <option value='service'>🤝 Layanan — Jasa tanpa pengiriman</option>
              </select>
            </Field>

            {/* Category & Brand */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <Field label='Kategori' hint='Pilih kategori produk'>
                <select
                  name='categoryIds'
                  value={formData.categoryIds[0] || ''}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      categoryIds: e.target.value ? [e.target.value] : [],
                    });
                    setIsDirty(true);
                  }}
                  className={inputCls}
                >
                  <option value=''>-- Pilih Kategori --</option>
                  {categoriesList.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </Field>

              <Field label='Brand' hint='Pilih brand produk (opsional)'>
                <select
                  name='brandId'
                  value={formData.brandId}
                  onChange={handleChange}
                  className={inputCls}
                >
                  <option value=''>-- Tidak Ada Brand --</option>
                  {brandsList.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </Field>
            </div>

            {/* Description */}
            <Field label='Deskripsi Produk' hint='Jelaskan detail produk Anda kepada calon pembeli'>
              <textarea
                name='description'
                value={formData.description}
                onChange={handleChange}
                rows={5}
                placeholder='Deskripsikan produk Anda: bahan, ukuran, keunggulan, cara penggunaan, dll.'
                className={`${inputCls} resize-none leading-relaxed`}
              />
            </Field>

            {/* Purchase Limit */}
            <Field
              label='Batas Pembelian per Pelanggan'
              hint='Isi 0 untuk tidak membatasi jumlah pembelian'
            >
              <div className='flex items-center gap-3'>
                <input
                  type='number'
                  name='purchaseLimit'
                  value={formData.purchaseLimit}
                  onChange={(e) => {
                    setFormData({ ...formData, purchaseLimit: Number(e.target.value) });
                    setIsDirty(true);
                  }}
                  min={0}
                  max={9999}
                  className={`${inputCls} w-40`}
                />
                {formData.purchaseLimit === 0 && (
                  <span className='text-xs text-emerald-600 font-medium'>✓ Tidak dibatasi</span>
                )}
              </div>
            </Field>
          </div>

          {/* Info Box by Type */}
          {formData.type === 'physical' && (
            <div className='mt-5 flex items-start gap-3 p-4 bg-sky-50 border border-sky-200 rounded-xl'>
              <svg
                className='w-4 h-4 text-sky-500 flex-shrink-0 mt-0.5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              <p className='text-xs text-sky-700'>
                <strong>Produk Fisik:</strong>{' '}
                Berat dan dimensi untuk pengiriman dapat diatur di bagian <em>Varian & Harga</em>
                {' '}
                di bawah.
              </p>
            </div>
          )}
          {formData.type === 'digital' && (
            <div className='mt-5 flex items-start gap-3 p-4 bg-purple-50 border border-purple-200 rounded-xl'>
              <svg
                className='w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10'
                />
              </svg>
              <p className='text-xs text-purple-700'>
                <strong>Produk Digital:</strong> Unggah file produk di bagian <em>Aset Produk</em>
                {' '}
                setelah produk dibuat.
              </p>
            </div>
          )}
        </SectionCard>
      </form>

      {/* Variants & Pricing — only when editing */}
      {isEditing && id && (
        <SectionCard
          title='Varian & Harga'
          icon={
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z'
              />
            </svg>
          }
        >
          <VariantsForm productId={id} />
        </SectionCard>
      )}

      {/* Image Upload — only when editing */}
      {isEditing && id && (
        <SectionCard
          title='Gambar Produk'
          description='Unggah foto produk berkualitas tinggi (JPG, PNG, WebP — maks. 5MB)'
          icon={
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1.5}
                d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
              />
            </svg>
          }
        >
          <ImageUploader
            productId={id}
            productName={formData.name}
            onUploadSuccess={async (objectKey) => {
              try {
                // First image becomes primary by default if it's the only one (handled logic if needed, passing true for now)
                await client.v1.admin.catalog.products[':id'].images.$post({
                  param: { id },
                  json: { objectKey, isPrimary: true },
                });
                toast.success('Gambar berhasil ditautkan ke produk!');
              } catch (e) {
                console.error(e);
                toast.error('Gagal menautkan gambar ke produk');
              }
            }}
          />
        </SectionCard>
      )}

      {/* Note if creating */}
      {!isEditing && (
        <div className='flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700'>
          <svg
            className='w-4 h-4 flex-shrink-0 mt-0.5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
          <span>
            Setelah produk dibuat, Anda dapat menambahkan <strong>varian harga</strong> dan{' '}
            <strong>gambar produk</strong> di halaman edit produk.
          </span>
        </div>
      )}
    </div>
  );
}
