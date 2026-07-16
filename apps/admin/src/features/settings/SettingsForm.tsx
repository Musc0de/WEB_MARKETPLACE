import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { client } from '../../lib/rpc.ts';
import { goeyToast as toast } from 'goey-toast';
import { Camera, Globe, Loader2, Save } from 'lucide-react';
import { PageHeader } from '../../components/admin-ui.tsx';

function Field(
  { label, error, children }: {
    label: string;
    error?: string | undefined;
    children: React.ReactNode;
  },
) {
  return (
    <div>
      <label className='mb-1.5 block text-sm font-medium text-gray-700'>{label}</label>
      {children}
      {error && <p className='mt-1.5 text-sm text-red-500'>{error}</p>}
    </div>
  );
}

function SectionCard(
  { title, description, children }: {
    title: string;
    description: string;
    children: React.ReactNode;
  },
) {
  return (
    <div className='bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden'>
      <div className='px-6 py-5 border-b border-gray-200 bg-gray-50/50'>
        <h3 className='text-base font-semibold text-gray-900'>{title}</h3>
        <p className='mt-1 text-sm text-gray-500'>{description}</p>
      </div>
      <div className='p-6'>
        {children}
      </div>
    </div>
  );
}

const formSchema = z.object({
  siteTitle: z.string().min(1, 'Site Title is required'),
  siteDescription: z.string().nullable().optional(),
});
type FormValues = z.infer<typeof formSchema>;

export function SettingsForm() {
  const [activeApp, setActiveApp] = useState(() =>
    localStorage.getItem('admin_settings_active_app') || ''
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const loadSettings = async (appId: string) => {
    setIsLoading(true);
    try {
      const res = await (client.v1.admin as any).settings.$get({ query: { app: appId } });
      if (res.ok) {
        const json = await res.json();
        reset({
          siteTitle: json.data?.siteTitle || '',
          siteDescription: json.data?.siteDescription || '',
        });
        setFaviconUrl(json.data?.faviconUrl || null);
      }
    } catch (_e) {
      toast.error('Gagal memuat pengaturan');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    localStorage.setItem('admin_settings_active_app', activeApp);
    loadSettings(activeApp);
  }, [activeApp]);

  const onSubmit = async (values: FormValues) => {
    setIsSaving(true);
    try {
      const res = await (client.v1.admin as any).settings.$put({
        json: {
          appId: activeApp,
          siteTitle: values.siteTitle,
          siteDescription: values.siteDescription,
          faviconUrl,
        },
      });
      if (res.ok) {
        toast.success('Pengaturan berhasil disimpan');
        reset(values); // clear isDirty
      } else {
        toast.error('Gagal menyimpan pengaturan');
      }
    } catch (_e) {
      toast.error('Kesalahan jaringan');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Hanya file gambar yang diizinkan');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Maksimal ukuran favicon 2MB');
      return;
    }

    setIsUploading(true);
    try {
      // 1. Get presigned URL
      const res = await client.v1.admin.assets['upload-url'].$post({
        json: {
          filename: 'favicon' + Date.now() + file.name,
          contentType: file.type,
          size: file.size,
          productName: 'global',
        },
      });
      if (!res.ok) throw new Error('Gagal mendapatkan URL upload');
      const { uploadUrl, publicUrl } = await res.json() as any;

      // 2. Upload file
      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      if (!uploadRes.ok) throw new Error('Gagal mengunggah file ke bucket');

      // 3. Set favicon URL (requires save to persist)
      setFaviconUrl(publicUrl);
      toast.success('Favicon berhasil diunggah. Jangan lupa Simpan Pengaturan!');
    } catch (err: any) {
      toast.error(err.message || 'Gagal mengunggah favicon');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (isLoading) {
    return (
      <div className='flex h-64 items-center justify-center text-gray-500'>
        <Loader2 className='h-8 w-8 animate-spin' />
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto space-y-6 pb-24'>
      <div className='flex flex-col md:flex-row md:items-end justify-between gap-4'>
        <PageHeader
          icon={Globe}
          title='Pengaturan Situs Global'
          description='Kelola SEO dan pengaturan dasar untuk situs Anda.'
          badge='Sistem'
          badgeColor='bg-blue-50 text-blue-700 ring-blue-600/20'
        />
        <div className='flex gap-2'>
          <button
            type='button'
            onClick={handleSubmit(onSubmit)}
            disabled={isSaving || isUploading || (!isDirty && true)} // Note: favicon change makes form technically dirty manually but we rely on the user clicking save
            className='inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 disabled:opacity-50 transition'
          >
            {isSaving ? <Loader2 className='h-4 w-4 animate-spin' /> : <Save className='h-4 w-4' />}
            Simpan Pengaturan
          </button>
        </div>
      </div>

      <form className='space-y-6'>
        <SectionCard
          title='Pilih Aplikasi'
          description='Pilih aplikasi mana yang ingin Anda atur identitasnya.'
        >
          <Field label='Aplikasi Tujuan'>
            <select
              value={activeApp}
              onChange={(e) => setActiveApp(e.target.value)}
              className='w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none transition-all'
            >
              <option value='storefront'>Storefront (Katalog Publik)</option>
              <option value='admin'>Admin Portal</option>
              <option value='dashboard'>User Dashboard</option>
              <option value='auth'>Auth Portal</option>
              <option value='tracking'>Tracking Portal</option>
            </select>
          </Field>
        </SectionCard>

        <SectionCard
          title='Identitas Situs'
          description='Pengaturan dasar situs yang akan ditampilkan di tab browser dan mesin pencari.'
        >
          <div className='space-y-4'>
            <Field label='Site Title' error={errors.siteTitle?.message}>
              <input
                {...register('siteTitle')}
                type='text'
                placeholder='e.g., StarSuperScare Marketplace'
                className='w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none transition-all'
              />
            </Field>

            <Field label='Site Description' error={errors.siteDescription?.message}>
              <textarea
                {...register('siteDescription')}
                rows={4}
                placeholder='Tuliskan deskripsi singkat tentang situs ini...'
                className='w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-y'
              />
            </Field>
          </div>
        </SectionCard>

        <SectionCard
          title='Favicon'
          description='Ikon kecil yang muncul di tab browser di sebelah judul situs.'
        >
          <div className='flex items-start gap-6'>
            <div className='flex-shrink-0 h-24 w-24 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 overflow-hidden'>
              {faviconUrl
                ? <img src={faviconUrl} alt='Favicon' className='h-16 w-16 object-contain' />
                : <Globe className='h-8 w-8 text-gray-300' />}
            </div>
            <div className='flex-1 space-y-3'>
              <div>
                <input
                  type='file'
                  accept='image/png,image/x-icon,image/jpeg,image/webp'
                  className='hidden'
                  ref={fileInputRef}
                  onChange={handleFaviconUpload}
                />
                <button
                  type='button'
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                  className='inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 transition'
                >
                  {isUploading
                    ? <Loader2 className='h-4 w-4 animate-spin text-blue-600' />
                    : <Camera className='h-4 w-4 text-gray-500' />}
                  {faviconUrl ? 'Ganti Favicon' : 'Unggah Favicon'}
                </button>
              </div>
              <p className='text-xs text-gray-500 max-w-sm'>
                Format yang disarankan: .ico, .png, atau .webp. Ukuran minimal 32x32 pixel.
              </p>
            </div>
          </div>
        </SectionCard>
      </form>
    </div>
  );
}
