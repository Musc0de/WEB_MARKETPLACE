import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
}

/**
 * Shared pagination component — used by OrdersList & CustomersList.
 * Renders Sebelumnya / Lanjut centered below a data table.
 */
export function Pagination({ page, limit, total, onPageChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const isFirst = page <= 1;
  const isLast = page >= totalPages;

  if (total === 0) return null;

  return (
    <div className='flex items-center justify-center gap-3 pt-2 pb-1'>
      {/* Sebelumnya */}
      <button
        type='button'
        disabled={isFirst}
        onClick={() => onPageChange(page - 1)}
        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
          isFirst
            ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed'
            : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-900 hover:text-white hover:border-gray-900'
        }`}
      >
        <ChevronLeft className='w-4 h-4' />
        Sebelumnya
      </button>

      {/* Page indicator */}
      <span className='text-sm text-gray-500 px-2 select-none'>
        Halaman <strong className='text-gray-800'>{page}</strong> dari{' '}
        <strong className='text-gray-800'>{totalPages}</strong>
        <span className='text-gray-400 ml-1'>({total} data)</span>
      </span>

      {/* Lanjut */}
      <button
        type='button'
        disabled={isLast}
        onClick={() => onPageChange(page + 1)}
        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
          isLast
            ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed'
            : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-900 hover:text-white hover:border-gray-900'
        }`}
      >
        Lanjut
        <ChevronRight className='w-4 h-4' />
      </button>
    </div>
  );
}
