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
    <div className='flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 pb-2 border-t border-gray-100'>
      <span className='text-sm text-gray-500'>
        Menampilkan <strong className='text-gray-900'>{Math.min(limit, total)}</strong> dari{' '}
        <strong className='text-gray-900'>{total}</strong> pesanan
      </span>

      <div className='flex items-center gap-2'>
        <button
          type='button'
          disabled={isFirst}
          onClick={() => onPageChange(page - 1)}
          className={`inline-flex items-center justify-center p-2 rounded-lg border transition-all ${
            isFirst
              ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed'
              : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 active:scale-95'
          }`}
          title='Halaman Sebelumnya'
        >
          <ChevronLeft className='w-4 h-4' />
        </button>

        <div className='flex items-center gap-1 px-2'>
          <span className='text-sm text-gray-900 font-medium min-w-[2rem] text-center'>{page}</span>
          <span className='text-sm text-gray-400'>/</span>
          <span className='text-sm text-gray-500 min-w-[2rem] text-center'>
            {totalPages}
          </span>
        </div>

        <button
          type='button'
          disabled={isLast}
          onClick={() => onPageChange(page + 1)}
          className={`inline-flex items-center justify-center p-2 rounded-lg border transition-all ${
            isLast
              ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed'
              : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 active:scale-95'
          }`}
          title='Halaman Berikutnya'
        >
          <ChevronRight className='w-4 h-4' />
        </button>
      </div>
    </div>
  );
}
