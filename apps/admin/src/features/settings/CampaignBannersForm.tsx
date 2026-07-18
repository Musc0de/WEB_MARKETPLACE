import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notify } from '@starsuperscare/ui';
import { api } from '../../lib/api.ts';
import { API_URL } from '../../lib/rpc.ts';
import { Button, Card, H3, Input, Text } from '@starsuperscare/ui';
import { Edit, Image as ImageIcon, Plus, Save, Trash2, X } from 'lucide-react';
import type {
  CampaignBannerDTO,
  CreateCampaignBannerDTO,
  UpdateCampaignBannerDTO,
} from '@starsuperscare/contracts';

const THEMES = ['primary', 'dark', 'light'] as const;

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
  });

  const uploadMutation = useMutation({
    mutationFn: async ({ file, type }: { file: File; type: 'desktop' | 'mobile' }) => {
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
      setFormData((prev: any) => ({
        ...prev,
        [type === 'desktop' ? 'desktopImageUrl' : 'mobileImageUrl']: url,
      }));
      notify.success(`${type} image uploaded`);
    },
    onError: (e: any) => notify.error(`Upload failed: ${e.message}`),
  });

  const handleSave = () => {
    if (!formData.title) {
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

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <H3>Hero Banners</H3>
          <Text className='text-gray-500'>Manage storefront campaign banners and CTAs</Text>
        </div>
        <Button
          variant='default'
          className='bg-blue-600 hover:bg-blue-700 text-white'
          onClick={() => {
            setIsCreating(true);
            setEditingId(null);
            setFormData({ theme: 'primary', isActive: true, priority: 0 });
          }}
        >
          <Plus size={16} className='mr-2' /> Add Banner
        </Button>
      </div>

      <div className='space-y-4'>
        {isCreating && (
          <BannerEditor
            formData={formData}
            setFormData={setFormData}
            onSave={handleSave}
            onCancel={() => setIsCreating(false)}
            onUpload={(f: File, t: 'desktop' | 'mobile') =>
              uploadMutation.mutate({ file: f, type: t })}
            isUploading={uploadMutation.isPending}
          />
        )}

        {!isCreating && banners?.length === 0 && (
          <div className='p-8 text-center bg-gray-50 border border-dashed rounded-lg'>
            <h4 className='text-lg font-medium text-gray-700'>No Banners Found</h4>
            <p className='text-gray-500 mt-1'>
              Click the "Add Banner" button above to create your first storefront campaign banner.
            </p>
          </div>
        )}

        {banners?.map((banner: CampaignBannerDTO) => (
          <Card key={banner.id} className='p-4'>
            {editingId === banner.id
              ? (
                <BannerEditor
                  formData={formData}
                  setFormData={setFormData}
                  onSave={handleSave}
                  onCancel={() => {
                    setEditingId(null);
                    setFormData({});
                  }}
                  onUpload={(f: File, t: 'desktop' | 'mobile') =>
                    uploadMutation.mutate({ file: f, type: t })}
                  isUploading={uploadMutation.isPending}
                />
              )
              : (
                <div className='flex justify-between items-start'>
                  <div>
                    <h4 className='font-semibold text-lg'>{banner.title}</h4>
                    <p className='text-sm text-gray-500'>
                      Priority: {banner.priority} | Theme: {banner.theme} | Status:{' '}
                      {banner.isActive ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                  <div className='flex space-x-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => {
                        setEditingId(banner.id);
                        setFormData(banner);
                        setIsCreating(false);
                      }}
                    >
                      <Edit size={14} />
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      className='text-red-500 hover:text-red-600'
                      onClick={() => {
                        if (confirm('Delete banner?')) deleteMutation.mutate(banner.id);
                      }}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              )}
          </Card>
        ))}
      </div>
    </div>
  );
}

function BannerEditor({ formData, setFormData, onSave, onCancel, onUpload, isUploading }: any) {
  return (
    <div className='space-y-4 border rounded-lg p-4 bg-gray-50'>
      <div className='grid grid-cols-2 gap-4'>
        <div>
          <label className='text-sm font-medium'>Title *</label>
          <Input
            value={formData.title || ''}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>
        <div>
          <label className='text-sm font-medium'>Description</label>
          <Input
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
        <div>
          <label className='text-sm font-medium'>Badge Text</label>
          <Input
            value={formData.badge || ''}
            onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
          />
        </div>
        <div>
          <label className='text-sm font-medium'>Theme</label>
          <select
            className='flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm'
            value={formData.theme || 'primary'}
            onChange={(e) => setFormData({ ...formData, theme: e.target.value as any })}
          >
            {THEMES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* CTAs */}
        <div className='col-span-2 border-t pt-4 mt-2'>
          <h4 className='font-semibold mb-2'>Primary CTA</h4>
        </div>
        <div>
          <label className='text-sm font-medium'>Label</label>
          <Input
            value={formData.primaryCtaLabel || ''}
            onChange={(e) => setFormData({ ...formData, primaryCtaLabel: e.target.value })}
          />
        </div>
        <div>
          <label className='text-sm font-medium'>Href</label>
          <Input
            value={formData.primaryCtaHref || ''}
            onChange={(e) => setFormData({ ...formData, primaryCtaHref: e.target.value })}
          />
        </div>
        <div>
          <label className='text-sm font-medium'>Color (Hex/RGB)</label>
          <div className='flex gap-2'>
            <Input
              type='color'
              className='w-12 p-1'
              value={formData.primaryCtaColor || '#2563eb'}
              onChange={(e) => setFormData({ ...formData, primaryCtaColor: e.target.value })}
            />
            <Input
              value={formData.primaryCtaColor || ''}
              onChange={(e) => setFormData({ ...formData, primaryCtaColor: e.target.value })}
              placeholder='#2563eb'
            />
          </div>
        </div>
        <div></div>

        <div className='col-span-2 border-t pt-4 mt-2'>
          <h4 className='font-semibold mb-2'>Secondary CTA</h4>
        </div>
        <div>
          <label className='text-sm font-medium'>Label</label>
          <Input
            value={formData.secondaryCtaLabel || ''}
            onChange={(e) => setFormData({ ...formData, secondaryCtaLabel: e.target.value })}
          />
        </div>
        <div>
          <label className='text-sm font-medium'>Href</label>
          <Input
            value={formData.secondaryCtaHref || ''}
            onChange={(e) => setFormData({ ...formData, secondaryCtaHref: e.target.value })}
          />
        </div>
        <div>
          <label className='text-sm font-medium'>Color (Hex/RGB)</label>
          <div className='flex gap-2'>
            <Input
              type='color'
              className='w-12 p-1'
              value={formData.secondaryCtaColor || '#ffffff'}
              onChange={(e) => setFormData({ ...formData, secondaryCtaColor: e.target.value })}
            />
            <Input
              value={formData.secondaryCtaColor || ''}
              onChange={(e) => setFormData({ ...formData, secondaryCtaColor: e.target.value })}
              placeholder='#ffffff'
            />
          </div>
        </div>
        <div></div>

        {/* Images */}
        <div className='col-span-2 border-t pt-4 mt-2'>
          <h4 className='font-semibold mb-2'>Images</h4>
        </div>
        <div>
          <label className='text-sm font-medium block mb-1'>Desktop Image URL</label>
          <Input
            value={formData.desktopImageUrl || ''}
            onChange={(e) => setFormData({ ...formData, desktopImageUrl: e.target.value })}
            className='mb-2'
          />
          <label className='cursor-pointer inline-flex items-center text-sm text-blue-600 hover:text-blue-700'>
            <ImageIcon size={14} className='mr-1' /> Upload Desktop Image
            <input
              type='file'
              className='hidden'
              accept='image/*'
              onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0], 'desktop')}
            />
          </label>
          {isUploading && <span className='ml-2 text-xs text-gray-500'>Uploading...</span>}
        </div>
        <div>
          <label className='text-sm font-medium block mb-1'>Mobile Image URL</label>
          <Input
            value={formData.mobileImageUrl || ''}
            onChange={(e) => setFormData({ ...formData, mobileImageUrl: e.target.value })}
            className='mb-2'
          />
          <label className='cursor-pointer inline-flex items-center text-sm text-blue-600 hover:text-blue-700'>
            <ImageIcon size={14} className='mr-1' /> Upload Mobile Image
            <input
              type='file'
              className='hidden'
              accept='image/*'
              onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0], 'mobile')}
            />
          </label>
          {isUploading && <span className='ml-2 text-xs text-gray-500'>Uploading...</span>}
        </div>

        {/* Settings */}
        <div className='col-span-2 border-t pt-4 mt-2 flex gap-6'>
          <label className='flex items-center space-x-2 text-sm font-medium'>
            <input
              type='checkbox'
              checked={formData.isActive ?? true}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            />
            <span>Active</span>
          </label>
          <label className='flex items-center space-x-2 text-sm font-medium'>
            <span>Priority:</span>
            <Input
              type='number'
              className='w-20'
              value={formData.priority || 0}
              onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
            />
          </label>
        </div>
      </div>

      <div className='flex justify-end space-x-2 pt-4'>
        <Button variant='outline' onClick={onCancel}>
          <X size={16} className='mr-2' /> Cancel
        </Button>
        <Button onClick={onSave}>
          <Save size={16} className='mr-2' /> Save
        </Button>
      </div>
    </div>
  );
}
