import React from 'react';
import { Button } from './button.tsx';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}) => {
  if (totalPages <= 1) {
    return null;
  }

  const safeCurrentPage = Math.min(
    Math.max(currentPage, 1),
    totalPages,
  );

  const handlePreviousPage = (): void => {
    if (safeCurrentPage <= 1) {
      return;
    }

    onPageChange(safeCurrentPage - 1);
  };

  const handleNextPage = (): void => {
    if (safeCurrentPage >= totalPages) {
      return;
    }

    onPageChange(safeCurrentPage + 1);
  };

  return (
    <nav
      role='navigation'
      aria-label='Pagination'
      className={[
        'mx-auto flex w-full justify-center',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <ul className='flex flex-row items-center gap-2'>
        <li>
          <Button
            variant='outline'
            size='sm'
            onClick={handlePreviousPage}
            disabled={safeCurrentPage <= 1}
            aria-label='Go to previous page'
          >
            Previous
          </Button>
        </li>

        <li
          className='min-w-28 text-center text-sm font-medium'
          aria-current='page'
        >
          Page {safeCurrentPage} of {totalPages}
        </li>

        <li>
          <Button
            variant='outline'
            size='sm'
            onClick={handleNextPage}
            disabled={safeCurrentPage >= totalPages}
            aria-label='Go to next page'
          >
            Next
          </Button>
        </li>
      </ul>
    </nav>
  );
};

Pagination.displayName = 'Pagination';
