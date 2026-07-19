import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import { client } from '../../lib/api.ts';
import { Button, Input, Label, toast } from '@starsuperscare/ui';
import {
  ChevronRight,
  CreditCard,
  Download,
  Globe,
  Heart,
  HelpCircle,
  History,
  KeyRound,
  Loader2,
  Mail,
  MapPin,
  Phone,
  RefreshCcw,
  Save,
  Settings,
  Shield,
  ShieldCheck,
  Star,
  Truck,
  User,
  UserCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';

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

  if (isLoading) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[400px] space-y-4'>
        <Loader2 className='w-10 h-10 animate-spin text-primary/60' />
        <p className='text-sm font-medium text-muted-foreground animate-pulse'>
          Memuat data profil Anda...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[400px] bg-red-50/50 dark:bg-red-950/20 rounded-3xl border border-red-100 dark:border-red-900/30 p-8 text-center'>
        <div className='w-16 h-16 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center mb-4'>
          <UserCircle className='w-8 h-8 text-red-600 dark:text-red-400' />
        </div>
        <h3 className='text-lg font-bold text-red-700 dark:text-red-400 mb-2'>
          Gagal Memuat Profil
        </h3>
        <p className='text-red-600/80 dark:text-red-400/80 max-w-sm'>{error.message}</p>
        <Button
          variant='outline'
          onClick={() => mutate()}
          className='mt-6 border-red-200 text-red-600 hover:bg-red-50'
        >
          Coba Lagi
        </Button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await client.v1.me.profile.$patch({ json: formData });
      if (!res.ok) throw new Error('Gagal menyimpan profil');
      toast.success('Profil berhasil diperbarui!');
      mutate();
    } catch (err: any) {
      toast.error(err.message || 'Terjadi kesalahan');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className='max-w-4xl mx-auto pb-12 animate-in fade-in duration-500'>
      {/* Header Section */}
      <div className='relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 p-8 sm:p-10 shadow-xl mb-8'>
        <div className='absolute top-0 right-0 -mt-16 -mr-16 opacity-20 pointer-events-none'>
          <svg
            viewBox='0 0 200 200'
            xmlns='http://www.w3.org/2000/svg'
            className='w-96 h-96 fill-white'
          >
            <path
              d='M44.7,-76.4C58.8,-69.2,71.8,-59.1,81.6,-46.3C91.4,-33.5,98,-18.1,97.7,-3.1C97.4,12,90.2,26.7,80.1,38.6C70,50.5,57.1,59.5,43.2,66.8C29.3,74.1,14.6,79.7,0.4,79.1C-13.9,78.5,-27.7,71.6,-40.4,63.6C-53.1,55.6,-64.7,46.5,-73.4,34.4C-82.1,22.3,-87.9,7.2,-87.4,-7.8C-86.9,-22.8,-80.1,-37.6,-70.5,-49.4C-60.9,-61.2,-48.5,-70,-35.1,-76.3C-21.7,-82.6,-7.3,-86.4,3.7,-91.6C14.7,-96.8,29.4,-93.4,44.7,-76.4Z'
              transform='translate(100 100)'
            />
          </svg>
        </div>

        <div className='relative z-10 flex flex-col sm:flex-row items-center gap-6'>
          <div className='relative'>
            <div className='w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white/20 backdrop-blur-md border-4 border-white/30 flex items-center justify-center shadow-2xl'>
              <span className='text-4xl sm:text-5xl font-extrabold text-white tracking-wider'>
                {profile?.fullName?.charAt(0).toUpperCase() ||
                  profile?.username?.charAt(0).toUpperCase() || '?'}
              </span>
            </div>
            {(profile as any)?.emailVerified && (
              <div
                className='absolute bottom-0 right-0 w-8 h-8 bg-emerald-400 rounded-full border-4 border-purple-700 flex items-center justify-center shadow-lg'
                title='Email Terverifikasi'
              >
                <ShieldCheck className='w-4 h-4 text-white' />
              </div>
            )}
          </div>
          <div className='text-center sm:text-left'>
            <h1 className='text-3xl sm:text-4xl font-bold text-white mb-2'>
              {profile?.fullName || profile?.username || 'Pengguna'}
            </h1>
            <p className='text-purple-100 font-medium flex items-center justify-center sm:justify-start gap-2 text-sm sm:text-base'>
              <Mail className='w-4 h-4 opacity-80' />
              {profile?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className='lg:hidden mb-8 space-y-4 animate-in slide-in-from-bottom-4'>
        <h2 className='text-lg font-bold text-foreground px-1'>Menu Akun</h2>
        <div className='bg-card dark:bg-background rounded-3xl p-2 shadow-sm border border-border/60 divide-y divide-border/40'>
          {[
            {
              path: (import.meta as any).env?.VITE_TRACKING_URL,
              icon: Truck,
              label: 'Lacak Pesanan',
              color: 'text-amber-500 dark:text-amber-400',
              bg: 'bg-amber-100 dark:bg-amber-900/30',
              external: true,
            },
            {
              path: '/addresses',
              icon: MapPin,
              label: 'Alamat Pengiriman',
              color: 'text-blue-500 dark:text-blue-400',
              bg: 'bg-blue-100 dark:bg-blue-900/30',
            },
            {
              path: '/history',
              icon: History,
              label: 'Riwayat Pembelian',
              color: 'text-indigo-500 dark:text-indigo-400',
              bg: 'bg-indigo-100 dark:bg-indigo-900/30',
            },
            {
              path: '/downloads',
              icon: Download,
              label: 'Unduhan Digital',
              color: 'text-cyan-500 dark:text-cyan-400',
              bg: 'bg-cyan-100 dark:bg-cyan-900/30',
            },
            {
              path: '/returns',
              icon: RefreshCcw,
              label: 'Pengembalian',
              color: 'text-orange-500 dark:text-orange-400',
              bg: 'bg-orange-100 dark:bg-orange-900/30',
            },
            {
              path: '/reviews',
              icon: Star,
              label: 'Ulasan Saya',
              color: 'text-yellow-500 dark:text-yellow-400',
              bg: 'bg-yellow-100 dark:bg-yellow-900/30',
            },
            {
              path: '/security',
              icon: Shield,
              label: 'Keamanan & Sesi',
              color: 'text-rose-500 dark:text-rose-400',
              bg: 'bg-rose-100 dark:bg-rose-900/30',
            },
            {
              path: '/payments',
              icon: CreditCard,
              label: 'Metode Pembayaran',
              color: 'text-emerald-500 dark:text-emerald-400',
              bg: 'bg-emerald-100 dark:bg-emerald-900/30',
            },
            {
              path: '/wishlist',
              icon: Heart,
              label: 'Favorit Saya',
              color: 'text-pink-500 dark:text-pink-400',
              bg: 'bg-pink-100 dark:bg-pink-900/30',
            },
            {
              path: '/support',
              icon: HelpCircle,
              label: 'Pusat Bantuan',
              color: 'text-purple-500 dark:text-purple-400',
              bg: 'bg-purple-100 dark:bg-purple-900/30',
            },
            {
              path: '/settings',
              icon: Settings,
              label: 'Pengaturan',
              color: 'text-slate-500 dark:text-slate-400',
              bg: 'bg-slate-100 dark:bg-slate-800',
            },
          ].map((menu) => {
            const innerContent = (
              <>
                <div className='flex items-center gap-4'>
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${menu.bg}`}
                  >
                    <menu.icon className={`w-5 h-5 ${menu.color}`} />
                  </div>
                  <span className='font-semibold text-foreground group-hover:text-primary transition-colors'>
                    {menu.label}
                  </span>
                </div>
                <ChevronRight className='w-5 h-5 text-muted-foreground/40 group-hover:text-primary/70 group-hover:translate-x-1 transition-all' />
              </>
            );

            return menu.external
              ? (
                <a
                  key={menu.path}
                  href={menu.path}
                  className='flex items-center justify-between p-4 hover:bg-muted/50 transition-colors first:rounded-t-2xl last:rounded-b-2xl group'
                >
                  {innerContent}
                </a>
              )
              : (
                <Link
                  key={menu.path}
                  to={menu.path}
                  className='flex items-center justify-between p-4 hover:bg-muted/50 transition-colors first:rounded-t-2xl last:rounded-b-2xl group'
                >
                  {innerContent}
                </Link>
              );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className='space-y-8'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Akun & Keamanan */}
          <div className='bg-card dark:bg-background rounded-3xl p-6 sm:p-8 shadow-sm border border-border/60'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center'>
                <KeyRound className='w-5 h-5 text-blue-600 dark:text-blue-400' />
              </div>
              <h2 className='text-xl font-bold text-foreground'>Akun & Keamanan</h2>
            </div>

            <div className='space-y-5'>
              <div className='space-y-2.5'>
                <Label htmlFor='email' className='text-muted-foreground font-semibold ml-1'>
                  Alamat Email
                </Label>
                <div className='relative'>
                  <Mail className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/60' />
                  <Input
                    id='email'
                    type='email'
                    value={profile?.email || ''}
                    disabled
                    className='pl-11 h-12 bg-muted/50 border-transparent font-medium text-foreground opacity-70 cursor-not-allowed rounded-xl'
                  />
                </div>
              </div>

              <div className='space-y-2.5'>
                <Label htmlFor='username' className='text-muted-foreground font-semibold ml-1'>
                  Username
                </Label>
                <div className='relative'>
                  <User className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/60' />
                  <Input
                    id='username'
                    type='text'
                    value={profile?.username || ''}
                    disabled
                    className='pl-11 h-12 bg-muted/50 border-transparent font-medium text-foreground opacity-70 cursor-not-allowed rounded-xl'
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Informasi Pribadi */}
          <div className='bg-card dark:bg-background rounded-3xl p-6 sm:p-8 shadow-sm border border-border/60'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center'>
                <UserCircle className='w-5 h-5 text-purple-600 dark:text-purple-400' />
              </div>
              <h2 className='text-xl font-bold text-foreground'>Informasi Pribadi</h2>
            </div>

            <div className='space-y-5'>
              <div className='space-y-2.5'>
                <Label htmlFor='fullName' className='text-muted-foreground font-semibold ml-1'>
                  Nama Lengkap
                </Label>
                <div className='relative'>
                  <User className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50' />
                  <Input
                    id='fullName'
                    type='text'
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder='Tulis nama lengkap Anda'
                    className='pl-11 h-12 rounded-xl border-input/60 focus:border-purple-500 focus:ring-purple-500/20 text-foreground bg-background'
                  />
                </div>
              </div>

              <div className='space-y-2.5'>
                <Label htmlFor='phone' className='text-muted-foreground font-semibold ml-1'>
                  Nomor Telepon
                </Label>
                <div className='relative'>
                  <Phone className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50' />
                  <Input
                    id='phone'
                    type='tel'
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder='Contoh: 081234567890'
                    className='pl-11 h-12 rounded-xl border-input/60 focus:border-purple-500 focus:ring-purple-500/20 text-foreground bg-background'
                  />
                </div>
              </div>

              <div className='space-y-2.5'>
                <Label htmlFor='locale' className='text-muted-foreground font-semibold ml-1'>
                  Bahasa & Lokasi
                </Label>
                <div className='relative'>
                  <Globe className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50 pointer-events-none' />
                  <select
                    id='locale'
                    className='pl-11 h-12 w-full appearance-none rounded-xl border border-input/60 bg-background px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all'
                    value={formData.locale}
                    onChange={(e) => setFormData({ ...formData, locale: e.target.value })}
                  >
                    <option value='id-ID'>Indonesia (ID)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className='flex flex-col sm:flex-row items-center justify-end gap-4 pt-6 border-t border-border/40'>
          <Button
            type='button'
            variant='ghost'
            className='w-full sm:w-auto h-12 px-8 rounded-xl font-semibold text-muted-foreground hover:text-foreground'
            onClick={() => mutate()}
            disabled={isSaving}
          >
            Batal
          </Button>
          <Button
            type='submit'
            disabled={isSaving}
            className='w-full sm:w-auto h-12 px-8 rounded-xl font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all'
          >
            {isSaving
              ? (
                <>
                  <Loader2 className='w-5 h-5 mr-2 animate-spin' />
                  Menyimpan...
                </>
              )
              : (
                <>
                  <Save className='w-5 h-5 mr-2' />
                  Simpan Perubahan
                </>
              )}
          </Button>
        </div>
      </form>
    </div>
  );
}
