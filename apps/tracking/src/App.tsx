import { ErrorBoundary } from 'react-error-boundary';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { ResponsiveGooeyToaster } from '@starsuperscare/ui';
import { TrackingLayout } from './components/layout/TrackingLayout.tsx';
import { TrackingPage } from './features/tracking/TrackingPage.tsx';
import { PackageSearch } from 'lucide-react';
import { useState } from 'react';

const Fallback = ({ error }: { error: Error }) => (
  <div role='alert' className='p-6 bg-red-50 text-red-900 rounded-lg max-w-xl mx-auto shadow-sm border border-red-100'>
    <h1 className='font-bold text-lg mb-2'>Kesalahan Aplikasi</h1>
    <pre className='text-sm bg-red-100 p-3 rounded mb-4 overflow-auto'>{error.message}</pre>
    <button
      type='button'
      onClick={() => globalThis.location.reload()}
      className='bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors font-medium'
    >
      Muat Ulang
    </button>
  </div>
);

const Home = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanToken = token
      .split(/[\n,]+/)
      .map(t => t.trim())
      .filter(Boolean)
      .join(',');
    
    if (cleanToken) {
      navigate(`/track/${cleanToken}`);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-[50vh] text-center px-4'>
      <div className='w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6 shadow-sm border border-blue-200'>
        <PackageSearch size={40} />
      </div>
      <h1 className='text-3xl font-bold text-gray-900 mb-4'>Lacak Paket Anda</h1>
      <p className='text-gray-500 mb-8 max-w-md mx-auto'>
        Masukkan nomor pelacakan Anda untuk melihat status pengiriman paket secara real-time. Anda dapat melacak hingga 10 resi sekaligus (pisahkan dengan koma).
      </p>

      <form onSubmit={handleSearch} className='w-full max-w-lg mx-auto flex flex-col gap-3'>
        <div className='flex flex-col gap-3'>
          <textarea
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder='Masukkan resi di sini...&#10;RESI123&#10;RESI456'
            className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-y'
            rows={4}
            required
          />
          <button
            type='submit'
            className='w-full px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all shadow-sm'
          >
            Lacak Paket
          </button>
        </div>
        <div className='text-left px-1 mt-1'>
          <span className='text-xs text-gray-400'>
            * Gunakan baris baru (Enter) atau tanda koma (,) untuk memisahkan resi. Maksimal 10 resi.
          </span>
        </div>
      </form>
    </div>
  );
};

const NotFound = () => (
  <div className='flex flex-col items-center justify-center min-h-[50vh] text-center px-4'>
    <h1 className='text-4xl font-bold text-gray-900 mb-4'>404</h1>
    <p className='text-xl text-gray-600 mb-8'>Halaman Tidak Ditemukan</p>
    <p className='text-gray-500 mb-8 max-w-md mx-auto'>
      Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
    </p>
    <a 
      href='/'
      className='px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors'
    >
      Kembali ke Beranda
    </a>
  </div>
);

export default function App() {
  return (
    <ErrorBoundary FallbackComponent={Fallback}>
      <ResponsiveGooeyToaster />
      <BrowserRouter>
        <TrackingLayout>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/track/:token' element={<TrackingPage />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </TrackingLayout>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
