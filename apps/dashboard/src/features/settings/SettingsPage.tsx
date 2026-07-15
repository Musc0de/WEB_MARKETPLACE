import { useState } from 'react';
import { Button, Card } from '@starsuperscare/ui';
import { Bell, Lock, Shield, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SettingsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'privacy'>(
    'notifications',
  );

  return (
    <div className='max-w-4xl mx-auto space-y-6'>
      <div>
        <h1 className='text-2xl font-bold text-white'>Pengaturan</h1>
        <p className='text-muted-foreground mt-1'>
          Kelola preferensi akun, keamanan, dan notifikasi Anda.
        </p>
      </div>

      <div className='flex flex-col md:flex-row gap-6'>
        <div className='w-full md:w-64 space-y-1 shrink-0'>
          <button
            type='button'
            onClick={() => navigate('/profile')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors text-muted-foreground hover:bg-white/5 hover:text-white`}
          >
            <User className='w-4 h-4' /> Profil Saya
          </button>
          <button
            type='button'
            onClick={() => navigate('/security')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors text-muted-foreground hover:bg-white/5 hover:text-white`}
          >
            <Shield className='w-4 h-4' /> Keamanan
          </button>
          <button
            type='button'
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
              activeTab === 'notifications'
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-muted-foreground hover:bg-white/5 hover:text-white'
            }`}
          >
            <Bell className='w-4 h-4' /> Notifikasi
          </button>
          <button
            type='button'
            onClick={() => setActiveTab('privacy')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
              activeTab === 'privacy'
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-muted-foreground hover:bg-white/5 hover:text-white'
            }`}
          >
            <Lock className='w-4 h-4' /> Privasi
          </button>
        </div>

        <div className='flex-1'>
          {activeTab === 'notifications' && (
            <Card className='p-6 bg-[#0f1115] border-white/10 space-y-6'>
              <div>
                <h3 className='text-lg font-medium text-white mb-4'>Preferensi Notifikasi</h3>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <label className='text-base text-white font-medium'>
                        Email Notifikasi Pesanan
                      </label>
                      <p className='text-sm text-muted-foreground'>
                        Terima update status pesanan via email.
                      </p>
                    </div>
                    <input type='checkbox' className='w-5 h-5 accent-primary' defaultChecked />
                  </div>
                  <div className='flex items-center justify-between'>
                    <div>
                      <label className='text-base text-white font-medium'>Promo & Penawaran</label>
                      <p className='text-sm text-muted-foreground'>
                        Dapatkan info diskon eksklusif.
                      </p>
                    </div>
                    <input
                      type='checkbox'
                      className='w-5 h-5 accent-primary'
                      defaultChecked={false}
                    />
                  </div>
                  <div className='flex items-center justify-between'>
                    <div>
                      <label className='text-base text-white font-medium'>
                        Notifikasi Push / In-App
                      </label>
                      <p className='text-sm text-muted-foreground'>
                        Pemberitahuan real-time di Dashboard.
                      </p>
                    </div>
                    <input type='checkbox' className='w-5 h-5 accent-primary' defaultChecked />
                  </div>
                </div>
              </div>
              <div className='pt-4 border-t border-white/10'>
                <Button>Simpan Preferensi</Button>
              </div>
            </Card>
          )}

          {activeTab === 'privacy' && (
            <Card className='p-6 bg-[#0f1115] border-white/10 space-y-6'>
              <div>
                <h3 className='text-lg font-medium text-white mb-4'>Pengaturan Privasi</h3>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <label className='text-base text-white font-medium'>
                        Bagikan Data Penggunaan
                      </label>
                      <p className='text-sm text-muted-foreground'>
                        Bantu kami meningkatkan layanan dengan mengirimkan analitik anonim.
                      </p>
                    </div>
                    <input type='checkbox' className='w-5 h-5 accent-primary' defaultChecked />
                  </div>
                  <div className='flex items-center justify-between'>
                    <div>
                      <label className='text-base text-white font-medium'>Visibilitas Ulasan</label>
                      <p className='text-sm text-muted-foreground'>
                        Tampilkan nama Anda pada ulasan produk.
                      </p>
                    </div>
                    <input type='checkbox' className='w-5 h-5 accent-primary' defaultChecked />
                  </div>
                </div>
              </div>
              <div className='pt-4 border-t border-white/10'>
                <Button variant='destructive'>Minta Penghapusan Akun</Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
