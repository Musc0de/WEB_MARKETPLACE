import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { client } from '../../lib/rpc.ts';
import { goeyToast as toast } from 'goey-toast';
import { AdminCategoryCreateSchema } from '@starsuperscare/contracts';
import { ArrowLeft, Loader2, Save, Tags } from 'lucide-react';

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
function Field({ label, required, hint, children }: {
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

export function CategoryForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [isLoading, setIsLoading] = useState(isEdit);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    parentId: '',
    description: '',
    seoTitle: '',
    seoDescription: '',
  });

  useEffect(() => {
    // Fetch all categories for the dropdown
    const fetchCategories = async () => {
      try {
        const res = await client.v1.admin.catalog.categories.$get({ query: { limit: '500' } });
        if (res.ok) {
          const json = await res.json();
          // Exclude self if editing
          const available = (json.data.items as any).filter((c: any) => c.id !== id);
          setCategories(available);
        }
      } catch (err) {
        console.error('Failed to fetch categories for dropdown', err);
      }
    };
    fetchCategories();

    if (isEdit && id) {
      const fetchCategory = async () => {
        try {
          const res = await client.v1.admin.catalog.categories[':id'].$get({ param: { id } });
          if (!res.ok) throw new Error('Gagal memuat kategori');
          const json = await res.json();
          const c = json.data;
          setFormData({
            name: c.name || '',
            slug: c.slug || '',
            parentId: c.parentId || '',
            description: c.description || '',
            seoTitle: c.seoTitle || '',
            seoDescription: c.seoDescription || '',
          });
        } catch (err: any) {
          toast.error(err.message || 'Terjadi kesalahan');
          navigate('/catalog/categories');
        } finally {
          setIsLoading(false);
        }
      };
      fetchCategory();
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

      // Format data (convert empty string parentId to null if needed, but schema uses undefined/null)
      const payload = {
        ...formData,
        parentId: formData.parentId || null,
        description: formData.description || null,
        seoTitle: formData.seoTitle || null,
        seoDescription: formData.seoDescription || null,
      };

      // Validate
      const parsed = AdminCategoryCreateSchema.safeParse(payload);
      if (!parsed.success) {
        const newErrors: Record<string, string> = {};
        for (const err of parsed.error.issues) {
          newErrors[err.path[0]] = err.message;
        }
        setErrors(newErrors);
        toast.error('Periksa kembali isian form Anda');
        return;
      }

      if (isEdit && id) {
        const res = await client.v1.admin.catalog.categories[':id'].$put({
          param: { id },
          json: parsed.data,
        });
        if (!res.ok) {
          const json = await res.json();
          throw new Error((json as any).message || 'Gagal menyimpan kategori');
        }
        toast.success('Kategori berhasil diperbarui');
      } else {
        const res = await client.v1.admin.catalog.categories.$post({
          json: parsed.data,
        });
        if (!res.ok) {
          const json = await res.json();
          throw new Error((json as any).message || 'Gagal membuat kategori');
        }
        const json = await res.json();
        toast.success('Kategori berhasil dibuat');
        navigate(`/catalog/categories/${json.data.id}/edit`, { replace: true });
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
          <p>Memuat data kategori...</p>
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
            onClick={() => navigate('/catalog/categories')}
            className='p-2 -ml-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors'
          >
            <ArrowLeft className='w-5 h-5' />
          </button>
          <div>
            <h1 className='text-2xl font-bold tracking-tight text-gray-900'>
              {isEdit ? 'Edit Kategori' : 'Tambah Kategori'}
            </h1>
            <p className='text-sm text-gray-500 mt-0.5'>
              {isEdit ? 'Perbarui informasi kategori' : 'Buat kategori baru'}
            </p>
          </div>
        </div>
        <div className='flex items-center gap-3'>
          <button
            type='button'
            onClick={() => navigate('/catalog/categories')}
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
            Simpan Kategori
          </button>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-6'>
        <SectionCard
          title='Informasi Dasar'
          description='Nama, slug, dan parent kategori.'
          icon={<Tags className='w-5 h-5' />}
        >
          <div className='space-y-5'>
            <Field label='Nama Kategori' required>
              <input
                type='text'
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder='Masukkan nama kategori'
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
                  /categories/
                </span>
                <input
                  type='text'
                  value={formData.slug}
                  onChange={(e) => handleChange('slug', e.target.value)}
                  placeholder='kategori'
                  className={`flex-1 min-w-0 px-3 py-2 border rounded-none rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors ${
                    errors.slug ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              <InputError error={errors.slug} />
            </Field>

            <Field
              label='Parent Category'
              hint='Kosongkan jika ini adalah kategori utama (Top Level).'
            >
              <select
                value={formData.parentId}
                onChange={(e) => handleChange('parentId', e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
              >
                <option value=''>— Tidak Ada (Kategori Utama) —</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <InputError error={errors.parentId} />
            </Field>

            <Field label='Deskripsi' hint='Opsional'>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder='Tuliskan deksripsi singkat...'
                rows={3}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors'
              />
              <InputError error={errors.description} />
            </Field>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
