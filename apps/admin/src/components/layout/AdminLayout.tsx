import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Banknote,
  CreditCard,
  FileText,
  LayoutDashboard,
  LifeBuoy,
  Package,
  ShoppingCart,
  Undo2,
  Users,
  Warehouse,
} from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext.tsx';
import { Button } from '@starsuperscare/ui';

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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      <aside
        style={{
          width: '250px',
          background: '#1a1a1a',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ padding: '1.5rem', fontWeight: 'bold', fontSize: '1.25rem' }}>
          StarSuperScare
          <div style={{ fontSize: '0.875rem', color: '#888', fontWeight: 'normal' }}>
            Admin Portal
          </div>
        </div>

        <nav
          style={{
            flex: 1,
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              style={({ isActive }) => ({
                color: isActive ? '#fff' : '#aaa',
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                background: isActive ? '#333' : 'transparent',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              })}
            >
              <item.icon size={18} />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '1rem', borderTop: '1px solid #333' }}>
          <div style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>
            Logged in as <strong>{user?.username}</strong>
          </div>
          <Button
            onClick={handleLogout}
            style={{ width: '100%', borderColor: '#555', color: '#fff' }}
          >
            Logout
          </Button>
        </div>
      </aside>

      <main style={{ flex: 1, background: '#f5f5f5', overflowY: 'auto' }}>
        <header
          style={{
            background: 'white',
            padding: '1rem 2rem',
            borderBottom: '1px solid #ddd',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          {/* Header content like search or user profile can go here */}
          <span>StarSuperScare Administration</span>
        </header>

        <div style={{ padding: '2rem' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
