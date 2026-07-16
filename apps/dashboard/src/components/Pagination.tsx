import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, limit, total, onPageChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const isFirst = page <= 1;
  const isLast = page >= totalPages;

  if (total === 0) return null;

  return (
    <div className='flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 pb-2 border-t border-white/5'>
      <span className='text-sm text-muted-foreground'>
        Menampilkan <strong className='text-white'>{Math.min(limit, total)}</strong> dari{' '}
        <strong className='text-white'>{total}</strong> pesanan
      </span>

      <div className='flex items-center gap-2'>
        <button
          type='button'
          disabled={isFirst}
          onClick={() => onPageChange(page - 1)}
          className={`inline-flex items-center justify-center p-2 rounded-lg border transition-all ${
            isFirst
              ? 'border-white/5 bg-white/5 text-white/20 cursor-not-allowed'
              : 'border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20 active:scale-95'
          }`}
          title='Halaman Sebelumnya'
        >
          <ChevronLeft className='w-4 h-4' />
        </button>

        <div className='flex items-center gap-1 px-2'>
          <span className='text-sm text-white font-medium min-w-[2rem] text-center'>{page}</span>
          <span className='text-sm text-muted-foreground'>/</span>
          <span className='text-sm text-muted-foreground min-w-[2rem] text-center'>
            {totalPages}
          </span>
        </div>

        <button
          type='button'
          disabled={isLast}
          onClick={() => onPageChange(page + 1)}
          className={`inline-flex items-center justify-center p-2 rounded-lg border transition-all ${
            isLast
              ? 'border-white/5 bg-white/5 text-white/20 cursor-not-allowed'
              : 'border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20 active:scale-95'
          }`}
          title='Halaman Berikutnya'
        >
          <ChevronRight className='w-4 h-4' />
        </button>
      </div>
    </div>
  );
}
