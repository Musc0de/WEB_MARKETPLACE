import { Link, useLocation } from 'react-router-dom';
import { Bell, Home, Package, ShoppingCart, User } from 'lucide-react';
import { useNotifications } from '../../features/notifications/useNotifications.ts';

export function MobileNav() {
  const { pathname } = useLocation();
  const { unreadCount } = useNotifications();
  const storefrontUrl = (import.meta as any).env?.VITE_STOREFRONT_URL || '';

  return (
    <nav className='fixed bottom-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-t border-border/60 bg-background/70 backdrop-blur-xl px-6 pb-safe shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] md:hidden'>
      <Link
        to='/'
        className={`flex flex-col items-center gap-1 transition-colors ${
          pathname === '/'
            ? 'text-indigo-600 dark:text-indigo-400 font-bold'
            : 'text-muted-foreground hover:text-foreground font-medium'
        }`}
      >
        <Home className='h-5 w-5' />
        <span className='text-[10px]'>Home</span>
      </Link>

      <Link
        to='/orders'
        className={`flex flex-col items-center gap-1 transition-colors ${
          pathname === '/orders'
            ? 'text-indigo-600 dark:text-indigo-400 font-bold'
            : 'text-muted-foreground hover:text-foreground font-medium'
        }`}
      >
        <Package className='h-5 w-5' />
        <span className='text-[10px]'>Orders</span>
      </Link>

      <a
        href={`${storefrontUrl}/cart`}
        className='flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground font-medium transition-colors'
      >
        <ShoppingCart className='h-5 w-5' />
        <span className='text-[10px]'>Cart</span>
      </a>

      <Link
        to='/notifications'
        className={`flex flex-col items-center gap-1 transition-colors ${
          pathname === '/notifications'
            ? 'text-indigo-600 dark:text-indigo-400 font-bold'
            : 'text-muted-foreground hover:text-foreground font-medium'
        }`}
      >
        <div className='relative'>
          <Bell className='h-5 w-5' />
          {(unreadCount ?? 0) > 0 && (
            <span className='absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-destructive text-[8px] font-bold text-destructive-foreground border border-background'>
              {unreadCount! > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>
        <span className='text-[10px]'>Notif</span>
      </Link>

      <Link
        to='/profile'
        className={`flex flex-col items-center gap-1 transition-colors ${
          pathname === '/profile'
            ? 'text-indigo-600 dark:text-indigo-400 font-bold'
            : 'text-muted-foreground hover:text-foreground font-medium'
        }`}
      >
        <User className='h-5 w-5' />
        <span className='text-[10px]'>Account</span>
      </Link>
    </nav>
  );
}
