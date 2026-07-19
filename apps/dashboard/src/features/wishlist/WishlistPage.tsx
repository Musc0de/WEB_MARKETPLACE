import useSWR from 'swr';
import { API_URL, client } from '../../lib/api.ts';
import { Button, Card, toast } from '@starsuperscare/ui';
import { ArrowRight, Heart, PackageSearch, Sparkles, Trash2 } from 'lucide-react';

export const WishlistPage = () => {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/wishlist',
    async () => {
      const res = await client.v1.wishlist.$get();
      const json = await res.json();
      return (json as any).data || [];
    },
  );

  const removeWishlist = async (productId: string) => {
    try {
      const res = await client.v1.wishlist.remove.$post({
        json: { productId },
      });
      if (res.ok) {
        toast.success('Produk berhasil dihapus dari favorit');
        mutate();
      }
    } catch (_e) {
      toast.error('Gagal menghapus dari favorit');
    }
  };

  const getMediaUrl = (key: string | null) => {
    if (!key) return null;
    if (key.startsWith('http')) return key;
    return `${API_URL}/v1/admin/assets/${key}`;
  };

  return (
    <div className='max-w-5xl mx-auto pb-12 animate-in fade-in duration-500'>
      {/* Header Banner */}
      <div className='relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-pink-950 to-slate-900 p-8 sm:p-10 shadow-xl mb-8 border border-pink-900/50'>
        <div className='absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none'>
          <div className='absolute -top-24 -right-12 w-64 h-64 bg-pink-500 rounded-full blur-[80px]' />
          <div className='absolute -bottom-24 -left-12 w-64 h-64 bg-rose-500 rounded-full blur-[80px]' />
        </div>

        <div className='relative z-10 flex flex-col sm:flex-row items-center gap-6'>
          <div className='w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-pink-500/20 backdrop-blur-md border border-pink-500/30 flex items-center justify-center shadow-[0_0_30px_-5px_rgba(236,72,153,0.4)]'>
            <Heart className='w-10 h-10 sm:w-12 sm:h-12 text-pink-300 fill-pink-300/20' />
          </div>
          <div className='text-center sm:text-left'>
            <h1 className='text-3xl sm:text-4xl font-bold text-white mb-2 tracking-tight'>
              Favorit Saya
            </h1>
            <p className='text-pink-200 font-medium text-sm sm:text-base max-w-lg flex items-center justify-center sm:justify-start gap-2'>
              <Sparkles className='w-4 h-4 opacity-80' />
              Simpan produk impian Anda untuk dibeli di lain waktu.
            </p>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
        {isLoading
          ? (
            [1, 2, 3, 4, 5].map((i) => (
              <Card
                key={i}
                className='animate-pulse bg-muted/50 border-border/40 aspect-[3/4] rounded-2xl'
              />
            ))
          )
          : error
          ? (
            <div className='col-span-full text-center py-12 bg-red-50 dark:bg-red-950/20 rounded-3xl border border-red-100 dark:border-red-900/30'>
              <p className='text-red-600 dark:text-red-400 font-bold text-lg'>
                Gagal Memuat Favorit
              </p>
              <p className='text-red-500/80 mt-2'>Silakan periksa koneksi atau coba lagi.</p>
            </div>
          )
          : data?.length === 0
          ? (
            <div className='col-span-full flex flex-col items-center justify-center py-20 px-4 bg-card dark:bg-background rounded-3xl border border-border/60 text-center shadow-sm'>
              <div className='w-24 h-24 bg-pink-100 dark:bg-pink-900/20 rounded-full flex items-center justify-center mb-6'>
                <Heart className='w-12 h-12 text-pink-500/50' />
              </div>
              <h3 className='text-2xl font-bold text-foreground mb-3'>Belum Ada Favorit</h3>
              <p className='text-muted-foreground max-w-md mb-8'>
                Jelajahi toko kami dan ketuk ikon hati pada produk yang Anda sukai untuk
                menyimpannya di sini.
              </p>
              <Button
                className='h-12 px-8 rounded-full shadow-lg shadow-pink-500/20 bg-pink-600 hover:bg-pink-700 text-white font-bold transition-all hover:scale-[1.02] active:scale-[0.98]'
                onClick={() => {
                  globalThis.location.href = import.meta.env.VITE_STOREFRONT_URL;
                }}
              >
                Mulai Belanja Sekarang <ArrowRight className='w-5 h-5 ml-2' />
              </Button>
            </div>
          )
          : (
            data?.map((item: any) => (
              <Card
                key={item.id}
                className='group flex flex-col bg-card/80 backdrop-blur-md border border-border/60 hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-300 overflow-hidden rounded-2xl relative'
              >
                {/* Product Image Section */}
                <div className='relative w-full aspect-square bg-muted/30 overflow-hidden'>
                  {item.product?.primaryImage
                    ? (
                      <a
                        href={`${
                          import.meta.env.VITE_STOREFRONT_URL || 'http://localhost:5173'
                        }/products/${item.product?.slug}`}
                        className='block w-full h-full relative'
                      >
                        <img
                          src={getMediaUrl(item.product.primaryImage) || ''}
                          alt={item.product.name}
                          className='block object-cover w-full h-full transition-transform duration-500 group-hover:scale-110'
                        />
                        <div className='absolute inset-0 bg-gradient-to-t from-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none' />
                      </a>
                    )
                    : (
                      <a
                        href={`${
                          import.meta.env.VITE_STOREFRONT_URL || 'http://localhost:5173'
                        }/products/${item.product?.slug}`}
                        className='block w-full h-full relative'
                      >
                        <div className='flex items-center justify-center w-full h-full text-muted-foreground/50 text-[11px] select-none font-bold'>
                          No Image
                        </div>
                      </a>
                    )}

                  {/* Delete overlay button on top right */}
                  <div className='absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300'>
                    <Button
                      variant='secondary'
                      size='icon'
                      className='h-8 w-8 bg-white/90 hover:bg-red-500 hover:text-white text-red-500 shadow-md rounded-full backdrop-blur-md'
                      onClick={(e) => {
                        e.preventDefault();
                        removeWishlist(item.productId);
                      }}
                    >
                      <Trash2 className='w-4 h-4' />
                    </Button>
                  </div>
                </div>

                {/* Product Details Section */}
                <div className='flex flex-col flex-grow px-3 pt-3 pb-3 gap-1 z-10'>
                  <a
                    href={`${
                      import.meta.env.VITE_STOREFRONT_URL || 'http://localhost:5173'
                    }/products/${item.product?.slug}`}
                  >
                    <h4 className='text-xs font-bold text-foreground line-clamp-2 leading-snug min-h-[2.4rem] group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors'>
                      {item.product?.name}
                    </h4>
                  </a>

                  <div className='mt-1'>
                    <div className='flex items-baseline gap-1.5 flex-wrap'>
                      <span className='text-sm font-black text-foreground'>
                        Rp {(item.product?.variantsSummary?.minPrice || 0).toLocaleString('id-ID')}
                        {item.product?.variantsSummary?.maxPrice >
                            item.product?.variantsSummary?.minPrice
                          ? ' - Rp ' +
                            item.product?.variantsSummary?.maxPrice.toLocaleString('id-ID')
                          : ''}
                      </span>
                    </div>
                  </div>

                  <div className='flex items-center gap-1.5 text-[10px] text-muted-foreground mt-0.5'>
                    <PackageSearch className='w-3 h-3' />
                    Stok:{' '}
                    <span className='font-semibold text-foreground'>
                      {item.product?.variantsSummary?.totalAvailableStock || 0}
                    </span>
                  </div>

                  <div className='flex gap-1.5 mt-2.5 w-full'>
                    <Button
                      variant='outline'
                      className='flex-1 h-8 text-[11px] font-bold rounded-lg border-pink-200 text-pink-600 hover:bg-pink-50 dark:border-pink-900/50 dark:hover:bg-pink-950/30 dark:text-pink-400 transition-colors px-0'
                      onClick={() =>
                        globalThis.open(
                          `${
                            import.meta.env.VITE_STOREFRONT_URL || 'http://localhost:5173'
                          }/products/${item.product?.slug}`,
                          '_blank',
                        )}
                    >
                      Lihat
                    </Button>
                    <Button
                      className='flex-1 h-8 text-[11px] font-bold rounded-lg shadow-sm shadow-primary/20 bg-primary hover:bg-primary/90 text-primary-foreground transition-all hover:scale-[1.02] active:scale-[0.98] px-0'
                      onClick={() =>
                        globalThis.location.href = `${
                          import.meta.env.VITE_STOREFRONT_URL || 'http://localhost:5173'
                        }/products/${item.product?.slug}`}
                    >
                      Beli
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
      </div>
    </div>
  );
};
