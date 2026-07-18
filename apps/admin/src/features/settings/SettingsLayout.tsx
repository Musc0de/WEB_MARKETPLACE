import { Outlet } from 'react-router-dom';

export function SettingsLayout() {
  return (
    <div className='max-w-5xl mx-auto py-2'>
      <div className='flex-1 min-w-0'>
        <Outlet />
      </div>
    </div>
  );
}
