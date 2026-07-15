import { Link, useLocation } from 'react-router-dom';
import { Bell, Home, Package, ShoppingCart, User } from 'lucide-react';
import { useNotifications } from '../../features/notifications/useNotifications.ts';

export function MobileNav() {
  const { pathname } = useLocation();
  const { unreadCount } = useNotifications();

  return (
    <nav className='fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-t bg-white px-6 pb-safe md:hidden shadow-[0_-2px_10px_rgba(0,0,0,0.05)]'>
      <Link
        to='/'
        className={`flex flex-col items-center gap-1 ${
          pathname === '/' ? 'text-blue-600' : 'text-gray-500'
        }`}
      >
        <Home className='h-6 w-6' />
        <span className='text-[10px] font-medium'>Home</span>
      </Link>

      <Link
        to='/orders'
        className={`flex flex-col items-center gap-1 ${
          pathname === '/orders' ? 'text-blue-600' : 'text-gray-500'
        }`}
      >
        <Package className='h-6 w-6' />
        <span className='text-[10px] font-medium'>Orders</span>
      </Link>

      <a
        href='http://shop.starsuperscare.net:5173/cart'
        className='flex flex-col items-center gap-1 text-gray-500 hover:text-blue-600'
      >
        <ShoppingCart className='h-6 w-6' />
        <span className='text-[10px] font-medium'>Cart</span>
      </a>

      <Link
        to='/notifications'
        className={`flex flex-col items-center gap-1 ${
          pathname === '/notifications' ? 'text-blue-600' : 'text-gray-500'
        }`}
      >
        <div className='relative'>
          <Bell className='h-6 w-6' />
          {(unreadCount ?? 0) > 0 && (
            <span className='absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white border border-white'>
              {unreadCount! > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>
        <span className='text-[10px] font-medium'>Notif</span>
      </Link>

      <Link
        to='/profile'
        className={`flex flex-col items-center gap-1 ${
          pathname === '/profile' ? 'text-blue-600' : 'text-gray-500'
        }`}
      >
        <User className='h-6 w-6' />
        <span className='text-[10px] font-medium'>Account</span>
      </Link>
    </nav>
  );
}
