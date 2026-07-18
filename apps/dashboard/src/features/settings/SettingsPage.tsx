import { useState } from 'react';
import { Button } from '@starsuperscare/ui';
import { Bell, Check, ChevronRight, Lock, Shield, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Toggle = ({ checked, onChange }: { checked?: boolean; onChange?: () => void }) => {
  const [isOn, setIsOn] = useState(checked || false);

  const toggle = () => {
    setIsOn(!isOn);
    if (onChange) onChange();
  };

  return (
    <button
      type='button'
      role='switch'
      aria-checked={isOn}
      onClick={toggle}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
        isOn ? 'bg-indigo-600' : 'bg-muted-foreground/30'
      }`}
    >
      <span
        aria-hidden='true'
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          isOn ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
};

export const SettingsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'privacy'>(
    'notifications',
  );

  return (
    <div className='max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12'>
      {/* ── Header ── */}
      <div>
        <h1 className='text-3xl font-black text-foreground tracking-tight'>Pengaturan</h1>
        <p className='text-sm font-medium text-muted-foreground mt-1'>
          Kelola preferensi akun, keamanan, dan notifikasi Anda.
        </p>
      </div>

      <div className='flex flex-col lg:flex-row gap-8 lg:gap-10'>
        {/* ── Sidebar Navigation ── */}
        <div className='w-full lg:w-64 shrink-0'>
          <nav className='flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide'>
            <button
              type='button'
              onClick={() => navigate('/profile')}
              className='flex items-center justify-between w-full min-w-max px-4 py-3 rounded-2xl text-sm font-bold transition-all text-muted-foreground hover:bg-muted/50 hover:text-foreground'
            >
              <div className='flex items-center gap-3'>
                <div className='w-8 h-8 rounded-xl bg-muted flex items-center justify-center shrink-0'>
                  <User className='w-4 h-4' />
                </div>
                Profil Saya
              </div>
              <ChevronRight className='w-4 h-4 opacity-0 lg:opacity-50' />
            </button>
            <button
              type='button'
              onClick={() => navigate('/security')}
              className='flex items-center justify-between w-full min-w-max px-4 py-3 rounded-2xl text-sm font-bold transition-all text-muted-foreground hover:bg-muted/50 hover:text-foreground'
            >
              <div className='flex items-center gap-3'>
                <div className='w-8 h-8 rounded-xl bg-muted flex items-center justify-center shrink-0'>
                  <Shield className='w-4 h-4' />
                </div>
                Keamanan
              </div>
              <ChevronRight className='w-4 h-4 opacity-0 lg:opacity-50' />
            </button>
            <button
              type='button'
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center justify-between w-full min-w-max px-4 py-3 rounded-2xl text-sm font-bold transition-all shadow-sm ${
                activeTab === 'notifications'
                  ? 'bg-indigo-600 text-white shadow-indigo-600/20'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground bg-transparent shadow-none'
              }`}
            >
              <div className='flex items-center gap-3'>
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    activeTab === 'notifications' ? 'bg-white/20' : 'bg-muted'
                  }`}
                >
                  <Bell className='w-4 h-4' />
                </div>
                Notifikasi
              </div>
              <ChevronRight
                className={`w-4 h-4 ${
                  activeTab === 'notifications'
                    ? 'opacity-100 hidden lg:block'
                    : 'opacity-0 lg:opacity-50'
                }`}
              />
            </button>
            <button
              type='button'
              onClick={() => setActiveTab('privacy')}
              className={`flex items-center justify-between w-full min-w-max px-4 py-3 rounded-2xl text-sm font-bold transition-all shadow-sm ${
                activeTab === 'privacy'
                  ? 'bg-indigo-600 text-white shadow-indigo-600/20'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground bg-transparent shadow-none'
              }`}
            >
              <div className='flex items-center gap-3'>
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    activeTab === 'privacy' ? 'bg-white/20' : 'bg-muted'
                  }`}
                >
                  <Lock className='w-4 h-4' />
                </div>
                Privasi
              </div>
              <ChevronRight
                className={`w-4 h-4 ${
                  activeTab === 'privacy'
                    ? 'opacity-100 hidden lg:block'
                    : 'opacity-0 lg:opacity-50'
                }`}
              />
            </button>
          </nav>
        </div>

        {/* ── Main Content Area ── */}
        <div className='flex-1'>
          {activeTab === 'notifications' && (
            <div className='bg-card border border-border/60 rounded-3xl overflow-hidden shadow-sm'>
              <div className='px-6 py-5 border-b border-border/40 bg-indigo-500/5'>
                <h3 className='text-lg font-black text-foreground flex items-center gap-2'>
                  <Bell className='w-5 h-5 text-indigo-500' />
                  Preferensi Notifikasi
                </h3>
                <p className='text-sm font-medium text-muted-foreground mt-1'>
                  Pilih notifikasi apa saja yang ingin Anda terima.
                </p>
              </div>

              <div className='p-6 space-y-6'>
                {/* Setting Item */}
                <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl hover:bg-muted/30 transition-colors border border-transparent hover:border-border/40'>
                  <div className='flex gap-4'>
                    <div className='w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0'>
                      <svg
                        className='w-5 h-5 text-indigo-500'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                        />
                      </svg>
                    </div>
                    <div>
                      <label className='text-base text-foreground font-bold'>
                        Email Notifikasi Pesanan
                      </label>
                      <p className='text-sm font-medium text-muted-foreground mt-0.5 leading-snug'>
                        Terima update status pesanan via email.
                      </p>
                    </div>
                  </div>
                  <div className='shrink-0 flex items-center'>
                    <Toggle checked />
                  </div>
                </div>

                {/* Setting Item */}
                <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl hover:bg-muted/30 transition-colors border border-transparent hover:border-border/40'>
                  <div className='flex gap-4'>
                    <div className='w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0'>
                      <svg
                        className='w-5 h-5 text-amber-500'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7'
                        />
                      </svg>
                    </div>
                    <div>
                      <label className='text-base text-foreground font-bold'>
                        Promo & Penawaran
                      </label>
                      <p className='text-sm font-medium text-muted-foreground mt-0.5 leading-snug'>
                        Dapatkan info diskon eksklusif dan penawaran spesial.
                      </p>
                    </div>
                  </div>
                  <div className='shrink-0 flex items-center'>
                    <Toggle checked={false} />
                  </div>
                </div>

                {/* Setting Item */}
                <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl hover:bg-muted/30 transition-colors border border-transparent hover:border-border/40'>
                  <div className='flex gap-4'>
                    <div className='w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0'>
                      <svg
                        className='w-5 h-5 text-emerald-500'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z'
                        />
                      </svg>
                    </div>
                    <div>
                      <label className='text-base text-foreground font-bold'>
                        Notifikasi Push / In-App
                      </label>
                      <p className='text-sm font-medium text-muted-foreground mt-0.5 leading-snug'>
                        Pemberitahuan real-time langsung di Dashboard Anda.
                      </p>
                    </div>
                  </div>
                  <div className='shrink-0 flex items-center'>
                    <Toggle checked />
                  </div>
                </div>
              </div>

              <div className='p-6 pt-4 border-t border-border/40 bg-muted/10 flex justify-end'>
                <Button className='rounded-full px-8 py-2.5 font-bold shadow-md shadow-indigo-600/10 active:scale-95 transition-transform bg-indigo-600 hover:bg-indigo-700 text-white'>
                  <Check className='w-4 h-4 mr-2' />
                  Simpan Preferensi
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className='bg-card border border-border/60 rounded-3xl overflow-hidden shadow-sm'>
              <div className='px-6 py-5 border-b border-border/40 bg-blue-500/5'>
                <h3 className='text-lg font-black text-foreground flex items-center gap-2'>
                  <Lock className='w-5 h-5 text-blue-500' />
                  Pengaturan Privasi
                </h3>
                <p className='text-sm font-medium text-muted-foreground mt-1'>
                  Kontrol data apa saja yang Anda bagikan.
                </p>
              </div>

              <div className='p-6 space-y-6'>
                {/* Setting Item */}
                <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl hover:bg-muted/30 transition-colors border border-transparent hover:border-border/40'>
                  <div className='flex gap-4'>
                    <div className='w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0'>
                      <svg
                        className='w-5 h-5 text-blue-500'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                        />
                      </svg>
                    </div>
                    <div>
                      <label className='text-base text-foreground font-bold'>
                        Bagikan Data Penggunaan
                      </label>
                      <p className='text-sm font-medium text-muted-foreground mt-0.5 leading-snug max-w-md'>
                        Bantu kami meningkatkan layanan dengan mengirimkan analitik anonim.
                      </p>
                    </div>
                  </div>
                  <div className='shrink-0 flex items-center'>
                    <Toggle checked />
                  </div>
                </div>

                {/* Setting Item */}
                <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl hover:bg-muted/30 transition-colors border border-transparent hover:border-border/40'>
                  <div className='flex gap-4'>
                    <div className='w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0'>
                      <svg
                        className='w-5 h-5 text-purple-500'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                        />
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                        />
                      </svg>
                    </div>
                    <div>
                      <label className='text-base text-foreground font-bold'>
                        Visibilitas Ulasan
                      </label>
                      <p className='text-sm font-medium text-muted-foreground mt-0.5 leading-snug'>
                        Tampilkan nama asli Anda pada ulasan produk.
                      </p>
                    </div>
                  </div>
                  <div className='shrink-0 flex items-center'>
                    <Toggle checked />
                  </div>
                </div>
              </div>

              <div className='p-6 pt-4 border-t border-rose-500/20 bg-rose-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                <div>
                  <p className='text-sm font-bold text-rose-600 dark:text-rose-400'>Zona Bahaya</p>
                  <p className='text-[13px] font-medium text-muted-foreground mt-0.5'>
                    Tindakan ini tidak dapat dibatalkan.
                  </p>
                </div>
                <Button
                  variant='destructive'
                  className='rounded-full px-6 py-2.5 font-bold shadow-sm hover:shadow-md hover:bg-rose-700 active:scale-95 transition-all'
                >
                  Minta Penghapusan Akun
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
