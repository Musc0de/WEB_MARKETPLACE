import { StorefrontCampaignBanner, StorefrontPromoCard } from './campaign-banner.types.ts';

export const HERO_CAMPAIGNS: StorefrontCampaignBanner[] = [
  {
    id: 'campaign-1',
    badge: 'PROMO MINGGU INI',
    title: 'Diskon hingga 50% untuk pilihan terbaik minggu ini',
    description: 'Temukan produk populer dengan harga spesial sebelum campaign berakhir.',
    primaryCtaLabel: 'Belanja Promo',
    primaryCtaHref: '/products?promo=true',
    theme: 'primary',
    isActive: true,
  },
  {
    id: 'campaign-2',
    badge: 'PRODUK PILIHAN',
    title: 'Koleksi Premium Terkini',
    description: 'Penuhi kebutuhan gaya hidup Anda dengan koleksi terbaik bulan ini.',
    primaryCtaLabel: 'Lihat Semua Produk',
    primaryCtaHref: '/products',
    theme: 'dark',
    isActive: true,
  },
];

export const SIDE_PROMOS: StorefrontPromoCard[] = [
  {
    id: 'promo-1',
    title: 'Gratis Ongkir',
    description: 'Bebas biaya kirim untuk minimal belanja Rp 50.000.',
    ctaLabel: 'Klaim Sekarang',
    ctaHref: '/vouchers',
    iconName: 'truck',
    backgroundColorClass:
      'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
  },
  {
    id: 'promo-2',
    title: 'Voucher Pengguna Baru',
    description: 'Dapatkan diskon 20% khusus untuk pesanan pertama Anda.',
    ctaLabel: 'Pakai Voucher',
    ctaHref: '/vouchers',
    iconName: 'gift',
    backgroundColorClass: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
  },
];
