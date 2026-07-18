import { ErrorBoundary } from 'react-error-boundary';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { ResponsiveGooeyToaster } from '@starsuperscare/ui';
import { SEO } from '@starsuperscare/ui';
import { TrackingLayout } from './components/layout/TrackingLayout.tsx';
import { TrackingPage } from './features/tracking/TrackingPage.tsx';
import { PackageSearch } from 'lucide-react';
import { useState } from 'react';

const Fallback = ({ error }: { error: Error }) => (
  <div
    role='alert'
    className='p-6 bg-red-50 text-red-900 rounded-lg max-w-xl mx-auto shadow-sm border border-red-100'
  >
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
      .map((t) => t.trim())
      .filter(Boolean)
      .join(',');

    if (cleanToken) {
      navigate(`/track/${cleanToken}`);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-[50vh] py-12 md:py-16 text-center px-4 animate-in fade-in duration-500'>
      <div className='w-14 h-14 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-indigo-500/20'>
        <PackageSearch size={28} />
      </div>
      <h1 className='text-3xl font-black text-foreground mb-4 tracking-tight'>Lacak Paket Anda</h1>
      <p className='text-muted-foreground font-medium mb-8 max-w-md mx-auto'>
        Masukkan nomor pelacakan Anda untuk melihat status pengiriman paket secara real-time. Anda
        dapat melacak hingga 10 resi sekaligus (pisahkan dengan koma).
      </p>

      <form onSubmit={handleSearch} className='w-full max-w-lg mx-auto flex flex-col gap-4'>
        <div className='flex flex-col gap-4'>
          <textarea
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder='Masukkan resi di sini...&#10;RESI123&#10;RESI456'
            className='w-full px-5 py-4 rounded-2xl bg-card border border-border/60 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-y shadow-sm font-medium text-foreground'
            rows={4}
            required
          />
          <button
            type='submit'
            className='w-full px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-500 focus:ring-4 focus:ring-indigo-500/30 transition-all shadow-md active:scale-[0.98]'
          >
            Lacak Paket
          </button>
        </div>
        <div className='text-left px-2 mt-1'>
          <span className='text-xs text-muted-foreground font-medium opacity-80'>
            * Gunakan baris baru (Enter) atau tanda koma (,) untuk memisahkan resi. Maksimal 10
            resi.
          </span>
        </div>
      </form>
    </div>
  );
};

const NotFound = () => (
  <div className='flex flex-col items-center justify-center min-h-[50vh] text-center px-4 animate-in fade-in duration-500'>
    <h1 className='text-5xl font-black text-foreground mb-4 tracking-tighter'>404</h1>
    <p className='text-xl text-muted-foreground font-bold mb-6'>Halaman Tidak Ditemukan</p>
    <p className='text-muted-foreground mb-8 max-w-md mx-auto font-medium'>
      Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
    </p>
    <a
      href='/'
      className='px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-500 transition-colors shadow-sm'
    >
      Kembali ke Beranda
    </a>
  </div>
);

export default function App() {
  return (
    <ErrorBoundary FallbackComponent={Fallback}>
      <ResponsiveGooeyToaster />
      <SEO appId='tracking' />
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
