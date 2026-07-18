import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, H1, Text } from '@starsuperscare/ui';
import type { CampaignBannerDTO } from '@starsuperscare/contracts';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  campaigns: CampaignBannerDTO[];
}

export function CampaignHeroCarousel({ campaigns }: Props) {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMultiple = campaigns.length > 1;

  // Sync active index with scroll position for mobile snapping
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isMultiple) return;

    const handleScroll = () => {
      const index = Math.round(container.scrollLeft / container.clientWidth);
      setActiveIndex(index);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [isMultiple]);

  const scrollTo = (index: number) => {
    const container = containerRef.current;
    if (!container) return;
    container.scrollTo({
      left: index * container.clientWidth,
      behavior: 'smooth',
    });
  };

  return (
    <div className='relative w-full rounded-2xl overflow-hidden group border border-slate-200 dark:border-slate-800 shadow-sm bg-slate-50 dark:bg-slate-900'>
      <div
        ref={containerRef}
        className='flex overflow-x-auto snap-x snap-mandatory scrollbar-hide no-scrollbar w-full'
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        aria-roledescription='carousel'
      >
        {campaigns.map((campaign, index) => {
          const isPrimary = campaign.theme === 'primary';
          const isDark = campaign.theme === 'dark';
          const bgClass = isPrimary
            ? 'bg-blue-600 text-white'
            : isDark
            ? 'bg-slate-900 text-white'
            : 'bg-white text-slate-900';

          return (
            <div
              key={campaign.id}
              className={`w-full snap-start flex-none relative flex items-center ${bgClass} overflow-hidden rounded-2xl`}
              role='group'
              aria-roledescription='slide'
              aria-label={`${index + 1} of ${campaigns.length}`}
              style={{ minHeight: '340px' }}
            >
              {/* CSS Decorative Pattern Fallback if no images */}
              <div className='absolute inset-0 opacity-10 pointer-events-none overflow-hidden'>
                <svg width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'>
                  <defs>
                    <pattern id='grid' width='40' height='40' patternUnits='userSpaceOnUse'>
                      <path
                        d='M 40 0 L 0 0 0 40'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='1'
                      />
                    </pattern>
                  </defs>
                  <rect width='100%' height='100%' fill='url(#grid)' />
                </svg>
              </div>

              {/* Decorative Circle */}
              <div className='absolute -right-20 -top-20 w-64 h-64 bg-white opacity-5 rounded-full blur-2xl pointer-events-none' />

              <div className='relative z-10 p-6 md:p-12 max-w-2xl flex flex-col justify-center h-full'>
                {campaign.badge && (
                  <div className='mb-4'>
                    <div className='inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-white/20 text-white border border-white/30 backdrop-blur-md'>
                      {campaign.badge}
                    </div>
                  </div>
                )}
                <H1
                  className={`mb-3 ${
                    isPrimary || isDark ? 'text-white' : 'text-slate-900'
                  } text-3xl md:text-4xl lg:text-5xl !leading-tight break-words`}
                >
                  {campaign.title}
                </H1>
                {campaign.description && (
                  <Text className={`mb-8 text-base md:text-lg opacity-90 line-clamp-2 max-w-xl`}>
                    {campaign.description}
                  </Text>
                )}

                <div className='flex flex-wrap items-center gap-4 mt-auto'>
                  {campaign.primaryCtaLabel && campaign.primaryCtaHref && (
                    <Button
                      type='button'
                      size='lg'
                      variant={isPrimary || isDark ? 'secondary' : 'default'}
                      className='px-8 min-h-[48px]'
                      style={campaign.primaryCtaColor
                        ? { backgroundColor: campaign.primaryCtaColor, color: 'white' }
                        : {}}
                      onClick={() => navigate(campaign.primaryCtaHref!)}
                    >
                      {campaign.primaryCtaLabel}
                    </Button>
                  )}
                  {campaign.secondaryCtaLabel && campaign.secondaryCtaHref && (
                    <Button
                      variant='outline'
                      size='lg'
                      className='w-full sm:w-auto h-12 lg:h-14 px-8 rounded-xl font-semibold border-2 transition-all duration-300 transform hover:-translate-y-1'
                      style={campaign.secondaryCtaColor
                        ? {
                          borderColor: campaign.secondaryCtaColor,
                          color: campaign.secondaryCtaColor,
                        }
                        : { borderColor: 'white', color: 'white' }}
                      onClick={() => (globalThis.location.href = campaign.secondaryCtaHref!)}
                    >
                      {campaign.secondaryCtaLabel}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Arrows */}
      {isMultiple && (
        <>
          <button
            type='button'
            onClick={() => scrollTo(Math.max(activeIndex - 1, 0))}
            disabled={activeIndex === 0}
            className='hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 disabled:opacity-0 transition-all border border-white/10 z-30'
            aria-label='Previous slide'
          >
            <ChevronLeft size={24} />
          </button>
          <button
            type='button'
            onClick={() => scrollTo(Math.min(activeIndex + 1, campaigns.length - 1))}
            disabled={activeIndex === campaigns.length - 1}
            className='hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 disabled:opacity-0 transition-all border border-white/10 z-30'
            aria-label='Next slide'
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Mobile/Tablet Pagination Dots */}
      {isMultiple && (
        <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20'>
          {campaigns.map((_, idx) => (
            <button
              type='button'
              key={idx}
              onClick={() => scrollTo(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                activeIndex === idx ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* CSS to hide scrollbar */}
      <style
        dangerouslySetInnerHTML={{
          __html: '.scrollbar-hide::-webkit-scrollbar { display: none; }',
        }}
      />
    </div>
  );
}
