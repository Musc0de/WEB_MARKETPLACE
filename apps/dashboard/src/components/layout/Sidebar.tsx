import { Link, useLocation } from 'react-router-dom';
import {
  Bell,
  CreditCard,
  Download,
  FileText,
  Heart,
  HelpCircle,
  History,
  LayoutDashboard,
  LogOut,
  MapPin,
  Package,
  RefreshCcw,
  Settings,
  Shield,
  Star,
  User,
} from 'lucide-react';
import { useSession } from '../../features/auth/useSession.ts';
import { useNotifications } from '../../features/notifications/useNotifications.ts';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Profil Saya', href: '/profile', icon: User },
  { label: 'Keamanan', href: '/security', icon: Shield },
  { label: 'Pesanan Saya', href: '/orders', icon: Package },
  { label: 'Riwayat Pembelian', href: '/history', icon: History },
  { label: 'Invoice', href: '/invoices', icon: FileText },
  { label: 'Download Digital', href: '/downloads', icon: Download },
  { label: 'Wishlist', href: '/wishlist', icon: Heart },
  { label: 'Alamat', href: '/addresses', icon: MapPin },
  { label: 'Metode Pembayaran', href: '/payments', icon: CreditCard },
  { label: 'Pengembalian', href: '/returns', icon: RefreshCcw },
  { label: 'Ulasan', href: '/reviews', icon: Star },
  { label: 'Notifikasi', href: '/notifications', icon: Bell },
  { label: 'Bantuan', href: '/support', icon: HelpCircle },
  { label: 'Pengaturan', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const { pathname } = useLocation();
  const { logout, session } = useSession();
  const { unreadCount } = useNotifications();

  return (
    <aside className='hidden w-64 flex-col border-r bg-white md:flex'>
      <div className='flex h-16 items-center border-b px-6'>
        <a href='http://shop.starsuperscare.net:5173' className='flex items-center gap-2'>
          <span className='text-lg font-bold'>StarSuperScare</span>
        </a>
      </div>

      <div className='flex-1 overflow-y-auto py-4'>
        <div className='px-4 mb-4'>
          <p className='text-sm text-gray-500'>Selamat datang,</p>
          <p className='font-medium truncate'>{session?.user?.username || session?.user?.email}</p>
        </div>

        <nav className='flex flex-col gap-1 px-2'>
          {NAV_ITEMS.map((item) => {
            const isOrders = item.href === '/orders' ? pathname.startsWith('/orders') : false;
            const isActive = isOrders || pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <div className='relative'>
                  <Icon className={`h-5 w-5 ${isActive ? 'text-blue-700' : 'text-gray-400'}`} />
                  {item.label === 'Notifikasi' && (unreadCount ?? 0) > 0 && (
                    <span className='absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white'>
                      {unreadCount! > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </div>
                {item.label}
              </Link>
            );
          })}

          <button
            type='button'
            onClick={() => logout()}
            className='flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 mt-4'
          >
            <LogOut className='h-5 w-5 text-red-500' />
            Keluar
          </button>
        </nav>
      </div>
    </aside>
  );
}
