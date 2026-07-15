import { useState } from 'react';
import useSWR from 'swr';
import { client } from '../../lib/api.ts';
import { Badge, Button, Card } from '@starsuperscare/ui';
import { ChevronLeft, ChevronRight, Download, FileText, Loader2 } from 'lucide-react';
import { goeyToast as toast } from 'goey-toast';

const fetchInvoices = async (_url: string, page: number) => {
  const res = await client.v1.invoices.$get({ query: { page: String(page), limit: '10' } });
  if (res.ok) {
    const json = await res.json();
    return json.data;
  }
  throw new Error('Failed to fetch invoices');
};

export const InvoicesPage = () => {
  const [page, setPage] = useState(1);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const { data, error, isLoading } = useSWR(
    ['/api/invoices', page],
    ([url, p]) => fetchInvoices(url, p as number),
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unpaid':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'paid':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'void':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      unpaid: 'Belum Dibayar',
      paid: 'Lunas',
      void: 'Dibatalkan',
    };
    return labels[status] || status;
  };

  const handleDownload = async (id: string, invoiceNumber: string) => {
    setDownloadingId(id);
    try {
      const res = await client.v1.invoices[':id'].download.$get({ param: { id } });
      if (!res.ok) {
        throw new Error('Gagal mengunduh invoice');
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `Invoice_${invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Invoice berhasil diunduh');
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
          <h2 className='text-2xl font-bold tracking-tight'>Pusat Tagihan</h2>
          <p className='text-muted-foreground text-sm mt-1'>
            Kelola dan unduh faktur (invoice) transaksi Anda.
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
            <p>Gagal memuat invoice. Silakan coba lagi.</p>
          </div>
        )
        : data?.invoices?.length === 0
        ? (
          <div className='text-center py-20 bg-white/5 rounded-xl border border-white/10'>
            <FileText className='w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50' />
            <h3 className='text-lg font-medium text-white mb-2'>Belum Ada Invoice</h3>
            <p className='text-muted-foreground text-sm mb-6'>
              Anda belum memiliki riwayat invoice.
            </p>
          </div>
        )
        : (
          <div className='grid gap-4'>
            {data?.invoices.map((invoice: any) => (
              <Card
                key={invoice.id}
                className='bg-[#0f1115] border-white/10 hover:border-white/20 transition-all overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-4'
              >
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0'>
                    <FileText className='w-5 h-5 text-blue-500' />
                  </div>
                  <div>
                    <div className='flex items-center gap-2 mb-1'>
                      <span className='font-medium text-white'>{invoice.invoiceNumber}</span>
                      <Badge variant='outline' className={getStatusColor(invoice.status)}>
                        {getStatusLabel(invoice.status)}
                      </Badge>
                    </div>
                    <p className='text-sm text-muted-foreground'>
                      Diterbitkan: {new Date(invoice.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <Button
                  variant='outline'
                  disabled={downloadingId === invoice.id || !invoice.pdfObjectKey}
                  onClick={() => handleDownload(invoice.id, invoice.invoiceNumber)}
                  className='w-full sm:w-auto border-white/20 hover:bg-white/10 whitespace-nowrap'
                >
                  {downloadingId === invoice.id
                    ? <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                    : <Download className='w-4 h-4 mr-2' />}
                  Unduh PDF
                </Button>
              </Card>
            ))}

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
        )}
    </div>
  );
};
