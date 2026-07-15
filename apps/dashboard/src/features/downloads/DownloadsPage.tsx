import { useState } from 'react';
import useSWR from 'swr';
import { client } from '../../lib/api.ts';
import { Badge, Button, Card } from '@starsuperscare/ui';
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
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

      {isLoading
        ? (
          <div className='grid gap-4'>
            {[1, 2, 3].map((i) => (
              <Card key={i} className='animate-pulse bg-white/5 border-white/10 h-24' />
            ))}
          </div>
        )
        : error
        ? (
          <div className='text-center py-10 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20'>
            <p>Gagal memuat unduhan. Silakan coba lagi.</p>
          </div>
        )
        : data?.entitlements?.length === 0
        ? (
          <div className='text-center py-20 bg-white/5 rounded-xl border border-white/10'>
            <PackageOpen className='w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50' />
            <h3 className='text-lg font-medium text-white mb-2'>Belum Ada Unduhan</h3>
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
                  className={`bg-[#0f1115] border-white/10 hover:border-white/20 transition-all overflow-hidden flex flex-col justify-between ${
                    !canDownload ? 'opacity-70' : ''
                  }`}
                >
                  <div className='p-4 border-b border-white/5'>
                    <div className='flex items-start justify-between gap-2'>
                      <div>
                        <h3
                          className='font-semibold text-white line-clamp-2'
                          title={item.productName}
                        >
                          {item.productName || 'Produk Digital'}
                        </h3>
                        {item.variantName && item.variantName !== 'Default' && (
                          <p className='text-xs text-muted-foreground mt-1'>
                            Variant: {item.variantName}
                          </p>
                        )}
                        {item.version && (
                          <Badge variant='outline' className='mt-2 bg-white/5 border-white/10'>
                            v{item.version}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className='p-4 bg-white/[0.02] space-y-3 flex-1 flex flex-col justify-end'>
                    <div className='flex items-center justify-between text-xs text-muted-foreground'>
                      <div className='flex items-center gap-1.5'>
                        <Download className='w-3.5 h-3.5' />
                        <span>
                          {item.downloadCount} {item.downloadLimit ? `/ ${item.downloadLimit}` : ''}
                          {' '}
                          diunduh
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
            className='border-white/20 hover:bg-white/10'
          >
            <ChevronLeft className='w-4 h-4' />
          </Button>
          <span className='text-sm text-muted-foreground'>
            Halaman <span className='text-white font-medium'>{page}</span> dari{' '}
            {data?.pagination?.totalPages}
          </span>
          <Button
            variant='outline'
            size='icon'
            disabled={page === data?.pagination?.totalPages}
            onClick={() => setPage((p) => Math.min(data?.pagination?.totalPages || 1, p + 1))}
            className='border-white/20 hover:bg-white/10'
          >
            <ChevronRight className='w-4 h-4' />
          </Button>
        </div>
      )}
    </div>
  );
};
