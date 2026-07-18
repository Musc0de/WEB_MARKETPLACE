import { useEffect, useState } from 'react';
import { type CampaignBannerDTO } from '@starsuperscare/contracts';
import { StorefrontPromoCard } from '../config/campaign-banner.types.ts';
import { SIDE_PROMOS } from '../config/heroCampaigns.ts';
import { CampaignHeroCarousel } from './CampaignHeroCarousel.tsx';
import { CampaignPromoCard } from './CampaignPromoCard.tsx';
import { HeroFallback } from './HeroFallback.tsx';
import { Skeleton } from '@starsuperscare/ui';

export function StorefrontHero() {
  const [campaigns, setCampaigns] = useState<CampaignBannerDTO[]>([]);
  const [sidePromos, setSidePromos] = useState<StorefrontPromoCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${(import.meta as any).env.VITE_API_URL}/v1/settings/campaigns`);
        const json = await res.json();
        setCampaigns(json.data || []);
      } catch (err) {
        console.error('Failed to load campaigns:', err);
        // Fallback to empty if fails
      } finally {
        setSidePromos(SIDE_PROMOS.slice(0, 2));
        setIsLoading(false);
      }
    }
    load();
  }, []);

  if (isLoading) {
    return (
      <div className='grid grid-cols-12 gap-4 lg:gap-5 mb-12'>
        <div className='col-span-12 lg:col-span-8'>
          <Skeleton className='w-full h-[340px] rounded-2xl' />
        </div>
        <div className='hidden lg:flex col-span-12 lg:col-span-4 flex-col gap-4 lg:gap-5'>
          <Skeleton className='w-full h-[160px] rounded-2xl' />
          <Skeleton className='w-full h-[160px] rounded-2xl' />
        </div>
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className='mb-12 h-[340px]'>
        <HeroFallback />
      </div>
    );
  }

  const hasSidePromos = sidePromos.length > 0;

  return (
    <section className='mb-12' aria-label='Promosi Utama'>
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5'>
        {/* Main Hero Carousel */}
        <div className={`col-span-1 min-w-0 ${hasSidePromos ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
          <CampaignHeroCarousel campaigns={campaigns} />
        </div>

        {/* Side Promos (Hidden on Mobile, Below Hero on Tablet, Right Side on Desktop) */}
        {hasSidePromos && (
          <div className='hidden sm:grid grid-cols-2 lg:grid-cols-1 col-span-1 min-w-0 lg:col-span-4 gap-4 lg:gap-5'>
            {sidePromos.map((promo) => (
              <div key={promo.id} className='h-full min-h-[160px] lg:min-h-[auto]'>
                <CampaignPromoCard promo={promo} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
