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
  const storefrontUrl = (import.meta as any).env?.VITE_STOREFRONT_URL || 'http://localhost:5173';

  return (
    <header className='h-16 border-b bg-white flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10'>
      <div className='flex items-center gap-4 flex-1'>
        {/* Context or Search could go here */}
        <div className='hidden md:flex relative w-full max-w-md'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
          <input
            type='text'
            placeholder='Cari di dashboard...'
            className='w-full pl-10 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>
      </div>

      <div className='flex items-center gap-4'>
        <a
          href={storefrontUrl}
          className='hidden md:block text-sm font-medium text-blue-600 hover:text-blue-700 mr-2'
        >
          Kembali Belanja
        </a>
        <button
          type='button'
          className='relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors'
        >
          <Bell className='h-5 w-5' />
          {(unreadCount ?? 0) > 0 && (
            <span className='absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-red-500'>
            </span>
          )}
        </button>
        <button
          type='button'
          className='flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-full transition-colors'
        >
          <div className='h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold'>
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
      <div className='flex h-screen bg-gray-50 overflow-hidden font-sans text-gray-900'>
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
