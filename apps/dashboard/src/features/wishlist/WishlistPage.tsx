import useSWR from 'swr';
import { API_URL, client } from '../../lib/api.ts';
import { Button, Card, toast } from '@starsuperscare/ui';
import { ExternalLink, Heart, Image as ImageIcon, ShoppingCart, Trash2 } from 'lucide-react';

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
        toast.success('Dihapus dari wishlist');
        mutate();
      }
    } catch (_e) {
      toast.error('Gagal menghapus');
    }
  };

  const getMediaUrl = (key: string | null) => {
    if (!key) return null;
    return `${API_URL}/v1/admin/assets/${key}`;
  };

  return (
    <div className='max-w-4xl mx-auto space-y-6'>
      <div>
        <h1 className='text-2xl font-bold text-white flex items-center gap-2'>
          Wishlist Saya
        </h1>
        <p className='text-muted-foreground mt-1'>
          Barang-barang yang Anda simpan untuk dibeli nanti.
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {isLoading
          ? (
            [1, 2, 3, 4].map((i) => (
              <Card key={i} className='animate-pulse bg-white/5 border-white/10 h-32' />
            ))
          )
          : error
          ? (
            <div className='col-span-full text-center py-10 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20'>
              <p>Gagal memuat wishlist. Silakan coba lagi.</p>
            </div>
          )
          : data?.length === 0
          ? (
            <div className='col-span-full text-center py-20 bg-white/5 rounded-xl border border-white/10'>
              <Heart className='w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50' />
              <h3 className='text-lg font-medium text-white mb-2'>Wishlist Kosong</h3>
              <p className='text-muted-foreground text-sm mb-6'>
                Anda belum menyimpan produk apapun ke dalam wishlist.
              </p>
              <Button
                variant='outline'
                onClick={() => {
                  globalThis.location.href = 'http://shop.starsuperscare.net:5173/';
                }}
              >
                Mulai Belanja
              </Button>
            </div>
          )
          : (
            data?.map((item: any) => (
              <Card
                key={item.id}
                className='flex flex-col sm:flex-row bg-[#0f1115] border-white/10 hover:border-white/20 transition-all overflow-hidden'
              >
                <div className='w-full sm:w-32 h-32 bg-white/5 flex items-center justify-center shrink-0'>
                  {item.product?.primaryImage
                    ? (
                      <img
                        src={getMediaUrl(item.product.primaryImage) || ''}
                        alt={item.product.name}
                        className='w-full h-full object-cover'
                      />
                    )
                    : <ImageIcon className='w-8 h-8 text-muted-foreground' />}
                </div>

                <div className='p-4 flex flex-col flex-1 justify-between'>
                  <div>
                    <h4 className='font-medium text-white line-clamp-2 leading-tight mb-1'>
                      {item.product?.name}
                    </h4>
                    <div className='flex items-center gap-2 mb-2'>
                      <span className='text-sm text-primary font-bold'>
                        Rp {(item.product?.variantsSummary?.minPrice || 0).toLocaleString('id-ID')}
                        {item.product?.variantsSummary?.maxPrice >
                            item.product?.variantsSummary?.minPrice
                          ? ' - Rp ' +
                            item.product?.variantsSummary?.maxPrice.toLocaleString('id-ID')
                          : ''}
                      </span>
                    </div>
                    <p className='text-xs text-muted-foreground'>
                      Sisa Stok:{' '}
                      <span className='text-white font-medium'>
                        {item.product?.variantsSummary?.totalAvailableStock || 0}
                      </span>
                    </p>
                  </div>

                  <div className='flex items-center gap-2 mt-4'>
                    <Button
                      variant='outline'
                      size='sm'
                      className='flex-1 h-8 text-xs'
                      onClick={() =>
                        globalThis.open(
                          `http://shop.starsuperscare.net:5173/products/${item.product?.slug}`,
                          '_blank',
                        )}
                    >
                      <ExternalLink className='w-3 h-3 mr-2' />
                      Lihat
                    </Button>
                    <Button
                      variant='default'
                      size='sm'
                      className='flex-1 h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground'
                      onClick={() =>
                        globalThis.location.href =
                          `http://shop.starsuperscare.net:5173/products/${item.product?.slug}`}
                    >
                      <ShoppingCart className='w-3 h-3 mr-2' />
                      Beli
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-8 w-8 text-red-500 hover:bg-red-500/10 hover:text-red-400 shrink-0'
                      onClick={() => removeWishlist(item.productId)}
                    >
                      <Trash2 className='w-4 h-4' />
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
