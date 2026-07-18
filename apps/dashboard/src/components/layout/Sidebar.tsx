import { Link, useLocation } from 'react-router-dom';
import {
  Bell,
  CreditCard,
  Download,
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
import { client } from '../../lib/api.ts';
import useSWR from 'swr';

const NAV_SECTIONS = [
  {
    title: 'Utama',
    items: [
      { label: 'Dashboard', href: '/', icon: LayoutDashboard },
      { label: 'Notifikasi', href: '/notifications', icon: Bell },
    ],
  },
  {
    title: 'Pesanan & Riwayat',
    items: [
      { label: 'Pesanan Saya', href: '/orders', icon: Package },
      { label: 'Riwayat Pembelian', href: '/history', icon: History },
      { label: 'Download Digital', href: '/downloads', icon: Download },
      { label: 'Pengembalian', href: '/returns', icon: RefreshCcw },
      { label: 'Ulasan', href: '/reviews', icon: Star },
    ],
  },
  {
    title: 'Akun Saya',
    items: [
      { label: 'Profil Saya', href: '/profile', icon: User },
      { label: 'Keamanan', href: '/security', icon: Shield },
      { label: 'Alamat', href: '/addresses', icon: MapPin },
      { label: 'Metode Pembayaran', href: '/payments', icon: CreditCard },
      { label: 'Wishlist', href: '/wishlist', icon: Heart },
    ],
  },
  {
    title: 'Lainnya',
    items: [
      { label: 'Bantuan', href: '/support', icon: HelpCircle },
      { label: 'Pengaturan', href: '/settings', icon: Settings },
    ],
  },
];

export function Sidebar() {
  const { pathname } = useLocation();
  const { logout, session } = useSession();
  const { unreadCount } = useNotifications();

  const fetchProfile = async () => {
    const res = await client.v1.me.profile.$get();
    if (!res.ok) return null;
    const result = await res.json();
    return result.data;
  };

  const { data: profile } = useSWR(session ? '/api/v1/me/profile' : null, fetchProfile);

  return (
    <aside className='hidden w-64 flex-col border-r bg-white md:flex'>
      <div className='flex h-16 items-center border-b px-6'>
        <a
          href={(import.meta as any).env?.VITE_STOREFRONT_URL || ''}
          className='flex items-center gap-2'
        >
          <span className='text-lg font-bold text-blue-600'>StarSuperScare</span>
        </a>
      </div>

      <div className='flex-1 overflow-y-auto py-4'>
        <div className='px-6 mb-6'>
          <p className='text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1'>
            Halo,
          </p>
          <p className='font-bold text-foreground truncate'>
            {profile?.fullName || session?.user?.username || session?.user?.email || 'Guest'}
          </p>
        </div>

        <nav className='flex flex-col gap-6 px-4'>
          {NAV_SECTIONS.map((section, idx) => (
            <div key={idx}>
              <h4 className='text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2'>
                {section.title}
              </h4>
              <div className='flex flex-col gap-1'>
                {section.items.map((item) => {
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
                      <div className='relative flex items-center justify-center w-5 h-5'>
                        <Icon
                          className={`h-4 w-4 ${isActive ? 'text-blue-700' : 'text-gray-400'}`}
                        />
                        {item.label === 'Notifikasi' && (unreadCount ?? 0) > 0 && (
                          <span className='absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white border-2 border-white'>
                            {unreadCount! > 9 ? '9+' : unreadCount}
                          </span>
                        )}
                      </div>
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          <div className='mt-4 pt-4 border-t border-gray-100'>
            <button
              type='button'
              onClick={() => logout()}
              className='flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50'
            >
              <div className='flex items-center justify-center w-5 h-5'>
                <LogOut className='h-4 w-4 text-red-500' />
              </div>
              Keluar
            </button>
          </div>
        </nav>
      </div>
    </aside>
  );
}
