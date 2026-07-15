import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import { client } from '../../lib/api.ts';
import { Button, Input, Label } from '@starsuperscare/ui';

const fetchProfile = async () => {
  const res = await client.v1.me.profile.$get();
  if (!res.ok) throw new Error('Failed to fetch profile');
  const result = await res.json();
  return result.data;
};

export function ProfilePage() {
  const { data: profile, error, isLoading, mutate } = useSWR('/api/v1/me/profile', fetchProfile);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    locale: 'id-ID',
    timezone: 'Asia/Jakarta',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || '',
        phone: profile.phone || '',
        locale: profile.locale || 'id-ID',
        timezone: profile.timezone || 'Asia/Jakarta',
      });
    }
  }, [profile]);

  if (isLoading) return <div>Memuat profil...</div>;
  if (error) return <div className='text-red-500'>Gagal memuat profil: {error.message}</div>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');
    try {
      const res = await client.v1.me.profile.$patch({ json: formData });
      if (!res.ok) {
        throw new Error('Gagal menyimpan profil');
      }
      setMessage('Profil berhasil diperbarui!');
      mutate();
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className='max-w-2xl'>
      <h1 className='text-2xl font-bold text-gray-900 mb-6'>Profil Saya</h1>

      {message && (
        <div
          className={`p-4 mb-6 rounded-md ${
            message.startsWith('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
          }`}
        >
          {message}
        </div>
      )}

      <div className='bg-white rounded-lg shadow p-6'>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                value={profile?.email || ''}
                disabled
                className='bg-gray-50 text-gray-500'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='username'>Username</Label>
              <Input
                id='username'
                type='text'
                value={profile?.username || ''}
                disabled
                className='bg-gray-50 text-gray-500'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='fullName'>Nama Lengkap</Label>
              <Input
                id='fullName'
                type='text'
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder='Nama Lengkap'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='phone'>Nomor Telepon</Label>
              <Input
                id='phone'
                type='tel'
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder='081234567890'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='locale'>Bahasa (Locale)</Label>
              <select
                id='locale'
                className='flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50'
                value={formData.locale}
                onChange={(e) => setFormData({ ...formData, locale: e.target.value })}
              >
                <option value='id-ID'>Indonesia (id-ID)</option>
                <option value='en-US'>English (en-US)</option>
              </select>
            </div>
          </div>

          <div className='pt-4 border-t border-gray-200'>
            <Button type='submit' disabled={isSaving}>
              {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
