import { useState, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api.ts';
import { formatDate } from '@starsuperscare/ui';
import {
  Search,
  Package,
  FileText,
  Trash2,
  Edit2,
  Plus,
  ChevronRight,
  Globe,
  AlertTriangle,
} from 'lucide-react';
import { Pagination } from '../../components/Pagination.tsx';

// ─── Type ─────────────────────────────────────────────────────────────────────
type Product = {
  id: string;
  name: string;
  slug: string;
  status: string;
  type: string;
  price?: number;
  createdAt?: string;
  publishedAt?: string | null;
};

// ─── Status badge ─────────────────────────────────────────────────────────────
function ProductStatusBadge({ status }: { status: string }) {
  const s = status?.toLowerCase();
  const cfg =
    s === 'published'
      ? { dot: 'bg-emerald-500', cls: 'bg-emerald-50 text-emerald-700', label: 'published' }
      : s === 'draft'
      ? { dot: 'bg-amber-400', cls: 'bg-amber-50 text-amber-700', label: 'draft' }
      : s === 'archived'
      ? { dot: 'bg-gray-400', cls: 'bg-gray-100 text-gray-500', label: 'archived' }
      : { dot: 'bg-gray-400', cls: 'bg-gray-100 text-gray-600', label: s || 'unknown' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// ─── Type badge ───────────────────────────────────────────────────────────────
function ProductTypeBadge({ type }: { type: string }) {
  const t = type?.toLowerCase();
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
      t === 'digital' ? 'bg-purple-50 text-purple-700' : 'bg-sky-50 text-sky-700'
    }`}>
      {t || 'physical'}
    </span>
  );
}

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
            <p className='text-sm font-semibold text-gray-900'>Hapus {count} Produk?</p>
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
export function ProductsList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [search, setSearch]             = useState('');
  const [page, setPage]                 = useState(1);
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [selectedIds, setSelectedIds]   = useState<Set<string>>(new Set());
  const [showConfirm, setShowConfirm]   = useState(false);
  const [isDeleting, setIsDeleting]     = useState(false);
  const limit = 10;

  // ── Fetch all products ──────────────────────────────────────────────────────
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'products'],
    // limit=200 ensures we get all products for client-side pagination
    // The admin API now supports pagination + statusCounts
    queryFn: () => api.get('/admin/catalog/products?limit=200'),
  });

  // API now returns: { data: Product[], total, statusCounts, ... }
  const allProducts: Product[] = data?.data ?? [];
  const totalAll: number = data?.total ?? allProducts.length;
  const apiStatusCounts: Record<string, number> = data?.statusCounts ?? {};

  // Stats — use API's statusCounts (server-side, excludes soft-deleted)
  // After DB migration: only 'published' (live) and 'draft' are the main statuses
  const stats = useMemo(() => ({
    published: apiStatusCounts['published'] ?? allProducts.filter((p) => p.status?.toLowerCase() === 'published').length,
    draft:     apiStatusCounts['draft']     ?? allProducts.filter((p) => p.status?.toLowerCase() === 'draft').length,
  }), [apiStatusCounts, allProducts]);

  // ── Filters ─────────────────────────────────────────────────────────────────
  const searchFiltered = useMemo(() => {
    if (!search.trim()) return allProducts;
    const q = search.toLowerCase();
    return allProducts.filter(
      (p) => p.name?.toLowerCase().includes(q) || p.slug?.toLowerCase().includes(q),
    );
  }, [allProducts, search]);

  const filtered = useMemo(() => {
    if (statusFilter === 'all') return searchFiltered;
    return searchFiltered.filter((p) => p.status?.toLowerCase() === statusFilter);
  }, [searchFiltered, statusFilter]);

  // ── Client-side pagination ──────────────────────────────────────────────────
  const totalFiltered = filtered.length;
  const paginated = useMemo(() => {
    const start = (page - 1) * limit;
    return filtered.slice(start, start + limit);
  }, [filtered, page, limit]);

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
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  // ── Bulk delete ─────────────────────────────────────────────────────────────
  const handleBulkDelete = async () => {
    setIsDeleting(true);
    try {
      await Promise.all([...selectedIds].map((id) => api.delete(`/admin/catalog/products/${id}`)));
      setSelectedIds(new Set());
      setShowConfirm(false);
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    } catch (err) {
      console.error('Bulk delete failed:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSearchChange = (val: string) => { setSearch(val); setPage(1); setSelectedIds(new Set()); };
  const handleFilterChange = (val: typeof statusFilter) => { setStatusFilter(val); setPage(1); setSelectedIds(new Set()); };

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
          <h1 className='text-2xl font-bold tracking-tight text-gray-900'>Products</h1>
          <p className='text-sm text-gray-500 mt-0.5'>Kelola dan lihat semua produk toko Anda.</p>
        </div>
        <div className='flex items-center gap-3'>
          <div className='flex items-center gap-1.5 text-sm text-gray-500'>
            <Package className='w-4 h-4' />
            <span>{totalAll} total</span>
          </div>
          <button
            type='button'
            onClick={() => navigate('/catalog/create')}
            className='inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 transition-all shadow-sm'
          >
            <Plus className='w-4 h-4' />
            Tambah Produk
          </button>
        </div>
      </div>

      {/* ── Stats Cards ── */}
      <div className='grid grid-cols-3 gap-4'>
        {/* Published Live */}
        <div className='bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-4'>
          <div className='text-emerald-600 opacity-70'><Globe className='w-5 h-5' /></div>
          <div className='min-w-0'>
            <p className='text-xs font-medium text-gray-500 leading-tight'>Total Produk Published</p>
            <p className='text-2xl font-bold text-emerald-700'>{stats.published}</p>
            <p className='text-[10px] text-gray-400 mt-0.5'>live — tampil di storefront</p>
          </div>
        </div>

        {/* Draft */}
        <div className='bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-4'>
          <div className='text-amber-600 opacity-70'><FileText className='w-5 h-5' /></div>
          <div className='min-w-0'>
            <p className='text-xs font-medium text-gray-500 leading-tight'>Total Produk Draft</p>
            <p className='text-2xl font-bold text-amber-700'>{stats.draft}</p>
            <p className='text-[10px] text-gray-400 mt-0.5'>belum dipublikasi</p>
          </div>
        </div>

        {/* Total Keseluruhan */}
        <div className='bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center gap-4'>
          <div className='text-gray-500 opacity-70'><Package className='w-5 h-5' /></div>
          <div className='min-w-0'>
            <p className='text-xs font-medium text-gray-500 leading-tight'>Total Semua Produk</p>
            <p className='text-2xl font-bold text-gray-700'>{totalAll}</p>
            <p className='text-[10px] text-gray-400 mt-0.5'>semua status (non-deleted)</p>
          </div>
        </div>
      </div>

      {/* ── Bulk action bar ── */}
      {selectedIds.size > 0 && (
        <div className='flex items-center justify-between bg-red-50 border border-red-200 rounded-xl px-4 py-3'>
          <div className='flex items-center gap-2 text-sm text-red-700'>
            <span className='font-semibold'>{selectedIds.size} produk dipilih</span>
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
            Hapus {selectedIds.size} Produk
          </button>
        </div>
      )}

      {/* ── Search + Filter Tabs ── */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3'>
        <div className='relative flex-1 max-w-sm'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
          <input
            type='text'
            placeholder='Cari berdasarkan nama produk...'
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className='w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400'
          />
        </div>
        <div className='flex gap-1.5'>
          {(['all', 'published', 'draft'] as const).map((s) => (
            <button
              key={s}
              type='button'
              onClick={() => handleFilterChange(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                statusFilter === s
                  ? s === 'published' ? 'bg-emerald-600 text-white'
                  : s === 'draft'     ? 'bg-amber-500 text-white'
                  : 'bg-gray-900 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {s === 'all' ? 'Semua' : s === 'published' ? 'Published' : 'Draft'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ── */}
      <div className='bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm'>
        <table className='w-full'>
          <thead>
            <tr className='bg-gray-50 border-b border-gray-200'>
              {/* Checkbox header */}
              <th className='w-10 px-4 py-3'>
                <input
                  type='checkbox'
                  checked={allOnPageSelected}
                  ref={(el) => { if (el) el.indeterminate = someOnPageSelected && !allOnPageSelected; }}
                  onChange={toggleSelectAll}
                  className='w-4 h-4 rounded border-gray-300 text-gray-900 accent-gray-900 cursor-pointer'
                />
              </th>
              {['Produk', 'Status', 'Tipe', 'Tanggal', 'Actions'].map((h) => (
                <th key={h} className='px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-100'>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className='animate-pulse'>
                  <td className='px-4 py-3.5'><div className='w-4 h-4 bg-gray-100 rounded' /></td>
                  <td className='px-4 py-3.5'><div className='space-y-1'><div className='h-3.5 bg-gray-100 rounded w-36' /><div className='h-3 bg-gray-100 rounded w-48' /></div></td>
                  <td className='px-4 py-3.5'><div className='h-5 bg-gray-100 rounded-full w-16' /></td>
                  <td className='px-4 py-3.5'><div className='h-5 bg-gray-100 rounded w-14' /></td>
                  <td className='px-4 py-3.5'><div className='h-4 bg-gray-100 rounded w-24' /></td>
                  <td className='px-4 py-3.5'><div className='h-8 bg-gray-100 rounded w-16' /></td>
                </tr>
              ))
              : paginated.length === 0
              ? (
                <tr>
                  <td colSpan={6} className='px-4 py-16 text-center'>
                    <Package className='w-10 h-10 text-gray-300 mx-auto mb-3' />
                    <p className='text-sm font-medium text-gray-500'>Tidak ada produk ditemukan</p>
                    <p className='text-xs text-gray-400 mt-1'>
                      {search ? 'Coba ubah kata kunci pencarian' : 'Mulai dengan membuat produk baru'}
                    </p>
                    {!search && (
                      <button
                        type='button'
                        onClick={() => navigate('/catalog/create')}
                        className='mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 transition-all'
                      >
                        <Plus className='w-4 h-4' />
                        Buat Produk Pertama
                      </button>
                    )}
                  </td>
                </tr>
              )
              : paginated.map((product) => {
                const isSelected = selectedIds.has(product.id);
                return (
                  <tr
                    key={product.id}
                    className={`transition-colors group ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                  >
                    {/* Checkbox */}
                    <td className='w-10 px-4 py-3.5'>
                      <input
                        type='checkbox'
                        checked={isSelected}
                        onChange={() => toggleSelectOne(product.id)}
                        className='w-4 h-4 rounded border-gray-300 text-gray-900 accent-gray-900 cursor-pointer'
                      />
                    </td>
                    {/* Produk */}
                    <td className='px-4 py-3.5'>
                      <div className='min-w-0'>
                        <p className='text-sm font-semibold text-gray-900 truncate'>{product.name}</p>
                        <p className='text-xs text-gray-400 truncate'>{product.slug}</p>
                      </div>
                    </td>
                    {/* Status */}
                    <td className='px-4 py-3.5'>
                      <ProductStatusBadge status={product.status} />
                    </td>
                    {/* Tipe */}
                    <td className='px-4 py-3.5'>
                      <ProductTypeBadge type={product.type} />
                    </td>
                    {/* Tanggal */}
                    <td className='px-4 py-3.5'>
                      <span className='text-sm text-gray-600'>
                        {product.createdAt ? formatDate(product.createdAt) : '—'}
                      </span>
                    </td>
                    {/* Actions */}
                    <td className='px-4 py-3.5'>
                      <div className='flex items-center gap-2'>
                        <button
                          type='button'
                          onClick={() => navigate(`/catalog/${product.id}/edit`)}
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
          onPageChange={(p) => { setPage(p); setSelectedIds(new Set()); }}
        />
      )}
    </div>
  );
}