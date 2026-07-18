import { Link } from 'react-router-dom';
import { Gift, Percent, Tag, Truck } from 'lucide-react';
import { StorefrontPromoCard } from '../config/campaign-banner.types.ts';

const iconMap = {
  tag: Tag,
  truck: Truck,
  gift: Gift,
  percent: Percent,
};

export function CampaignPromoCard({ promo }: { promo: StorefrontPromoCard }) {
  const Icon = promo.iconName ? iconMap[promo.iconName] : Tag;

  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-5 md:p-6 border-2 flex flex-col justify-between h-full shadow-sm hover:shadow-md transition-all ${
        promo.backgroundColorClass || 'bg-card border-border/60 text-foreground'
      }`}
    >
      <div>
        <div className='flex items-center space-x-3 mb-3'>
          <div className='p-2 bg-background/50 rounded-xl backdrop-blur-sm'>
            <Icon size={20} className='opacity-90' />
          </div>
          <h3 className='font-semibold text-lg leading-tight'>{promo.title}</h3>
        </div>
        <p className='text-sm opacity-90 line-clamp-2'>{promo.description}</p>
      </div>

      {promo.ctaLabel && (
        <div className='mt-4'>
          <Link
            to={promo.ctaHref}
            className='inline-flex font-medium text-sm hover:underline items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-sm'
          >
            {promo.ctaLabel}
            <span aria-hidden='true' className='ml-1'>
              &rarr;
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}
