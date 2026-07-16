import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { client } from '../../lib/rpc.ts';
import { goeyToast as toast } from 'goey-toast';
import { AdminBrandCreateSchema } from '@starsuperscare/contracts';
import { ArrowLeft, Loader2, Save, Tag } from 'lucide-react';

// ─── Section Card ──────────────────────────────────────────────────────────────
function SectionCard({ title, icon, description, children }: {
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
export function Field({ label, required, hint, children }: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className='block text-sm font-semibold text-gray-700 mb-1.5'>
        {label} {required && <span className='text-red-500'>*</span>}
      </label>
      {children}
      {hint && <p className='mt-1.5 text-xs text-gray-500'>{hint}</p>}
    </div>
  );
}

// ─── Input Error ───────────────────────────────────────────────────────────────
function InputError({ error }: { error?: string }) {
  if (!error) return null;
  return <p className='mt-1 text-sm text-red-600 animate-in fade-in slide-in-from-top-1'>{error}
  </p>;
}

export function BrandForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [isLoading, setIsLoading] = useState(isEdit);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    seoTitle: '',
    seoDescription: '',
  });

  useEffect(() => {
    if (isEdit && id) {
      const fetchBrand = async () => {
        try {
          const res = await client.v1.admin.catalog.brands[':id'].$get({ param: { id } });
          if (!res.ok) throw new Error('Gagal memuat brand');
          const json = await res.json();
          const b = json.data;
          setFormData({
            name: b.name || '',
            slug: b.slug || '',
            description: b.description || '',
            seoTitle: b.seoTitle || '',
            seoDescription: b.seoDescription || '',
          });
        } catch (err: any) {
          toast.error(err.message || 'Terjadi kesalahan');
          navigate('/catalog/brands');
        } finally {
          setIsLoading(false);
        }
      };
      fetchBrand();
    }
  }, [id, isEdit, navigate]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'name' && !isEdit) {
        // Auto-generate slug on create
        next.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      }
      return next;
    });
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setErrors({});

      // Validate
      const parsed = AdminBrandCreateSchema.safeParse(formData);
      if (!parsed.success) {
        const newErrors: Record<string, string> = {};
        for (const err of parsed.error.issues) {
          newErrors[err.path[0] as string] = err.message;
        }
        setErrors(newErrors);
        toast.error('Periksa kembali isian form Anda');
        return;
      }

      if (isEdit && id) {
        const res = await client.v1.admin.catalog.brands[':id'].$put({
          param: { id },
          json: parsed.data,
        });
        if (!res.ok) {
          const json = await res.json();
          throw new Error((json as any).message || 'Gagal menyimpan brand');
        }
        toast.success('Brand berhasil diperbarui');
      } else {
        const res = await client.v1.admin.catalog.brands.$post({
          json: parsed.data,
        });
        if (!res.ok) {
          const json = await res.json();
          throw new Error((json as any).message || 'Gagal membuat brand');
        }
        const json = await res.json();
        toast.success('Brand berhasil dibuat');
        navigate(`/catalog/brands/${json.data.id}/edit`, { replace: true });
      }
    } catch (error: any) {
      toast.error(error.message || 'Terjadi kesalahan');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-96'>
        <div className='flex flex-col items-center text-gray-500'>
          <Loader2 className='w-8 h-8 animate-spin mb-4' />
          <p>Memuat data brand...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto space-y-6 p-4 px-6 pb-20'>
      {/* ── Header ── */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <button
            type='button'
            onClick={() => navigate('/catalog/brands')}
            className='p-2 -ml-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors'
          >
            <ArrowLeft className='w-5 h-5' />
          </button>
          <div>
            <h1 className='text-2xl font-bold tracking-tight text-gray-900'>
              {isEdit ? 'Edit Brand' : 'Tambah Brand'}
            </h1>
            <p className='text-sm text-gray-500 mt-0.5'>
              {isEdit ? 'Perbarui informasi brand' : 'Buat brand baru'}
            </p>
          </div>
        </div>
        <div className='flex items-center gap-3'>
          <button
            type='button'
            onClick={() => navigate('/catalog/brands')}
            className='px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm'
          >
            Batal
          </button>
          <button
            type='button'
            onClick={handleSave}
            disabled={isSaving}
            className='inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-70 transition-all shadow-sm'
          >
            {isSaving ? <Loader2 className='w-4 h-4 animate-spin' /> : <Save className='w-4 h-4' />}
            Simpan Brand
          </button>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-6'>
        <SectionCard
          title='Informasi Dasar'
          description='Nama dan slug brand.'
          icon={<Tag className='w-5 h-5' />}
        >
          <div className='space-y-5'>
            <Field label='Nama Brand' required>
              <input
                type='text'
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder='Masukkan nama brand (cth: Nike)'
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <InputError error={errors.name} />
            </Field>

            <Field
              label='Slug (URL)'
              required
              hint='Otomatis terisi dari nama, digunakan untuk link (URL).'
            >
              <div className='flex rounded-lg shadow-sm'>
                <span className='inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm'>
                  /brands/
                </span>
                <input
                  type='text'
                  value={formData.slug}
                  onChange={(e) => handleChange('slug', e.target.value)}
                  placeholder='nike'
                  className={`flex-1 min-w-0 px-3 py-2 border rounded-none rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors ${
                    errors.slug ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              <InputError error={errors.slug} />
            </Field>
          </div>
        </SectionCard>

        <SectionCard
          title='SEO & Metadata'
          description='Optimasi mesin pencari dan informasi tambahan.'
          icon={<Tag className='w-5 h-5' />}
        >
          <div className='space-y-5'>
            <Field label='Deskripsi' hint='Opsional. Jelaskan tentang brand ini.'>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder='Tuliskan deskripsi brand...'
                rows={3}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors'
              />
              <InputError error={errors.description} />
            </Field>

            <Field label='SEO Title' hint='Opsional. Judul halaman untuk mesin pencari.'>
              <input
                type='text'
                value={formData.seoTitle}
                onChange={(e) => handleChange('seoTitle', e.target.value)}
                placeholder='Contoh: Nike Original - Sepatu Olahraga'
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors ${
                  errors.seoTitle ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <InputError error={errors.seoTitle} />
            </Field>

            <Field
              label='SEO Description'
              hint='Opsional. Deskripsi singkat untuk hasil pencarian Google.'
            >
              <textarea
                value={formData.seoDescription}
                onChange={(e) => handleChange('seoDescription', e.target.value)}
                placeholder='Tuliskan deskripsi SEO maksimal 160 karakter...'
                rows={2}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors'
              />
              <InputError error={errors.seoDescription} />
            </Field>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
