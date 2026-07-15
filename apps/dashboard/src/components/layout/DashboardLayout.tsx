import React from 'react';
import { Sidebar } from './Sidebar.tsx';
import { MobileNav } from './MobileNav.tsx';
import { ProtectedRoute } from '../../features/auth/ProtectedRoute.tsx';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className='flex h-screen bg-gray-50 overflow-hidden'>
        <Sidebar />
        <div className='flex-1 flex flex-col overflow-hidden'>
          <main className='flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8'>
            {children}
          </main>
        </div>
        <MobileNav />
      </div>
    </ProtectedRoute>
  );
}
