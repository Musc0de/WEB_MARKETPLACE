import { NavLink, Outlet } from 'react-router-dom';
import { PageHeader } from '../../components/admin-ui.tsx';
import { CreditCard, Globe } from 'lucide-react';

const tabs = [
  { name: 'General & SEO', href: '/settings/general', icon: Globe },
  { name: 'Payment Gateways', href: '/settings/payment-gateways', icon: CreditCard },
];

export function SettingsLayout() {
  return (
    <div className='max-w-5xl mx-auto py-6 space-y-6'>
      <PageHeader
        icon={Globe}
        title='Pengaturan Sistem'
        description='Kelola konfigurasi dasar dan integrasi sistem.'
      />

      <div className='flex flex-col md:flex-row gap-6'>
        {/* Sub-parent Navigation */}
        <div className='w-full md:w-64 flex-shrink-0'>
          <nav className='flex space-x-2 md:flex-col md:space-x-0 md:space-y-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0'>
            {tabs.map((tab) => (
              <NavLink
                key={tab.name}
                to={tab.href}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-gray-900/5'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
              >
                <tab.icon className='w-5 h-5 flex-shrink-0' />
                {tab.name}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className='flex-1 min-w-0'>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
