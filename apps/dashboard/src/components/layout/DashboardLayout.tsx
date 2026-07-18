import React from 'react';
import { Sidebar } from './Sidebar.tsx';
import { MobileNav } from './MobileNav.tsx';
import { ProtectedRoute } from '../../features/auth/ProtectedRoute.tsx';
import { useSession } from '../../features/auth/useSession.ts';
import { useNotifications } from '../../features/notifications/useNotifications.ts';
import { Bell, Search, User } from 'lucide-react';

const Topbar = () => {
  const { session } = useSession();
  const { unreadCount } = useNotifications();
  const storefrontUrl = (import.meta as any).env?.VITE_STOREFRONT_URL;

  return (
    <header className='h-16 border-b border-border/60 bg-card flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10'>
      <div className='flex items-center gap-4 flex-1'>
        {/* Mobile Logo */}
        <a
          href={storefrontUrl}
          className='md:hidden font-black text-xl text-indigo-600 dark:text-indigo-400 tracking-tight'
        >
          StarSuperScare
        </a>

        {/* Context or Search could go here */}
        <div className='hidden md:flex relative w-full max-w-md'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <input
            type='text'
            placeholder='Cari di dashboard...'
            className='w-full pl-10 pr-4 py-2 border border-border/60 bg-muted/30 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-foreground'
          />
        </div>
      </div>

      <div className='flex items-center gap-4'>
        <a
          href={storefrontUrl}
          className='hidden md:block text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 mr-2 transition-colors'
        >
          Kembali Belanja
        </a>
        <button
          type='button'
          className='relative p-2 text-muted-foreground hover:bg-muted/50 rounded-full transition-colors'
        >
          <Bell className='h-5 w-5' />
          {(unreadCount ?? 0) > 0 && (
            <span className='absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-red-500'>
            </span>
          )}
        </button>
        <button
          type='button'
          className='flex items-center gap-2 p-1.5 hover:bg-muted/50 rounded-full transition-colors'
        >
          <div className='h-8 w-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-500/20'>
            {session?.user?.username?.charAt(0).toUpperCase() || <User className='h-4 w-4' />}
          </div>
        </button>
      </div>
    </header>
  );
};

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className='flex h-screen bg-background overflow-hidden font-sans text-foreground'>
        <Sidebar />
        <div className='flex-1 flex flex-col overflow-hidden'>
          <Topbar />
          <main className='flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8'>
            <div className='mx-auto max-w-7xl w-full'>
              {children}
            </div>
          </main>
        </div>
        <MobileNav />
      </div>
    </ProtectedRoute>
  );
}
