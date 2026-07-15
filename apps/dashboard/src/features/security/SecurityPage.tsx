import React, { useState } from 'react';
import useSWR from 'swr';
import { client } from '../../lib/api.ts';
import { Button, Input, Label } from '@starsuperscare/ui';

const fetchSessions = async () => {
  const res = await client.v1.me.security.sessions.$get();
  if (!res.ok) throw new Error('Failed to fetch sessions');
  const result = await res.json();
  return result.data;
};

export function SecurityPage() {
  const { data, error, isLoading, mutate } = useSWR('/api/v1/me/security/sessions', fetchSessions);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage('Error: Sandi baru tidak cocok dengan konfirmasi');
      return;
    }

    setIsSaving(true);
    setMessage('');
    try {
      const res = await client.v1.me.security.password.$patch({
        json: {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        },
      });

      if (!res.ok) {
        const errData = await res.json() as any;
        throw new Error(errData.error?.message || 'Gagal mengubah sandi');
      }

      setMessage('Sandi berhasil diubah!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRevokeSession = async (id: string) => {
    if (!confirm('Cabut sesi ini? Anda akan logout di perangkat terkait.')) return;
    try {
      const res = await client.v1.me.security.sessions[':id'].$delete({ param: { id } });
      if (!res.ok) throw new Error('Gagal mencabut sesi');
      mutate();
    } catch (_err) {
      alert('Error mencabut sesi');
    }
  };

  const handleRevokeOtherSessions = async () => {
    if (
      !confirm('Cabut semua sesi lain? Anda akan logout di semua perangkat kecuali perangkat ini.')
    ) return;
    try {
      const res = await client.v1.me.security.sessions.$delete();
      if (!res.ok) throw new Error('Gagal mencabut sesi lain');
      mutate();
    } catch (_err) {
      alert('Error mencabut sesi lain');
    }
  };

  return (
    <div className='max-w-4xl space-y-8'>
      <h1 className='text-2xl font-bold text-gray-900'>Keamanan & Sesi</h1>

      {message && (
        <div
          className={`p-4 rounded-md ${
            message.startsWith('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
          }`}
        >
          {message}
        </div>
      )}

      {/* Change Password */}
      <div className='bg-white rounded-lg shadow p-6'>
        <h2 className='text-lg font-semibold mb-4'>Ubah Kata Sandi</h2>
        <form onSubmit={handlePasswordSubmit} className='space-y-4 max-w-sm'>
          <div className='space-y-2'>
            <Label htmlFor='currentPassword'>Sandi Saat Ini</Label>
            <Input
              id='currentPassword'
              type='password'
              required
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='newPassword'>Sandi Baru</Label>
            <Input
              id='newPassword'
              type='password'
              required
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
            />
            <p className='text-xs text-gray-500'>
              Min. 8 karakter, kombinasi huruf besar, kecil, dan angka.
            </p>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='confirmPassword'>Konfirmasi Sandi Baru</Label>
            <Input
              id='confirmPassword'
              type='password'
              required
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
            />
          </div>
          <Button type='submit' disabled={isSaving}>
            {isSaving ? 'Menyimpan...' : 'Perbarui Sandi'}
          </Button>
        </form>
      </div>

      {/* Sessions */}
      <div className='bg-white rounded-lg shadow p-6'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-lg font-semibold'>Sesi Aktif</h2>
          <Button variant='outline' onClick={handleRevokeOtherSessions}>Cabut Sesi Lainnya</Button>
        </div>

        {isLoading
          ? <div>Memuat sesi...</div>
          : error
          ? <div className='text-red-500'>Gagal memuat sesi</div>
          : (
            <div className='divide-y divide-gray-200'>
              {data?.sessions.map((s: any) => (
                <div key={s.id} className='py-4 flex items-center justify-between'>
                  <div>
                    <p className='font-medium text-gray-900'>
                      {s.userAgent || 'Unknown Device'}{' '}
                      {s.isCurrent && (
                        <span className='ml-2 inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20'>
                          Perangkat Ini
                        </span>
                      )}
                    </p>
                    <p className='text-sm text-gray-500'>
                      IP: {s.ipHash || 'N/A'} • Terakhir dilihat:{' '}
                      {new Date(s.lastSeenAt).toLocaleString('id-ID')}
                    </p>
                  </div>
                  {!s.isCurrent && (
                    <Button
                      variant='ghost'
                      className='text-red-600 hover:text-red-700 hover:bg-red-50'
                      onClick={() => handleRevokeSession(s.id)}
                    >
                      Cabut
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
      </div>

      {/* Login History */}
      <div className='bg-white rounded-lg shadow p-6'>
        <h2 className='text-lg font-semibold mb-4'>Riwayat Login (10 Terakhir)</h2>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-300'>
            <thead>
              <tr>
                <th className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900'>
                  Waktu
                </th>
                <th className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'>
                  Perangkat
                </th>
                <th className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'>
                  Status
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              {data?.loginAttempts?.map((l: any) => (
                <tr key={l.id}>
                  <td className='whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900'>
                    {new Date(l.attemptedAt).toLocaleString('id-ID')}
                  </td>
                  <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                    {l.userAgent || 'Unknown'}
                  </td>
                  <td className='whitespace-nowrap px-3 py-4 text-sm'>
                    {l.isSuccess
                      ? <span className='text-green-600 font-medium'>Berhasil</span>
                      : <span className='text-red-600 font-medium'>Gagal</span>}
                  </td>
                </tr>
              ))}
              {(!data?.loginAttempts || data.loginAttempts.length === 0) && (
                <tr>
                  <td colSpan={3} className='py-4 text-center text-sm text-gray-500'>
                    Belum ada riwayat.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
