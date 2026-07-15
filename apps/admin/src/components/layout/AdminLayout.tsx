import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Banknote,
  Bell,
  CreditCard,
  FileText,
  LayoutDashboard,
  LifeBuoy,
  Menu,
  Package,
  ShoppingCart,
  Undo2,
  Users,
  Warehouse,
  X,
} from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext.tsx';
import { useState } from 'react';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Orders', href: '/orders', icon: ShoppingCart },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Products', href: '/catalog', icon: Package },
  { name: 'Inventory', href: '/inventory', icon: Warehouse },
  { name: 'Returns', href: '/returns', icon: Undo2 },
  { name: 'Refunds', href: '/refunds', icon: Banknote },
  { name: 'Payments', href: '/payments', icon: CreditCard },
  { name: 'Invoices', href: '/invoices', icon: FileText },
  { name: 'Support', href: '/support', icon: LifeBuoy },
];

export function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };


  return (
    <div className='flex min-h-screen bg-gray-50 font-sans text-gray-900'>
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className='fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden'
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform duration-200 ease-in-out lg:sticky lg:top-0 lg:h-screen flex flex-col ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className='flex items-center justify-between h-16 px-6 bg-gray-950'>
          <div>
            <span className='font-bold text-lg tracking-tight text-white'>StarSuperScare</span>
            <span className='block text-xs text-gray-400'>Admin Portal</span>
          </div>
          <button
            type='button'
            className='lg:hidden text-gray-400 hover:text-white'
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className='flex-1 overflow-y-auto py-4 px-3 space-y-1'>
          {navItems.map((item) => {
            const isActive = item.href === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.href);
            return (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <item.icon size={18} className={isActive ? 'text-white' : 'text-gray-400'} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        <div className='p-4 bg-gray-950 border-t border-gray-800'>
          <div className='mb-3 text-sm'>
            <span className='text-gray-400'>Login sebagai</span>
            <div className='font-medium truncate'>{user?.username || 'Admin'}</div>
          </div>
          <button
            type='button'
            onClick={handleLogout}
            className='w-full px-4 py-2 text-sm font-medium text-red-400 bg-gray-900 border border-gray-700 rounded-md hover:bg-gray-800 hover:text-red-300 transition-colors'
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className='flex-1 flex flex-col min-w-0 overflow-hidden'>
        {/* Topbar */}
        <header className='h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-200 z-30'>
          <div className='flex items-center flex-1'>
            <button
              type='button'
              className='lg:hidden p-2 -ml-2 mr-4 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500'
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>

          <div className='flex items-center gap-4 ml-4'>
            <span className='hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
              Production
            </span>
            <button type='button' className='p-2 text-gray-400 hover:text-gray-500 relative'>
              <Bell size={20} />
              <span className='absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white' />
            </button>
          </div>
        </header>

        {/* Page Content Container */}
        <main className='flex-1 relative overflow-y-auto focus:outline-none bg-gray-50'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
