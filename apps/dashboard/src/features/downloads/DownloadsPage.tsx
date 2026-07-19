import { useState } from 'react';
import useSWR from 'swr';
import { client } from '../../lib/api.ts';
import { Badge, Button, Card } from '@starsuperscare/ui';
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  Download,
  Key,
  Loader2,
  PackageOpen,
} from 'lucide-react';
import { goeyToast as toast } from 'goey-toast';

const fetchDownloads = async (_url: string, page: number) => {
  const res = await client.v1.downloads.$get({ query: { page: String(page), limit: '10' } });
  if (res.ok) {
    const json = await res.json();
    return json.data;
  }
  throw new Error('Failed to fetch downloads');
};

export const DownloadsPage = () => {
  const [page, setPage] = useState(1);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const { data, error, isLoading, mutate } = useSWR(
    ['/api/downloads', page],
    ([url, p]) => fetchDownloads(url, p as number),
  );

  const handleDownload = async (id: string, name: string) => {
    setDownloadingId(id);
    try {
      const res = await client.v1.downloads[':id'].stream.$get({ param: { id } });
      if (!res.ok) {
        throw new Error('Gagal mengunduh file atau limit tercapai');
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      // Get filename from Content-Disposition if available, or fallback
      const contentDisposition = res.headers.get('Content-Disposition');
      let filename = `${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.zip`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) filename = match[1];
      }
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('File berhasil diunduh');
      mutate(); // Refresh data to update download counts
    } catch (err: any) {
      toast.error(err.message || 'Terjadi kesalahan saat mengunduh');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Unduhan Digital</h2>
          <p className='text-muted-foreground text-sm mt-1'>
            Akses produk digital yang telah Anda beli.
          </p>
        </div>
      </div>

      {/* Digital Credentials Section */}
      {data?.credentials && data.credentials.length > 0 && (
        <div className='mb-10'>
          <h3 className='text-xl font-extrabold mb-5 flex items-center gap-2.5 text-foreground dark:text-white'>
            <div className='p-2 bg-indigo-500/10 rounded-lg'>
              <Key className='w-5 h-5 text-indigo-400' />
            </div>
            Kredensial & Akun
          </h3>
          <div className='grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
            {data.credentials.map((cred: any) => (
              <Card
                key={cred.id}
                className='bg-card dark:bg-gradient-to-b dark:from-[#13161c] dark:to-[#0f1115] border-border/60 dark:border-white/5 hover:border-border dark:hover:border-white/15 transition-all overflow-hidden flex flex-col justify-between shadow-sm dark:shadow-xl dark:shadow-black/40'
              >
                <div className='p-5 border-b border-border/40 dark:border-white/5 relative overflow-hidden'>
                  <div className='absolute top-0 right-0 w-32 h-32 bg-indigo-50 dark:bg-indigo-500/10 rounded-bl-full -mr-8 -mt-8 blur-2xl pointer-events-none'>
                  </div>
                  <h4
                    className='font-bold text-foreground dark:text-white text-[17px] leading-tight tracking-wide line-clamp-2 relative z-10'
                    title={cred.productName}
                  >
                    {cred.productName || 'Produk Digital'}
                  </h4>
                  {cred.variantName && cred.variantName !== 'Default' && (
                    <Badge
                      variant='outline'
                      className='mt-3 bg-indigo-50 dark:bg-card/5 border-indigo-100 dark:border-white/10 text-indigo-700 dark:text-indigo-300 font-medium px-2.5 py-0.5 rounded-full text-xs'
                    >
                      {cred.variantName}
                    </Badge>
                  )}
                </div>
                <div className='p-5 bg-muted/50 dark:bg-card/[0.01] flex-1 flex flex-col justify-end'>
                  <div className='bg-gray-900 dark:bg-[#050608] border border-gray-800 dark:border-white/5 rounded-xl p-4 font-mono text-[13px] leading-relaxed text-emerald-400 whitespace-pre-wrap break-all relative group shadow-inner'>
                    {cred.credentialData}
                    <button
                      type='button'
                      onClick={() => {
                        navigator.clipboard.writeText(cred.credentialData);
                        toast.success('Disalin ke clipboard');
                      }}
                      className='absolute top-2.5 right-2.5 p-2 bg-card/10 hover:bg-card/20 text-muted-foreground/50 hover:text-white rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-md'
                      title='Salin Teks'
                    >
                      <Copy className='w-4 h-4' />
                    </button>
                  </div>
                  <div className='mt-5 flex items-center justify-between text-[11px] text-muted-foreground dark:text-muted-foreground uppercase tracking-widest font-bold'>
                    <span>Tgl. Pembelian</span>
                    <span className='text-foreground dark:text-muted-foreground/50'>
                      {new Date(cred.createdAt).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Downloadable Files Section */}
      <div>
        <h3 className='text-xl font-extrabold mb-5 flex items-center gap-2.5 text-foreground dark:text-white'>
          <div className='p-2 bg-sky-500/10 rounded-lg'>
            <Download className='w-5 h-5 text-sky-400' />
          </div>
          File Unduhan
        </h3>
        {isLoading
          ? (
            <div className='grid gap-4'>
              {[1, 2, 3].map((i) => (
                <Card key={i} className='animate-pulse bg-card/5 border-white/10 h-24' />
              ))}
            </div>
          )
          : error
          ? (
            <div className='text-center py-10 bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg border border-red-500/20'>
              <p>Gagal memuat unduhan. Silakan coba lagi.</p>
            </div>
          )
          : data?.entitlements?.length === 0
          ? (
            <div className='text-center py-20 bg-muted/50 dark:bg-card/5 rounded-xl border border-border/60 dark:border-white/10'>
              <PackageOpen className='w-12 h-12 mx-auto text-muted-foreground/80 dark:text-muted-foreground mb-4 dark:opacity-50' />
              <h3 className='text-lg font-medium text-foreground dark:text-white mb-2'>
                Belum Ada Unduhan
              </h3>
              <p className='text-muted-foreground text-sm mb-6'>
                Anda belum membeli produk digital apapun.
              </p>
            </div>
          )
          : (
            <div className='grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
              {data?.entitlements.map((item: any) => {
                const isExpired = item.expiresAt && new Date(item.expiresAt) < new Date();
                const isLimitReached = item.downloadLimit !== null &&
                  item.downloadCount >= item.downloadLimit;
                const canDownload = item.status === 'active' && !isExpired && !isLimitReached;

                return (
                  <Card
                    key={item.id}
                    className={`bg-card dark:bg-gradient-to-b dark:from-[#13161c] dark:to-[#0f1115] border-border/60 dark:border-white/5 hover:border-border dark:hover:border-white/15 transition-all overflow-hidden flex flex-col justify-between shadow-sm dark:shadow-xl dark:shadow-black/40 ${
                      !canDownload ? 'opacity-60 grayscale-[30%]' : ''
                    }`}
                  >
                    <div className='p-5 border-b border-border/40 dark:border-white/5 relative overflow-hidden'>
                      <div className='absolute top-0 right-0 w-32 h-32 bg-sky-50 dark:bg-sky-500/10 rounded-bl-full -mr-8 -mt-8 blur-2xl pointer-events-none'>
                      </div>
                      <div className='flex items-start justify-between gap-2 relative z-10'>
                        <div>
                          <h3
                            className='font-bold text-foreground dark:text-white text-[17px] leading-tight tracking-wide line-clamp-2'
                            title={item.productName}
                          >
                            {item.productName || 'Produk Digital'}
                          </h3>
                          {item.variantName && item.variantName !== 'Default' && (
                            <Badge
                              variant='outline'
                              className='mt-3 bg-sky-50 dark:bg-card/5 border-sky-100 dark:border-white/10 text-sky-700 dark:text-sky-300 font-medium px-2.5 py-0.5 rounded-full text-xs'
                            >
                              {item.variantName}
                            </Badge>
                          )}
                          {item.version && (
                            <Badge
                              variant='outline'
                              className='mt-3 ml-2 bg-sky-50 dark:bg-sky-500/10 border-sky-200 dark:border-sky-500/20 text-sky-600 dark:text-sky-400 font-medium px-2 py-0.5 rounded-full text-xs'
                            >
                              v{item.version}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className='p-5 bg-muted/50 dark:bg-card/[0.01] space-y-4 flex-1 flex flex-col justify-end'>
                      <div className='flex items-center justify-between text-xs text-muted-foreground'>
                        <div className='flex items-center gap-1.5'>
                          <Download className='w-3.5 h-3.5' />
                          <span>
                            {item.downloadCount}{' '}
                            {item.downloadLimit ? `/ ${item.downloadLimit}` : ''} diunduh
                          </span>
                        </div>
                        {item.expiresAt && (
                          <div
                            className='flex items-center gap-1.5'
                            title={`Berakhir pada ${
                              new Date(item.expiresAt).toLocaleString('id-ID')
                            }`}
                          >
                            <Clock className='w-3.5 h-3.5' />
                            <span>
                              {isExpired
                                ? 'Kedaluwarsa'
                                : new Date(item.expiresAt).toLocaleDateString('id-ID')}
                            </span>
                          </div>
                        )}
                      </div>

                      {!canDownload && (
                        <div className='flex items-center gap-2 text-xs text-amber-500 bg-amber-500/10 p-2 rounded border border-amber-500/20'>
                          <AlertTriangle className='w-4 h-4 shrink-0' />
                          <span>
                            {isExpired
                              ? 'Akses telah kedaluwarsa'
                              : isLimitReached
                              ? 'Limit unduhan tercapai'
                              : 'Akses dicabut'}
                          </span>
                        </div>
                      )}

                      <Button
                        variant={canDownload ? 'default' : 'outline'}
                        disabled={!canDownload || downloadingId === item.id}
                        onClick={() => handleDownload(item.id, item.productName || 'download')}
                        className={`w-full ${!canDownload ? 'opacity-50' : ''}`}
                      >
                        {downloadingId === item.id
                          ? <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                          : <Download className='w-4 h-4 mr-2' />}
                        {canDownload ? 'Unduh File' : 'Tidak Tersedia'}
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

        {/* Pagination */}
        {(data?.pagination?.totalPages ?? 0) > 1 && (
          <div className='flex justify-center items-center gap-4 mt-8'>
            <Button
              variant='outline'
              size='icon'
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className='border-border/60 dark:border-white/20 hover:bg-muted/50 dark:hover:bg-card/10'
            >
              <ChevronLeft className='w-4 h-4' />
            </Button>
            <span className='text-sm text-muted-foreground'>
              Halaman <span className='text-foreground font-medium'>{page}</span> dari{' '}
              {data?.pagination?.totalPages}
            </span>
            <Button
              variant='outline'
              size='icon'
              disabled={page === data?.pagination?.totalPages}
              onClick={() => setPage((p) => Math.min(data?.pagination?.totalPages || 1, p + 1))}
              className='border-border/60 dark:border-white/20 hover:bg-muted/50 dark:hover:bg-card/10'
            >
              <ChevronRight className='w-4 h-4' />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
