import { useState } from 'react';
import type { Dispatch, DragEvent, ReactNode, SetStateAction } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Input, notify } from '@starsuperscare/ui';
import { api } from '../../lib/api.ts';
import { API_URL } from '../../lib/rpc.ts';
import {
  Activity,
  ArrowUpRight,
  Check,
  Edit3,
  Eye,
  Image as ImageIcon,
  LayoutDashboard,
  Loader2,
  Monitor,
  MousePointerClick,
  Plus,
  Save,
  Settings2,
  Smartphone,
  Sparkles,
  Trash2,
  Type,
  UploadCloud,
  X,
  Zap,
} from 'lucide-react';
import type {
  CampaignBannerDTO,
  CreateCampaignBannerDTO,
  UpdateCampaignBannerDTO,
} from '@starsuperscare/contracts';

const THEMES = ['primary', 'dark', 'light'] as const;
type BannerTheme = (typeof THEMES)[number];
type PreviewMode = 'desktop' | 'mobile';
type UploadType = 'desktop' | 'mobile';

const DEFAULT_FORM_DATA: Partial<CampaignBannerDTO> = {
  theme: 'primary',
  isActive: true,
  priority: 0,
  primaryCtaColor: '#2563eb',
  secondaryCtaColor: '#ffffff',
};

export function CampaignBannersForm() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<CampaignBannerDTO>>({});

  const { data: banners, isLoading } = useQuery({
    queryKey: ['campaign-banners'],
    queryFn: () => api.get('/admin/settings/campaigns').then((r: any) => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateCampaignBannerDTO) =>
      api.post('/admin/settings/campaigns', data).then((r: any) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaign-banners'] });
      notify.success('Banner created successfully');
      setIsCreating(false);
      setFormData({});
    },
    onError: () => notify.error('Failed to create banner'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCampaignBannerDTO }) =>
      api.put(`/admin/settings/campaigns/${id}`, data).then((r: any) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaign-banners'] });
      notify.success('Banner updated successfully');
      setEditingId(null);
      setFormData({});
    },
    onError: () => notify.error('Failed to update banner'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      api.delete(`/admin/settings/campaigns/${id}`).then((r: any) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaign-banners'] });
      notify.success('Banner deleted');
    },
    onError: () => notify.error('Failed to delete banner'),
  });

  const uploadMutation = useMutation({
    mutationFn: async ({ file, type }: { file: File; type: UploadType }) => {
      const form = new FormData();
      form.append('file', file);
      form.append('type', type);

      const res = await fetch(API_URL + '/v1/admin/settings/campaigns/upload', {
        method: 'POST',
        body: form,
        credentials: 'include',
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error.message);

      return { url: data.data.url, type };
    },
    onSuccess: ({ url, type }) => {
      setFormData((prev) => ({
        ...prev,
        [type === 'desktop' ? 'desktopImageUrl' : 'mobileImageUrl']: url,
      }));
      notify.success(`${type} image uploaded`);
    },
    onError: (e: any) => notify.error(`Upload failed: ${e.message}`),
  });

  const handleSave = () => {
    if (!formData.title?.trim()) {
      notify.error('Title is required');
      return;
    }

    if (isCreating) {
      createMutation.mutate({
        id: crypto.randomUUID(),
        title: formData.title,
        description: formData.description ?? null,
        theme: (formData.theme as any) || 'primary',
        badge: formData.badge ?? null,
        primaryCtaLabel: formData.primaryCtaLabel ?? null,
        primaryCtaHref: formData.primaryCtaHref ?? null,
        primaryCtaColor: formData.primaryCtaColor ?? null,
        secondaryCtaLabel: formData.secondaryCtaLabel ?? null,
        secondaryCtaHref: formData.secondaryCtaHref ?? null,
        secondaryCtaColor: formData.secondaryCtaColor ?? null,
        desktopImageUrl: formData.desktopImageUrl ?? null,
        mobileImageUrl: formData.mobileImageUrl ?? null,
        isActive: formData.isActive ?? true,
        priority: formData.priority ?? 0,
      });
    } else if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    }
  };

  const startCreating = () => {
    setIsCreating(true);
    setEditingId(null);
    setFormData(DEFAULT_FORM_DATA);
  };

  const cancelEditor = () => {
    setIsCreating(false);
    setEditingId(null);
    setFormData({});
  };

  const bannerList = (banners ?? []) as CampaignBannerDTO[];
  const activeCount = bannerList.filter((banner) => banner.isActive).length;
  const responsiveCount = bannerList.filter(
    (banner) => banner.desktopImageUrl && banner.mobileImageUrl,
  ).length;
  const isSaving = createMutation.isPending || updateMutation.isPending;

  if (isLoading) return <CampaignBannersSkeleton />;

  return (
    <div className='min-h-full bg-slate-50/70'>
      <div className='mx-auto w-full max-w-[1600px] space-y-6 px-4 py-5 sm:px-6 lg:px-8 lg:py-8'>
        <section className='relative overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_60px_-32px_rgba(15,23,42,0.35)]'>
          <div className='pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-blue-100/70 blur-3xl' />
          <div className='pointer-events-none absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-violet-100/60 blur-3xl' />

          <div className='relative flex flex-col gap-5 p-5 sm:p-7 lg:flex-row lg:items-center lg:justify-between lg:p-8'>
            <div className='flex min-w-0 items-start gap-4'>
              <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/15 sm:h-14 sm:w-14'>
                <LayoutDashboard className='h-6 w-6' />
              </div>

              <div className='min-w-0'>
                <div className='mb-2 flex flex-wrap items-center gap-2'>
                  <span className='inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-blue-700'>
                    <Sparkles className='h-3.5 w-3.5' />
                    Storefront Content
                  </span>
                </div>
                <h1 className='text-2xl font-black tracking-tight text-slate-950 sm:text-3xl'>
                  Campaign Banner Settings
                </h1>
                <p className='mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base'>
                  Create, preview, and manage promotional hero banners for desktop and mobile
                  storefronts.
                </p>
              </div>
            </div>

            <Button
              type='button'
              onClick={startCreating}
              disabled={isCreating}
              className='h-11 w-full rounded-xl bg-blue-600 px-5 font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl disabled:translate-y-0 disabled:opacity-60 sm:w-auto'
            >
              <Plus className='mr-2 h-4 w-4' />
              Create Banner
            </Button>
          </div>
        </section>

        <section className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
          <StatCard
            icon={<ImageIcon className='h-5 w-5' />}
            label='Total banners'
            value={bannerList.length}
            helper='All campaign assets'
            tone='blue'
          />
          <StatCard
            icon={<Activity className='h-5 w-5' />}
            label='Active now'
            value={activeCount}
            helper={`${Math.max(bannerList.length - activeCount, 0)} inactive banner${
              bannerList.length - activeCount === 1 ? '' : 's'
            }`}
            tone='emerald'
          />
          <StatCard
            icon={<Smartphone className='h-5 w-5' />}
            label='Responsive ready'
            value={responsiveCount}
            helper='Desktop + mobile image'
            tone='violet'
          />
        </section>

        {isCreating && (
          <BannerEditor
            formData={formData}
            setFormData={setFormData}
            onSave={handleSave}
            onCancel={cancelEditor}
            onUpload={(file, type) => uploadMutation.mutate({ file, type })}
            isUploading={uploadMutation.isPending}
            isSaving={isSaving}
          />
        )}

        <section className='overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_18px_45px_-35px_rgba(15,23,42,0.35)]'>
          <div className='flex flex-col gap-3 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6'>
            <div>
              <div className='flex items-center gap-2'>
                <h2 className='text-lg font-extrabold text-slate-950'>Published banners</h2>
                <span className='rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600'>
                  {bannerList.length}
                </span>
              </div>
              <p className='mt-1 text-sm text-slate-500'>
                Higher-priority banners appear first on the storefront.
              </p>
            </div>

            <div className='inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-500'>
              <Zap className='h-4 w-4 text-amber-500' />
              Changes are applied after saving
            </div>
          </div>

          {!isCreating && bannerList.length === 0 && <EmptyBannerState onCreate={startCreating} />}

          <div className='divide-y divide-slate-200'>
            {bannerList.map((banner) => (
              <div key={banner.id} className='p-4 sm:p-5 lg:p-6'>
                {editingId === banner.id
                  ? (
                    <BannerEditor
                      formData={formData}
                      setFormData={setFormData}
                      onSave={handleSave}
                      onCancel={cancelEditor}
                      onUpload={(file, type) => uploadMutation.mutate({ file, type })}
                      isUploading={uploadMutation.isPending}
                      isSaving={isSaving}
                      embedded
                    />
                  )
                  : (
                    <BannerListCard
                      banner={banner}
                      isDeleting={deleteMutation.isPending}
                      onEdit={() => {
                        setEditingId(banner.id);
                        setFormData(banner);
                        setIsCreating(false);
                      }}
                      onDelete={() => {
                        if (confirm(`Delete banner "${banner.title}"?`)) {
                          deleteMutation.mutate(banner.id);
                        }
                      }}
                    />
                  )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: number;
  helper: string;
  tone: 'blue' | 'emerald' | 'violet';
}

function StatCard({ icon, label, value, helper, tone }: StatCardProps) {
  const toneClasses = {
    blue: 'bg-blue-50 text-blue-700 ring-blue-100',
    emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    violet: 'bg-violet-50 text-violet-700 ring-violet-100',
  }[tone];

  return (
    <div className='rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_12px_35px_-28px_rgba(15,23,42,0.45)] sm:p-5'>
      <div className='flex items-center justify-between gap-4'>
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ring-1 ${toneClasses}`}
        >
          {icon}
        </div>
        <span className='text-3xl font-black tracking-tight text-slate-950'>{value}</span>
      </div>
      <p className='mt-4 text-sm font-bold text-slate-800'>{label}</p>
      <p className='mt-1 text-xs text-slate-500'>{helper}</p>
    </div>
  );
}

interface BannerListCardProps {
  banner: CampaignBannerDTO;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

function BannerListCard({ banner, onEdit, onDelete, isDeleting }: BannerListCardProps) {
  const previewImage = banner.desktopImageUrl || banner.mobileImageUrl;
  const theme = normalizeTheme(banner.theme);

  return (
    <article className='group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-200 hover:border-slate-300 hover:shadow-[0_18px_45px_-30px_rgba(15,23,42,0.45)]'>
      <div className='grid grid-cols-1 lg:grid-cols-[minmax(300px,0.9fr)_minmax(0,1.4fr)]'>
        <div className={`relative min-h-[210px] overflow-hidden ${getThemeClasses(theme)}`}>
          {previewImage
            ? (
              <img
                src={previewImage}
                alt={`${banner.title} preview`}
                className='absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]'
              />
            )
            : (
              <div className='absolute inset-0 flex items-center justify-center opacity-40'>
                <ImageIcon className='h-16 w-16' />
              </div>
            )}

          <div className='absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-950/45 to-transparent' />
          <div className='relative flex min-h-[210px] flex-col justify-between p-5 text-white sm:p-6'>
            <div className='flex flex-wrap items-center gap-2'>
              <StatusBadge active={banner.isActive} inverse />
              <span className='rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.1em] backdrop-blur-md'>
                {theme}
              </span>
            </div>

            <div className='max-w-md'>
              {banner.badge && (
                <span className='mb-2 inline-flex rounded-md bg-amber-300 px-2 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-slate-950'>
                  {banner.badge}
                </span>
              )}
              <h3 className='line-clamp-2 text-xl font-black leading-tight sm:text-2xl'>
                {banner.title}
              </h3>
              {banner.description && (
                <p className='mt-2 line-clamp-2 text-sm leading-5 text-white/75'>
                  {banner.description}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className='flex min-w-0 flex-col justify-between gap-5 p-5 sm:p-6'>
          <div className='grid gap-4 sm:grid-cols-3'>
            <InfoItem label='Priority' value={String(banner.priority ?? 0)} />
            <InfoItem label='Primary CTA' value={banner.primaryCtaLabel || 'Not configured'} />
            <InfoItem label='Secondary CTA' value={banner.secondaryCtaLabel || 'Not configured'} />
          </div>

          <div className='flex flex-col gap-4 border-t border-slate-100 pt-4 xl:flex-row xl:items-center xl:justify-between'>
            <div className='flex flex-wrap items-center gap-2'>
              <AssetBadge
                icon={<Monitor className='h-3.5 w-3.5' />}
                label='Desktop image'
                ready={Boolean(banner.desktopImageUrl)}
              />
              <AssetBadge
                icon={<Smartphone className='h-3.5 w-3.5' />}
                label='Mobile image'
                ready={Boolean(banner.mobileImageUrl)}
              />
            </div>

            <div className='flex w-full items-center gap-2 xl:w-auto'>
              <Button
                type='button'
                variant='outline'
                onClick={onEdit}
                className='h-10 flex-1 rounded-xl border-slate-200 bg-white px-4 font-bold text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 xl:flex-none'
              >
                <Edit3 className='mr-2 h-4 w-4' />
                Edit
              </Button>
              <Button
                type='button'
                variant='outline'
                onClick={onDelete}
                disabled={isDeleting}
                className='h-10 rounded-xl border-red-200 bg-white px-3 text-red-600 hover:bg-red-50 hover:text-red-700'
                aria-label={`Delete ${banner.title}`}
              >
                {isDeleting
                  ? <Loader2 className='h-4 w-4 animate-spin' />
                  : <Trash2 className='h-4 w-4' />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className='min-w-0 rounded-xl bg-slate-50 px-3.5 py-3'>
      <p className='text-[10px] font-black uppercase tracking-[0.12em] text-slate-400'>{label}</p>
      <p className='mt-1 truncate text-sm font-bold text-slate-800' title={value}>{value}</p>
    </div>
  );
}

function AssetBadge({
  icon,
  label,
  ready,
}: {
  icon: ReactNode;
  label: string;
  ready: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs font-bold ${
        ready
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
          : 'border-slate-200 bg-slate-50 text-slate-400'
      }`}
    >
      {icon}
      {label}
      {ready ? <Check className='h-3.5 w-3.5' /> : <X className='h-3.5 w-3.5' />}
    </span>
  );
}

function StatusBadge({ active, inverse = false }: { active: boolean; inverse?: boolean }) {
  const activeClass = inverse
    ? 'border-emerald-300/30 bg-emerald-400/20 text-emerald-100'
    : 'border-emerald-200 bg-emerald-50 text-emerald-700';
  const inactiveClass = inverse
    ? 'border-white/20 bg-white/10 text-white/70'
    : 'border-slate-200 bg-slate-100 text-slate-500';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.1em] backdrop-blur-md ${
        active ? activeClass : inactiveClass
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-emerald-400' : 'bg-slate-400'}`} />
      {active ? 'Active' : 'Inactive'}
    </span>
  );
}

function EmptyBannerState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className='px-5 py-14 text-center sm:px-8 sm:py-20'>
      <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600'>
        <ImageIcon className='h-8 w-8' />
      </div>
      <h3 className='mt-5 text-xl font-black text-slate-950'>No campaign banners yet</h3>
      <p className='mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500'>
        Add your first promotional banner and prepare dedicated artwork for desktop and mobile
        screens.
      </p>
      <Button
        type='button'
        onClick={onCreate}
        className='mt-6 h-11 rounded-xl bg-blue-600 px-5 font-bold text-white hover:bg-blue-700'
      >
        <Plus className='mr-2 h-4 w-4' />
        Create first banner
      </Button>
    </div>
  );
}

interface BannerEditorProps {
  formData: Partial<CampaignBannerDTO>;
  setFormData: Dispatch<SetStateAction<Partial<CampaignBannerDTO>>>;
  onSave: () => void;
  onCancel: () => void;
  onUpload: (file: File, type: UploadType) => void;
  isUploading: boolean;
  isSaving: boolean;
  embedded?: boolean;
}

function BannerEditor({
  formData,
  setFormData,
  onSave,
  onCancel,
  onUpload,
  isUploading,
  isSaving,
  embedded = false,
}: BannerEditorProps) {
  const [previewMode, setPreviewMode] = useState<PreviewMode>('desktop');
  const isEditing = Boolean(formData.id);

  const updateField = (field: keyof CampaignBannerDTO, value: unknown) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    } as Partial<CampaignBannerDTO>));
  };

  return (
    <section
      className={`overflow-hidden border border-slate-200 bg-white ${
        embedded
          ? 'rounded-2xl shadow-[0_18px_50px_-34px_rgba(15,23,42,0.5)]'
          : 'rounded-[26px] shadow-[0_22px_65px_-40px_rgba(15,23,42,0.45)]'
      }`}
    >
      <div className='flex flex-col gap-4 border-b border-slate-200 bg-slate-950 px-5 py-5 text-white sm:flex-row sm:items-center sm:justify-between sm:px-6'>
        <div className='flex items-center gap-3'>
          <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10'>
            {isEditing ? <Edit3 className='h-5 w-5' /> : <Plus className='h-5 w-5' />}
          </div>
          <div>
            <div className='flex flex-wrap items-center gap-2'>
              <h2 className='text-lg font-black'>
                {isEditing ? 'Edit campaign banner' : 'Create campaign banner'}
              </h2>
              <span className='rounded-full bg-white/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white/70'>
                UI Preview
              </span>
            </div>
            <p className='mt-1 text-xs text-slate-400 sm:text-sm'>
              Configure content, calls to action, media, and display priority.
            </p>
          </div>
        </div>

        <ActiveToggle
          checked={formData.isActive ?? true}
          onChange={(checked) => updateField('isActive', checked)}
        />
      </div>

      <div className='grid grid-cols-1 xl:grid-cols-[minmax(0,1.55fr)_minmax(360px,0.75fr)]'>
        <div className='space-y-5 p-4 sm:p-6 lg:p-7'>
          <EditorSection
            icon={<Type className='h-5 w-5' />}
            eyebrow='Content'
            title='General information'
            description='The main text customers will see inside the banner.'
            accent='blue'
          >
            <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
              <Field label='Banner title' required className='md:col-span-2'>
                <Input
                  value={formData.title || ''}
                  onChange={(event) => updateField('title', event.target.value)}
                  placeholder='Example: Mid-Year Super Sale'
                  className='h-11 rounded-xl border-slate-200 bg-white px-3.5 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500/10'
                />
              </Field>

              <Field
                label='Description'
                hint='Keep it concise and benefit-driven.'
                className='md:col-span-2'
              >
                <textarea
                  value={formData.description || ''}
                  onChange={(event) => updateField('description', event.target.value)}
                  placeholder='Example: Save up to 50% on selected products this week.'
                  rows={3}
                  className='min-h-[96px] w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                />
              </Field>

              <Field label='Badge text' hint='Optional, such as HOT DEAL or LIMITED.'>
                <Input
                  value={formData.badge || ''}
                  onChange={(event) => updateField('badge', event.target.value)}
                  placeholder='HOT DEAL'
                  className='h-11 rounded-xl border-slate-200 bg-white px-3.5 text-sm shadow-sm'
                />
              </Field>

              <Field label='Visual theme'>
                <div className='grid grid-cols-3 gap-2'>
                  {THEMES.map((theme) => (
                    <ThemeOption
                      key={theme}
                      theme={theme}
                      selected={normalizeTheme(formData.theme) === theme}
                      onClick={() => updateField('theme', theme)}
                    />
                  ))}
                </div>
              </Field>
            </div>
          </EditorSection>

          <EditorSection
            icon={<MousePointerClick className='h-5 w-5' />}
            eyebrow='Conversion'
            title='Call-to-action buttons'
            description='Set the primary and secondary destinations for the campaign.'
            accent='amber'
          >
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
              <CtaEditorCard
                title='Primary action'
                description='Main conversion button'
                label={formData.primaryCtaLabel || ''}
                href={formData.primaryCtaHref || ''}
                color={formData.primaryCtaColor || '#2563eb'}
                defaultColor='#2563eb'
                onLabelChange={(value) => updateField('primaryCtaLabel', value)}
                onHrefChange={(value) => updateField('primaryCtaHref', value)}
                onColorChange={(value) => updateField('primaryCtaColor', value)}
              />
              <CtaEditorCard
                title='Secondary action'
                description='Supporting navigation button'
                label={formData.secondaryCtaLabel || ''}
                href={formData.secondaryCtaHref || ''}
                color={formData.secondaryCtaColor || '#ffffff'}
                defaultColor='#ffffff'
                onLabelChange={(value) => updateField('secondaryCtaLabel', value)}
                onHrefChange={(value) => updateField('secondaryCtaHref', value)}
                onColorChange={(value) => updateField('secondaryCtaColor', value)}
              />
            </div>
          </EditorSection>

          <EditorSection
            icon={<ImageIcon className='h-5 w-5' />}
            eyebrow='Media'
            title='Responsive campaign artwork'
            description='Use separate crops so text and products remain clear on every screen.'
            accent='emerald'
          >
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
              <ImageUploadField
                type='desktop'
                title='Desktop artwork'
                recommendation='Recommended ratio 16:6'
                imageUrl={formData.desktopImageUrl || ''}
                isUploading={isUploading}
                onUrlChange={(value) => updateField('desktopImageUrl', value)}
                onRemove={() => updateField('desktopImageUrl', '')}
                onUpload={onUpload}
              />
              <ImageUploadField
                type='mobile'
                title='Mobile artwork'
                recommendation='Recommended ratio 4:5'
                imageUrl={formData.mobileImageUrl || ''}
                isUploading={isUploading}
                onUrlChange={(value) => updateField('mobileImageUrl', value)}
                onRemove={() => updateField('mobileImageUrl', '')}
                onUpload={onUpload}
              />
            </div>
          </EditorSection>

          <EditorSection
            icon={<Settings2 className='h-5 w-5' />}
            eyebrow='Publishing'
            title='Display settings'
            description='Control ordering and visibility on the storefront.'
            accent='violet'
          >
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <Field label='Priority order' hint='A higher number is displayed first.'>
                <div className='relative'>
                  <Input
                    type='number'
                    value={formData.priority ?? 0}
                    onChange={(event) =>
                      updateField('priority', Number.parseInt(event.target.value, 10) || 0)}
                    className='h-11 rounded-xl border-slate-200 bg-white pr-24 text-sm font-bold shadow-sm'
                  />
                  <span className='pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs font-semibold text-slate-400'>
                    ranking
                  </span>
                </div>
              </Field>

              <div className='rounded-xl border border-slate-200 bg-slate-50 p-4'>
                <div className='flex items-start gap-3'>
                  <div className='mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-700'>
                    <Eye className='h-4 w-4' />
                  </div>
                  <div>
                    <p className='text-sm font-bold text-slate-800'>Publishing status</p>
                    <p className='mt-1 text-xs leading-5 text-slate-500'>
                      {formData.isActive ?? true
                        ? 'This banner will be eligible to appear after saving.'
                        : 'This banner will remain saved but hidden from customers.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </EditorSection>
        </div>

        <aside className='border-t border-slate-200 bg-slate-50/80 p-4 sm:p-6 xl:border-l xl:border-t-0 xl:p-7'>
          <div className='xl:sticky xl:top-6'>
            <div className='mb-4 flex items-center justify-between gap-3'>
              <div>
                <p className='text-[10px] font-black uppercase tracking-[0.14em] text-slate-400'>
                  Live preview
                </p>
                <h3 className='mt-1 text-base font-black text-slate-900'>Storefront appearance</h3>
              </div>

              <div className='inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm'>
                <PreviewModeButton
                  active={previewMode === 'desktop'}
                  label='Desktop preview'
                  onClick={() => setPreviewMode('desktop')}
                  icon={<Monitor className='h-4 w-4' />}
                />
                <PreviewModeButton
                  active={previewMode === 'mobile'}
                  label='Mobile preview'
                  onClick={() => setPreviewMode('mobile')}
                  icon={<Smartphone className='h-4 w-4' />}
                />
              </div>
            </div>

            <LiveBannerPreview formData={formData} mode={previewMode} />

            <div className='mt-4 rounded-xl border border-slate-200 bg-white p-4'>
              <div className='flex items-center justify-between gap-3'>
                <span className='text-xs font-bold text-slate-500'>Readiness checklist</span>
                <span className='text-xs font-black text-slate-800'>
                  {getCompletionCount(formData)}/4
                </span>
              </div>
              <div className='mt-3 space-y-2.5'>
                <ChecklistItem complete={Boolean(formData.title)} label='Banner title added' />
                <ChecklistItem
                  complete={Boolean(formData.desktopImageUrl)}
                  label='Desktop artwork added'
                />
                <ChecklistItem
                  complete={Boolean(formData.mobileImageUrl)}
                  label='Mobile artwork added'
                />
                <ChecklistItem
                  complete={Boolean(formData.primaryCtaLabel && formData.primaryCtaHref)}
                  label='Primary action configured'
                />
              </div>
            </div>
          </div>
        </aside>
      </div>

      <div className='flex flex-col-reverse gap-3 border-t border-slate-200 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6'>
        <p className='text-center text-xs text-slate-400 sm:text-left'>
          Review both preview modes before publishing.
        </p>
        <div className='flex items-center gap-3'>
          <Button
            type='button'
            variant='outline'
            onClick={onCancel}
            disabled={isSaving}
            className='h-11 flex-1 rounded-xl border-slate-200 bg-white px-5 font-bold text-slate-700 hover:bg-slate-50 sm:flex-none'
          >
            Cancel
          </Button>
          <Button
            type='button'
            onClick={onSave}
            disabled={isSaving || isUploading}
            className='h-11 flex-1 rounded-xl bg-blue-600 px-6 font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 disabled:opacity-60 sm:flex-none'
          >
            {isSaving
              ? <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              : <Save className='mr-2 h-4 w-4' />}
            {isSaving ? 'Saving...' : isEditing ? 'Save changes' : 'Create banner'}
          </Button>
        </div>
      </div>
    </section>
  );
}

function ActiveToggle(
  { checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void },
) {
  return (
    <label className='flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5'>
      <div>
        <p className='text-xs font-bold text-white'>Active status</p>
        <p className='mt-0.5 text-[10px] text-slate-400'>
          {checked ? 'Visible after save' : 'Hidden from store'}
        </p>
      </div>
      <input
        type='checkbox'
        className='peer sr-only'
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="relative h-6 w-11 rounded-full bg-slate-700 transition after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow-sm after:transition-transform after:content-[''] peer-checked:bg-emerald-500 peer-checked:after:translate-x-5 peer-focus-visible:ring-4 peer-focus-visible:ring-emerald-400/20" />
    </label>
  );
}

interface EditorSectionProps {
  icon: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  accent: 'blue' | 'amber' | 'emerald' | 'violet';
  children: ReactNode;
}

function EditorSection(
  { icon, eyebrow, title, description, accent, children }: EditorSectionProps,
) {
  const accentClass = {
    blue: 'bg-blue-50 text-blue-700 ring-blue-100',
    amber: 'bg-amber-50 text-amber-700 ring-amber-100',
    emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    violet: 'bg-violet-50 text-violet-700 ring-violet-100',
  }[accent];

  return (
    <div className='rounded-2xl border border-slate-200 bg-white p-4 sm:p-5'>
      <div className='mb-5 flex items-start gap-3'>
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ${accentClass}`}
        >
          {icon}
        </div>
        <div>
          <p className='text-[10px] font-black uppercase tracking-[0.14em] text-slate-400'>
            {eyebrow}
          </p>
          <h3 className='mt-1 text-base font-black text-slate-900'>{title}</h3>
          <p className='mt-1 text-xs leading-5 text-slate-500'>{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  hint,
  required = false,
  className = '',
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <div className='mb-2 flex items-center justify-between gap-3'>
        <label className='text-sm font-bold text-slate-700'>
          {label}
          {required && <span className='ml-1 text-red-500'>*</span>}
        </label>
        {hint && <span className='hidden text-[11px] text-slate-400 sm:block'>{hint}</span>}
      </div>
      {children}
      {hint && <p className='mt-1.5 text-[11px] text-slate-400 sm:hidden'>{hint}</p>}
    </div>
  );
}

function ThemeOption({
  theme,
  selected,
  onClick,
}: {
  theme: BannerTheme;
  selected: boolean;
  onClick: () => void;
}) {
  const swatchClass = {
    primary: 'bg-gradient-to-br from-blue-600 to-indigo-700',
    dark: 'bg-gradient-to-br from-slate-950 to-slate-700',
    light: 'bg-gradient-to-br from-white to-slate-200 ring-1 ring-inset ring-slate-200',
  }[theme];

  return (
    <button
      type='button'
      onClick={onClick}
      className={`relative rounded-xl border p-2 text-left transition ${
        selected
          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/10'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
      }`}
    >
      <span className={`block h-8 rounded-lg ${swatchClass}`} />
      <span className='mt-2 block truncate text-[11px] font-bold capitalize text-slate-700'>
        {theme}
      </span>
      {selected && (
        <span className='absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm'>
          <Check className='h-3 w-3' />
        </span>
      )}
    </button>
  );
}

interface CtaEditorCardProps {
  title: string;
  description: string;
  label: string;
  href: string;
  color: string;
  defaultColor: string;
  onLabelChange: (value: string) => void;
  onHrefChange: (value: string) => void;
  onColorChange: (value: string) => void;
}

function CtaEditorCard({
  title,
  description,
  label,
  href,
  color,
  defaultColor,
  onLabelChange,
  onHrefChange,
  onColorChange,
}: CtaEditorCardProps) {
  return (
    <div className='rounded-xl border border-slate-200 bg-slate-50/70 p-4'>
      <div className='mb-4 flex items-center justify-between gap-3'>
        <div>
          <p className='text-sm font-black text-slate-800'>{title}</p>
          <p className='mt-0.5 text-[11px] text-slate-400'>{description}</p>
        </div>
        <ArrowUpRight className='h-4 w-4 text-slate-300' />
      </div>

      <div className='space-y-4'>
        <Field label='Button label'>
          <Input
            value={label}
            onChange={(event) => onLabelChange(event.target.value)}
            placeholder={title.startsWith('Primary') ? 'Shop now' : 'Learn more'}
            className='h-10 rounded-xl border-slate-200 bg-white text-sm shadow-sm'
          />
        </Field>

        <Field label='Destination URL'>
          <Input
            value={href}
            onChange={(event) => onHrefChange(event.target.value)}
            placeholder='/products or https://...'
            className='h-10 rounded-xl border-slate-200 bg-white text-sm shadow-sm'
          />
        </Field>

        <Field label='Button color'>
          <div className='flex items-center gap-2'>
            <label className='relative h-10 w-11 shrink-0 cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm'>
              <span
                className='absolute inset-1 rounded-lg'
                style={{ backgroundColor: isValidHex(color) ? color : defaultColor }}
              />
              <input
                type='color'
                value={isValidHex(color) ? color : defaultColor}
                onChange={(event) => onColorChange(event.target.value)}
                className='absolute inset-0 h-full w-full cursor-pointer opacity-0'
              />
            </label>
            <Input
              value={color}
              onChange={(event) => onColorChange(event.target.value)}
              placeholder={defaultColor}
              className='h-10 rounded-xl border-slate-200 bg-white font-mono text-xs uppercase shadow-sm'
            />
          </div>
        </Field>
      </div>
    </div>
  );
}

interface ImageUploadFieldProps {
  type: UploadType;
  title: string;
  recommendation: string;
  imageUrl: string;
  isUploading: boolean;
  onUrlChange: (value: string) => void;
  onRemove: () => void;
  onUpload: (file: File, type: UploadType) => void;
}

function ImageUploadField({
  type,
  title,
  recommendation,
  imageUrl,
  isUploading,
  onUrlChange,
  onRemove,
  onUpload,
}: ImageUploadFieldProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const Icon = type === 'desktop' ? Monitor : Smartphone;

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files?.[0];
    if (file?.type.startsWith('image/')) onUpload(file, type);
  };

  return (
    <div className='rounded-xl border border-slate-200 bg-slate-50/70 p-4'>
      <div className='mb-3 flex items-center justify-between gap-3'>
        <div className='flex items-center gap-2'>
          <span className='flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm ring-1 ring-slate-200'>
            <Icon className='h-4 w-4' />
          </span>
          <div>
            <p className='text-sm font-black text-slate-800'>{title}</p>
            <p className='text-[10px] text-slate-400'>{recommendation}</p>
          </div>
        </div>
        {imageUrl && (
          <button
            type='button'
            onClick={onRemove}
            className='flex h-8 w-8 items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-500 transition hover:bg-red-100'
            aria-label={`Remove ${title}`}
          >
            <Trash2 className='h-3.5 w-3.5' />
          </button>
        )}
      </div>

      {imageUrl
        ? (
          <div
            className={`relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100 ${
              type === 'desktop' ? 'aspect-[16/6]' : 'mx-auto aspect-[4/5] max-h-72 max-w-[230px]'
            }`}
          >
            <img src={imageUrl} alt={`${title} preview`} className='h-full w-full object-cover' />
            <div className='absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/70 to-transparent px-3 pb-2 pt-8'>
              <span className='inline-flex items-center gap-1 text-[10px] font-bold text-white/90'>
                <Check className='h-3 w-3' /> Image ready
              </span>
            </div>
          </div>
        )
        : (
          <label
            onDragEnter={(event) => {
              event.preventDefault();
              setIsDragOver(true);
            }}
            onDragOver={(event) => event.preventDefault()}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 text-center transition ${
              type === 'desktop' ? 'min-h-36' : 'mx-auto min-h-52 max-w-[230px]'
            } ${
              isDragOver
                ? 'border-blue-400 bg-blue-50'
                : 'border-slate-300 bg-white hover:border-blue-300 hover:bg-blue-50/50'
            } ${isUploading ? 'pointer-events-none opacity-60' : ''}`}
          >
            <span className='flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600'>
              {isUploading
                ? <Loader2 className='h-5 w-5 animate-spin' />
                : <UploadCloud className='h-5 w-5' />}
            </span>
            <p className='mt-3 text-xs font-black text-slate-700'>
              {isUploading ? 'Uploading image...' : 'Upload or drop an image'}
            </p>
            <p className='mt-1 text-[10px] leading-4 text-slate-400'>PNG, JPG, or WEBP</p>
            <input
              type='file'
              accept='image/*'
              className='hidden'
              disabled={isUploading}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) onUpload(file, type);
                event.currentTarget.value = '';
              }}
            />
          </label>
        )}

      <div className='mt-3'>
        <Input
          value={imageUrl}
          onChange={(event) => onUrlChange(event.target.value)}
          placeholder='Or paste an image URL'
          className='h-10 rounded-xl border-slate-200 bg-white text-xs shadow-sm'
        />
      </div>
    </div>
  );
}

function PreviewModeButton({
  active,
  label,
  icon,
  onClick,
}: {
  active: boolean;
  label: string;
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
        active
          ? 'bg-slate-950 text-white shadow-sm'
          : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
      }`}
    >
      {icon}
    </button>
  );
}

function LiveBannerPreview({
  formData,
  mode,
}: {
  formData: Partial<CampaignBannerDTO>;
  mode: PreviewMode;
}) {
  const theme = normalizeTheme(formData.theme);
  const imageUrl = mode === 'desktop'
    ? formData.desktopImageUrl || formData.mobileImageUrl
    : formData.mobileImageUrl || formData.desktopImageUrl;
  const isLight = theme === 'light';

  return (
    <div className='rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_15px_40px_-30px_rgba(15,23,42,0.5)]'>
      <div className='mb-3 flex items-center gap-1.5 px-1'>
        <span className='h-2.5 w-2.5 rounded-full bg-red-400' />
        <span className='h-2.5 w-2.5 rounded-full bg-amber-400' />
        <span className='h-2.5 w-2.5 rounded-full bg-emerald-400' />
        <span className='ml-2 h-5 flex-1 rounded-md bg-slate-100' />
      </div>

      <div
        className={`relative mx-auto overflow-hidden rounded-xl transition-all duration-300 ${
          getThemeClasses(theme)
        } ${mode === 'desktop' ? 'aspect-[16/7] w-full' : 'aspect-[4/5] w-full max-w-[285px]'}`}
      >
        {imageUrl
          ? (
            <img
              src={imageUrl}
              alt='Campaign live preview'
              className='absolute inset-0 h-full w-full object-cover'
            />
          )
          : (
            <div className='absolute inset-0 opacity-30'>
              <div className='absolute -right-10 -top-10 h-40 w-40 rounded-full border-[28px] border-current' />
              <div className='absolute -bottom-16 -left-12 h-52 w-52 rounded-full border-[36px] border-current' />
            </div>
          )}

        <div
          className={`absolute inset-0 ${
            isLight
              ? 'bg-white/25'
              : 'bg-gradient-to-r from-slate-950/75 via-slate-950/40 to-transparent'
          }`}
        />

        <div
          className={`relative z-10 flex h-full flex-col justify-center ${
            mode === 'desktop' ? 'max-w-[70%] p-5' : 'items-center px-5 py-7 text-center'
          }`}
        >
          {formData.badge && (
            <span className='mb-2 inline-flex w-fit rounded-md bg-amber-300 px-2 py-1 text-[8px] font-black uppercase tracking-[0.13em] text-slate-950 sm:text-[9px]'>
              {formData.badge}
            </span>
          )}

          <h4
            className={`font-black leading-[1.05] ${
              mode === 'desktop' ? 'text-lg sm:text-2xl' : 'text-2xl'
            } ${isLight ? 'text-slate-950' : 'text-white'}`}
          >
            {formData.title || 'Your campaign headline'}
          </h4>

          <p
            className={`mt-2 line-clamp-2 text-[10px] leading-4 sm:text-xs ${
              isLight ? 'text-slate-600' : 'text-white/75'
            }`}
          >
            {formData.description || 'Add a short campaign description to explain the offer.'}
          </p>

          {(formData.primaryCtaLabel || formData.secondaryCtaLabel) && (
            <div
              className={`mt-3 flex flex-wrap gap-2 ${mode === 'mobile' ? 'justify-center' : ''}`}
            >
              {formData.primaryCtaLabel && (
                <span
                  className='inline-flex min-h-8 items-center rounded-lg px-3 text-[10px] font-black shadow-sm'
                  style={{
                    backgroundColor: isValidHex(formData.primaryCtaColor)
                      ? formData.primaryCtaColor!
                      : '#2563eb',
                    color: getContrastColor(formData.primaryCtaColor || '#2563eb'),
                  }}
                >
                  {formData.primaryCtaLabel}
                </span>
              )}
              {formData.secondaryCtaLabel && (
                <span
                  className='inline-flex min-h-8 items-center rounded-lg border border-black/10 px-3 text-[10px] font-black shadow-sm'
                  style={{
                    backgroundColor: isValidHex(formData.secondaryCtaColor)
                      ? formData.secondaryCtaColor!
                      : '#ffffff',
                    color: getContrastColor(formData.secondaryCtaColor || '#ffffff'),
                  }}
                >
                  {formData.secondaryCtaLabel}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className='mt-3 flex items-center justify-between gap-3 px-1 text-[10px] font-semibold text-slate-400'>
        <span className='inline-flex items-center gap-1.5'>
          {mode === 'desktop'
            ? <Monitor className='h-3.5 w-3.5' />
            : <Smartphone className='h-3.5 w-3.5' />}
          {mode === 'desktop' ? 'Desktop crop' : 'Mobile crop'}
        </span>
        <span className='capitalize'>{theme} theme</span>
      </div>
    </div>
  );
}

function ChecklistItem({ complete, label }: { complete: boolean; label: string }) {
  return (
    <div className='flex items-center gap-2.5'>
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
          complete ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'
        }`}
      >
        {complete
          ? <Check className='h-3 w-3' />
          : <span className='h-1.5 w-1.5 rounded-full bg-current' />}
      </span>
      <span className={`text-xs font-semibold ${complete ? 'text-slate-700' : 'text-slate-400'}`}>
        {label}
      </span>
    </div>
  );
}

function CampaignBannersSkeleton() {
  return (
    <div className='min-h-full bg-slate-50/70 px-4 py-6 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-[1600px] animate-pulse space-y-6'>
        <div className='h-48 rounded-[28px] border border-slate-200 bg-white' />
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
          {[0, 1, 2].map((item) => (
            <div key={item} className='h-36 rounded-2xl border border-slate-200 bg-white' />
          ))}
        </div>
        <div className='overflow-hidden rounded-[24px] border border-slate-200 bg-white'>
          <div className='h-24 border-b border-slate-200' />
          <div className='space-y-5 p-6'>
            {[0, 1].map((item) => <div key={item} className='h-64 rounded-2xl bg-slate-100' />)}
          </div>
        </div>
      </div>
    </div>
  );
}

function normalizeTheme(theme: CampaignBannerDTO['theme'] | undefined): BannerTheme {
  return THEMES.includes(theme as BannerTheme) ? (theme as BannerTheme) : 'primary';
}

function getThemeClasses(theme: BannerTheme) {
  if (theme === 'dark') {
    return 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-700 text-white';
  }
  if (theme === 'light') {
    return 'bg-gradient-to-br from-white via-slate-50 to-slate-200 text-slate-950';
  }
  return 'bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-700 text-white';
}

function getCompletionCount(formData: Partial<CampaignBannerDTO>) {
  return [
    Boolean(formData.title),
    Boolean(formData.desktopImageUrl),
    Boolean(formData.mobileImageUrl),
    Boolean(formData.primaryCtaLabel && formData.primaryCtaHref),
  ].filter(Boolean).length;
}

function isValidHex(value: string | null | undefined): value is string {
  return Boolean(value && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value));
}

function getContrastColor(hex: string) {
  if (!isValidHex(hex)) return '#ffffff';

  const normalized = hex.length === 4
    ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
    : hex;

  const red = Number.parseInt(normalized.slice(1, 3), 16);
  const green = Number.parseInt(normalized.slice(3, 5), 16);
  const blue = Number.parseInt(normalized.slice(5, 7), 16);
  const luminance = (red * 299 + green * 587 + blue * 114) / 1000;

  return luminance > 155 ? '#0f172a' : '#ffffff';
}
