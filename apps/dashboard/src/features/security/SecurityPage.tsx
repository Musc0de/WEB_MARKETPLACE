import React, { useState } from 'react';
import useSWR from 'swr';
import { client } from '../../lib/api.ts';
import { Button, Input, Label, toast } from '@starsuperscare/ui';
import {
  CheckCircle2,
  History,
  KeyRound,
  Laptop,
  Loader2,
  LockKeyhole,
  LogOut,
  MonitorSmartphone,
  Shield,
  Smartphone,
  XCircle,
} from 'lucide-react';

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

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Sandi baru tidak cocok dengan konfirmasi');
      return;
    }

    setIsSaving(true);
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

      toast.success('Sandi berhasil diubah secara permanen!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      toast.error(err.message || 'Terjadi kesalahan saat mengubah sandi');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRevokeSession = async (id: string) => {
    if (!confirm('Cabut sesi ini? Anda akan logout di perangkat terkait.')) return;
    try {
      const res = await client.v1.me.security.sessions[':id'].$delete({ param: { id } });
      if (!res.ok) throw new Error('Gagal mencabut sesi');
      toast.success('Sesi perangkat berhasil dicabut.');
      mutate();
    } catch (err: any) {
      toast.error(err.message || 'Error mencabut sesi');
    }
  };

  const handleRevokeOtherSessions = async () => {
    if (
      !confirm('Cabut semua sesi lain? Anda akan logout di semua perangkat kecuali perangkat ini.')
    ) return;
    try {
      const res = await client.v1.me.security.sessions.$delete();
      if (!res.ok) throw new Error('Gagal mencabut sesi lain');
      toast.success('Semua sesi lain berhasil dicabut.');
      mutate();
    } catch (err: any) {
      toast.error(err.message || 'Error mencabut sesi lain');
    }
  };

  const getDeviceIcon = (userAgent: string) => {
    const ua = userAgent.toLowerCase();
    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
      return <Smartphone className='w-6 h-6 text-indigo-500' />;
    }
    if (ua.includes('mac') || ua.includes('windows') || ua.includes('linux')) {
      return <Laptop className='w-6 h-6 text-blue-500' />;
    }
    return <MonitorSmartphone className='w-6 h-6 text-purple-500' />;
  };

  return (
    <div className='max-w-5xl mx-auto pb-12 animate-in fade-in duration-500'>
      {/* Header Banner */}
      <div className='relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-8 sm:p-10 shadow-xl mb-8 border border-indigo-900/50'>
        <div className='absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none'>
          <div className='absolute -top-24 -right-12 w-64 h-64 bg-indigo-500 rounded-full blur-[80px]' />
          <div className='absolute -bottom-24 -left-12 w-64 h-64 bg-blue-500 rounded-full blur-[80px]' />
        </div>

        <div className='relative z-10 flex flex-col sm:flex-row items-center gap-6'>
          <div className='w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-indigo-500/20 backdrop-blur-md border border-indigo-500/30 flex items-center justify-center shadow-[0_0_30px_-5px_rgba(99,102,241,0.4)]'>
            <Shield className='w-10 h-10 sm:w-12 sm:h-12 text-indigo-300' />
          </div>
          <div className='text-center sm:text-left'>
            <h1 className='text-3xl sm:text-4xl font-bold text-white mb-2 tracking-tight'>
              Keamanan & Sesi
            </h1>
            <p className='text-indigo-200 font-medium text-sm sm:text-base max-w-lg'>
              Kelola kata sandi Anda dan pantau aktivitas sesi masuk di semua perangkat yang
              terhubung.
            </p>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 xl:grid-cols-3 gap-8'>
        {/* Left Column: Password */}
        <div className='xl:col-span-1 space-y-8'>
          <div className='bg-card dark:bg-background rounded-3xl p-6 sm:p-8 shadow-sm border border-border/60'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center'>
                <LockKeyhole className='w-5 h-5 text-rose-600 dark:text-rose-400' />
              </div>
              <h2 className='text-xl font-bold text-foreground'>Ubah Sandi</h2>
            </div>

            <form onSubmit={handlePasswordSubmit} className='space-y-5'>
              <div className='space-y-2.5'>
                <Label
                  htmlFor='currentPassword'
                  className='text-muted-foreground font-semibold ml-1'
                >
                  Sandi Saat Ini
                </Label>
                <div className='relative'>
                  <KeyRound className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50' />
                  <Input
                    id='currentPassword'
                    type='password'
                    required
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className='pl-11 h-12 rounded-xl border-input/60 focus:border-rose-500 focus:ring-rose-500/20 text-foreground bg-background'
                    placeholder='Masukkan sandi saat ini'
                  />
                </div>
              </div>

              <div className='h-px bg-border/50 my-4' />

              <div className='space-y-2.5'>
                <Label htmlFor='newPassword' className='text-muted-foreground font-semibold ml-1'>
                  Sandi Baru
                </Label>
                <div className='relative'>
                  <KeyRound className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50' />
                  <Input
                    id='newPassword'
                    type='password'
                    required
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className='pl-11 h-12 rounded-xl border-input/60 focus:border-rose-500 focus:ring-rose-500/20 text-foreground bg-background'
                    placeholder='Masukkan sandi baru'
                  />
                </div>
                <p className='text-[11px] font-medium text-muted-foreground ml-1'>
                  Gunakan kombinasi minimal 8 karakter huruf & angka.
                </p>
              </div>

              <div className='space-y-2.5'>
                <Label
                  htmlFor='confirmPassword'
                  className='text-muted-foreground font-semibold ml-1'
                >
                  Konfirmasi Sandi Baru
                </Label>
                <div className='relative'>
                  <KeyRound className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50' />
                  <Input
                    id='confirmPassword'
                    type='password'
                    required
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className='pl-11 h-12 rounded-xl border-input/60 focus:border-rose-500 focus:ring-rose-500/20 text-foreground bg-background'
                    placeholder='Ulangi sandi baru'
                  />
                </div>
              </div>

              <Button
                type='submit'
                disabled={isSaving || !passwordForm.currentPassword || !passwordForm.newPassword ||
                  !passwordForm.confirmPassword}
                className='w-full h-12 mt-2 rounded-xl font-semibold shadow-lg shadow-rose-500/20 bg-rose-600 hover:bg-rose-700 text-white transition-all hover:scale-[1.02] active:scale-[0.98]'
              >
                {isSaving
                  ? (
                    <>
                      <Loader2 className='w-5 h-5 mr-2 animate-spin' /> Menyimpan...
                    </>
                  )
                  : 'Perbarui Sandi'}
              </Button>
            </form>
          </div>
        </div>

        {/* Right Column: Sessions & History */}
        <div className='xl:col-span-2 space-y-8'>
          {/* Active Sessions */}
          <div className='bg-card dark:bg-background rounded-3xl p-6 sm:p-8 shadow-sm border border-border/60'>
            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6'>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center'>
                  <MonitorSmartphone className='w-5 h-5 text-emerald-600 dark:text-emerald-400' />
                </div>
                <div>
                  <h2 className='text-xl font-bold text-foreground'>Sesi Aktif</h2>
                  <p className='text-sm text-muted-foreground'>Perangkat yang sedang terhubung</p>
                </div>
              </div>
              <Button
                variant='outline'
                onClick={handleRevokeOtherSessions}
                className='rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/50 dark:hover:bg-red-950/30'
              >
                <LogOut className='w-4 h-4 mr-2' />
                Cabut Sesi Lain
              </Button>
            </div>

            {isLoading
              ? (
                <div className='flex flex-col items-center justify-center py-12'>
                  <Loader2 className='w-8 h-8 animate-spin text-primary/50 mb-3' />
                  <p className='text-muted-foreground animate-pulse text-sm'>
                    Memuat sesi aktif...
                  </p>
                </div>
              )
              : error
              ? (
                <div className='p-6 bg-red-50 dark:bg-red-950/20 rounded-2xl border border-red-100 dark:border-red-900/30 text-center'>
                  <p className='text-red-600 dark:text-red-400 font-medium'>Gagal memuat sesi</p>
                </div>
              )
              : (
                <div className='space-y-4'>
                  {data?.sessions.map((s: any) => (
                    <div
                      key={s.id}
                      className={`p-5 rounded-2xl border ${
                        s.isCurrent
                          ? 'bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-900/30'
                          : 'bg-muted/30 border-border/50'
                      }`}
                    >
                      <div className='flex items-start sm:items-center justify-between gap-4 flex-col sm:flex-row'>
                        <div className='flex items-center gap-4'>
                          <div
                            className={`p-3 rounded-xl ${
                              s.isCurrent
                                ? 'bg-emerald-100 dark:bg-emerald-900/40'
                                : 'bg-background shadow-sm border border-border/50'
                            }`}
                          >
                            {getDeviceIcon(s.userAgent)}
                          </div>
                          <div>
                            <div className='flex items-center gap-2 flex-wrap'>
                              <p className='font-bold text-foreground'>
                                {s.userAgent || 'Unknown Device'}
                              </p>
                              {s.isCurrent && (
                                <span className='inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 ring-1 ring-inset ring-emerald-500/20 uppercase tracking-wider'>
                                  <CheckCircle2 className='w-3 h-3' /> Perangkat Ini
                                </span>
                              )}
                            </div>
                            <p className='text-sm text-muted-foreground mt-1'>
                              <span className='font-medium text-foreground/70'>IP:</span>{' '}
                              {s.ipHash || 'N/A'} <span className='mx-1.5 opacity-50'>•</span>
                              <span className='font-medium text-foreground/70'>Terlihat:</span>{' '}
                              {new Date(s.lastSeenAt).toLocaleString('id-ID', {
                                dateStyle: 'medium',
                                timeStyle: 'short',
                              })}
                            </p>
                          </div>
                        </div>
                        {!s.isCurrent && (
                          <Button
                            variant='ghost'
                            size='sm'
                            className='w-full sm:w-auto rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 font-semibold'
                            onClick={() => handleRevokeSession(s.id)}
                          >
                            Cabut Akses
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>

          {/* Login History */}
          <div className='bg-card dark:bg-background rounded-3xl p-6 sm:p-8 shadow-sm border border-border/60'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center'>
                <History className='w-5 h-5 text-orange-600 dark:text-orange-400' />
              </div>
              <h2 className='text-xl font-bold text-foreground'>Riwayat Login</h2>
            </div>

            <div className='overflow-hidden rounded-2xl border border-border/60'>
              <div className='overflow-x-auto'>
                <table className='w-full text-left text-sm'>
                  <thead className='bg-muted/50 border-b border-border/60 text-muted-foreground'>
                    <tr>
                      <th className='py-4 pl-6 pr-4 font-semibold'>Waktu</th>
                      <th className='py-4 px-4 font-semibold'>Perangkat</th>
                      <th className='py-4 px-6 font-semibold text-right'>Status</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-border/40'>
                    {data?.loginAttempts?.map((l: any) => (
                      <tr key={l.id} className='hover:bg-muted/20 transition-colors'>
                        <td className='py-4 pl-6 pr-4 font-medium text-foreground whitespace-nowrap'>
                          {new Date(l.attemptedAt).toLocaleString('id-ID', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        </td>
                        <td
                          className='py-4 px-4 text-muted-foreground max-w-[200px] truncate'
                          title={l.userAgent}
                        >
                          {l.userAgent || 'Unknown'}
                        </td>
                        <td className='py-4 px-6 text-right whitespace-nowrap'>
                          {l.isSuccess
                            ? (
                              <span className='inline-flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg text-xs'>
                                <CheckCircle2 className='w-3.5 h-3.5' /> Sukses
                              </span>
                            )
                            : (
                              <span className='inline-flex items-center gap-1.5 font-bold text-red-600 dark:text-red-400 bg-red-500/10 px-2.5 py-1 rounded-lg text-xs'>
                                <XCircle className='w-3.5 h-3.5' /> Gagal
                              </span>
                            )}
                        </td>
                      </tr>
                    ))}
                    {(!data?.loginAttempts || data.loginAttempts.length === 0) && (
                      <tr>
                        <td colSpan={3} className='py-12 text-center text-muted-foreground'>
                          <div className='flex flex-col items-center justify-center gap-2'>
                            <History className='w-8 h-8 opacity-20' />
                            <span>Belum ada riwayat masuk tercatat.</span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
