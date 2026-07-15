import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { client } from '../../lib/rpc.ts';
import { formatDate } from '@starsuperscare/ui';
import { AlertTriangle, ChevronRight, Edit2, Plus, Search, Tag, Trash2 } from 'lucide-react';
import { Pagination } from '../../components/Pagination.tsx';

// ─── Type ─────────────────────────────────────────────────────────────────────
type Brand = {
  id: string;
  name: string;
  slug: string;
  createdAt?: string;
};

// ─── Confirm Dialog ───────────────────────────────────────────────────────────
function ConfirmDialog({
  count,
  onConfirm,
  onCancel,
  isDeleting,
}: {
  count: number;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}) {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm'>
      <div className='bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4'>
        <div className='flex items-center gap-3 mb-4'>
          <div className='w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0'>
            <AlertTriangle className='w-5 h-5 text-red-600' />
          </div>
          <div>
            <p className='text-sm font-semibold text-gray-900'>Hapus {count} Brand?</p>
            <p className='text-xs text-gray-500 mt-0.5'>Aksi ini tidak dapat dibatalkan.</p>
          </div>
        </div>
        <div className='flex gap-2 mt-4'>
          <button
            type='button'
            onClick={onCancel}
            disabled={isDeleting}
            className='flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all'
          >
            Batal
          </button>
          <button
            type='button'
            onClick={onConfirm}
            disabled={isDeleting}
            className='flex-1 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-all disabled:opacity-60'
          >
            {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function BrandsList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const limit = 10;

  // ── Fetch all brands ────────────────────────────────────────────────────────
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'brands'],
    queryFn: async () => {
      const res = await client.v1.admin.catalog.brands.$get({ query: { limit: '200' } });
      if (!res.ok) throw new Error('Failed to fetch brands');
      return await res.json();
    },
  });

  const allBrands: Brand[] = (data?.data?.items as any) ?? [];
  const totalAll: number = data?.data?.total ?? allBrands.length;

  // ── Filters ─────────────────────────────────────────────────────────────────
  const searchFiltered = useMemo(() => {
    if (!search.trim()) return allBrands;
    const q = search.toLowerCase();
    return allBrands.filter(
      (p) => p.name?.toLowerCase().includes(q) || p.slug?.toLowerCase().includes(q),
    );
  }, [allBrands, search]);

  // ── Client-side pagination ──────────────────────────────────────────────────
  const totalFiltered = searchFiltered.length;
  const paginated = useMemo(() => {
    const start = (page - 1) * limit;
    return searchFiltered.slice(start, start + limit);
  }, [searchFiltered, page, limit]);

  // ── Selection helpers ───────────────────────────────────────────────────────
  const allOnPageSelected = paginated.length > 0 && paginated.every((p) => selectedIds.has(p.id));
  const someOnPageSelected = paginated.some((p) => selectedIds.has(p.id));

  const toggleSelectAll = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allOnPageSelected) {
        paginated.forEach((p) => next.delete(p.id));
      } else {
        paginated.forEach((p) => next.add(p.id));
      }
      return next;
    });
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // ── Bulk delete ─────────────────────────────────────────────────────────────
  const handleBulkDelete = async () => {
    setIsDeleting(true);
    try {
      await Promise.all(
        [...selectedIds].map((id) =>
          client.v1.admin.catalog.brands[':id'].$delete({ param: { id } })
        ),
      );
      setSelectedIds(new Set());
      setShowConfirm(false);
      queryClient.invalidateQueries({ queryKey: ['admin', 'brands'] });
    } catch (err) {
      console.error('Bulk delete failed:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
    setSelectedIds(new Set());
  };

  return (
    <div className='space-y-5 p-4 px-6'>
      {/* Confirm dialog */}
      {showConfirm && (
        <ConfirmDialog
          count={selectedIds.size}
          onConfirm={handleBulkDelete}
          onCancel={() => setShowConfirm(false)}
          isDeleting={isDeleting}
        />
      )}

      {/* ── Header ── */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-gray-900'>Brands</h1>
          <p className='text-sm text-gray-500 mt-0.5'>Kelola dan lihat semua brand toko Anda.</p>
        </div>
        <div className='flex items-center gap-3'>
          <div className='flex items-center gap-1.5 text-sm text-gray-500'>
            <Tag className='w-4 h-4' />
            <span>{totalAll} total</span>
          </div>
          <button
            type='button'
            onClick={() => navigate('/catalog/brands/create')}
            className='inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 transition-all shadow-sm'
          >
            <Plus className='w-4 h-4' />
            Tambah Brand
          </button>
        </div>
      </div>

      {/* ── Bulk action bar ── */}
      {selectedIds.size > 0 && (
        <div className='flex items-center justify-between bg-red-50 border border-red-200 rounded-xl px-4 py-3'>
          <div className='flex items-center gap-2 text-sm text-red-700'>
            <span className='font-semibold'>{selectedIds.size} brand dipilih</span>
            <span className='text-red-400'>·</span>
            <button
              type='button'
              onClick={() => setSelectedIds(new Set())}
              className='text-xs text-red-500 hover:underline'
            >
              Batalkan pilihan
            </button>
          </div>
          <button
            type='button'
            onClick={() => setShowConfirm(true)}
            className='inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-all shadow-sm'
          >
            <Trash2 className='w-4 h-4' />
            Hapus {selectedIds.size} Brand
          </button>
        </div>
      )}

      {/* ── Search ── */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3'>
        <div className='relative flex-1 max-w-sm'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
          <input
            type='text'
            placeholder='Cari berdasarkan nama brand...'
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className='w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400'
          />
        </div>
      </div>

      {/* ── Table ── */}
      <div className='bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm'>
        <table className='w-full'>
          <thead>
            <tr className='bg-gray-50 border-b border-gray-200'>
              <th className='w-10 px-4 py-3'>
                <input
                  type='checkbox'
                  checked={allOnPageSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someOnPageSelected && !allOnPageSelected;
                  }}
                  onChange={toggleSelectAll}
                  className='w-4 h-4 rounded border-gray-300 text-gray-900 accent-gray-900 cursor-pointer'
                />
              </th>
              {['Brand', 'Slug', 'Dibuat Pada', 'Actions'].map((h) => (
                <th
                  key={h}
                  className='px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-100'>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className='animate-pulse'>
                  <td className='px-4 py-3.5'>
                    <div className='w-4 h-4 bg-gray-100 rounded' />
                  </td>
                  <td className='px-4 py-3.5'>
                    <div className='h-3.5 bg-gray-100 rounded w-36' />
                  </td>
                  <td className='px-4 py-3.5'>
                    <div className='h-3 bg-gray-100 rounded w-48' />
                  </td>
                  <td className='px-4 py-3.5'>
                    <div className='h-4 bg-gray-100 rounded w-24' />
                  </td>
                  <td className='px-4 py-3.5'>
                    <div className='h-8 bg-gray-100 rounded w-16' />
                  </td>
                </tr>
              ))
              : paginated.length === 0
              ? (
                <tr>
                  <td colSpan={5} className='px-4 py-16 text-center'>
                    <Tag className='w-10 h-10 text-gray-300 mx-auto mb-3' />
                    <p className='text-sm font-medium text-gray-500'>Tidak ada brand ditemukan</p>
                    <p className='text-xs text-gray-400 mt-1'>
                      {search
                        ? 'Coba ubah kata kunci pencarian'
                        : 'Mulai dengan membuat brand baru'}
                    </p>
                    {!search && (
                      <button
                        type='button'
                        onClick={() => navigate('/catalog/brands/create')}
                        className='mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 transition-all'
                      >
                        <Plus className='w-4 h-4' />
                        Buat Brand Pertama
                      </button>
                    )}
                  </td>
                </tr>
              )
              : paginated.map((brand) => {
                const isSelected = selectedIds.has(brand.id);
                return (
                  <tr
                    key={brand.id}
                    className={`transition-colors group ${
                      isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className='w-10 px-4 py-3.5'>
                      <input
                        type='checkbox'
                        checked={isSelected}
                        onChange={() => toggleSelectOne(brand.id)}
                        className='w-4 h-4 rounded border-gray-300 text-gray-900 accent-gray-900 cursor-pointer'
                      />
                    </td>
                    <td className='px-4 py-3.5'>
                      <p className='text-sm font-semibold text-gray-900'>{brand.name}</p>
                    </td>
                    <td className='px-4 py-3.5'>
                      <p className='text-xs text-gray-500 font-mono'>{brand.slug}</p>
                    </td>
                    <td className='px-4 py-3.5'>
                      <span className='text-sm text-gray-600'>
                        {brand.createdAt ? formatDate(brand.createdAt) : '—'}
                      </span>
                    </td>
                    <td className='px-4 py-3.5'>
                      <div className='flex items-center gap-2'>
                        <button
                          type='button'
                          onClick={() => navigate(`/catalog/brands/${brand.id}/edit`)}
                          className='inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all group-hover:shadow-sm'
                        >
                          <Edit2 className='w-3.5 h-3.5' />
                          Edit
                          <ChevronRight className='w-3 h-3 opacity-50' />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      {totalFiltered > 0 && (
        <Pagination
          page={page}
          limit={limit}
          total={totalFiltered}
          onPageChange={(p) => {
            setPage(p);
            setSelectedIds(new Set());
          }}
        />
      )}
    </div>
  );
}
