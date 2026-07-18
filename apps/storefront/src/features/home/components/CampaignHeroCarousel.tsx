import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, H1, Text } from '@starsuperscare/ui';
import type { CampaignBannerDTO } from '@starsuperscare/contracts';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function isValidHex(value: string | null | undefined): value is string {
  return Boolean(value && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value));
}

function getContrastColor(hex: string) {
  if (!isValidHex(hex)) return '#ffffff';

  const normalized = hex.length === 4
    ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
    : hex;

  const red = Number.parseInt(normalized.slice(1, 3), 16);
  const green = Number.parseInt(normalized.slice(3, 5), 16);
  const blue = Number.parseInt(normalized.slice(5, 7), 16);
  const luminance = (red * 299 + green * 587 + blue * 114) / 1000;

  return luminance > 155 ? '#0f172a' : '#ffffff';
}

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

  // Autoplay slideshow with random timing (ping-pong effect: right then left)
  useEffect(() => {
    if (!isMultiple) return;

    let isReversing = false;
    let timeoutId: NodeJS.Timeout | number;

    const playNext = () => {
      // Random time between 3.5s and 6.5s
      const nextTime = Math.floor(Math.random() * (6500 - 3500 + 1)) + 3500;

      timeoutId = setTimeout(() => {
        setActiveIndex((current) => {
          let next = isReversing ? current - 1 : current + 1;

          if (next >= campaigns.length) {
            isReversing = true;
            next = Math.max(0, campaigns.length - 2);
          } else if (next < 0) {
            isReversing = false;
            next = Math.min(1, campaigns.length - 1);
          }

          scrollTo(next);
          return next;
        });
        playNext();
      }, nextTime);
    };

    playNext();

    return () => clearTimeout(timeoutId as number);
  }, [isMultiple, campaigns.length]);

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
              {campaign.desktopImageUrl && (
                <img
                  src={campaign.desktopImageUrl}
                  alt={campaign.title}
                  className={`absolute inset-0 h-full w-full object-cover ${
                    campaign.mobileImageUrl ? 'hidden md:block' : 'block'
                  }`}
                />
              )}
              {campaign.mobileImageUrl && (
                <img
                  src={campaign.mobileImageUrl}
                  alt={campaign.title}
                  className='absolute inset-0 h-full w-full object-cover block md:hidden'
                />
              )}

              {/* Overlay for text readability when images are present */}
              {(campaign.desktopImageUrl || campaign.mobileImageUrl) && (
                <div
                  className={`absolute inset-0 ${
                    campaign.theme === 'light'
                      ? 'bg-white/40'
                      : 'bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-transparent'
                  }`}
                />
              )}
              {/* CSS Decorative Pattern Fallback if no images */}
              {!campaign.desktopImageUrl && !campaign.mobileImageUrl && (
                <>
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
                </>
              )}

              <div className='relative z-10 p-6 pb-12 md:p-12 md:pb-12 max-w-2xl flex flex-col justify-center h-full'>
                {campaign.badge && (
                  <div className='mb-4'>
                    <div className='inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-white/20 text-white border border-white/30 backdrop-blur-md'>
                      {campaign.badge}
                    </div>
                  </div>
                )}
                <H1
                  className={`mb-3 ${
                    (isPrimary || isDark) ||
                      (campaign.desktopImageUrl || campaign.mobileImageUrl) &&
                        campaign.theme !== 'light'
                      ? 'text-white'
                      : 'text-slate-900'
                  } text-3xl md:text-4xl lg:text-5xl !leading-tight break-words`}
                >
                  {campaign.title}
                </H1>
                {campaign.description && (
                  <Text
                    className={`mb-8 text-base md:text-lg opacity-90 line-clamp-2 max-w-xl ${
                      (isPrimary || isDark) ||
                        (campaign.desktopImageUrl || campaign.mobileImageUrl) &&
                          campaign.theme !== 'light'
                        ? 'text-white/90'
                        : 'text-slate-700'
                    }`}
                  >
                    {campaign.description}
                  </Text>
                )}

                <div className='flex items-center gap-3 mt-auto w-full sm:w-auto'>
                  {campaign.primaryCtaLabel && campaign.primaryCtaHref && (
                    <Button
                      type='button'
                      size='lg'
                      className='flex-1 sm:flex-none h-11 sm:h-12 px-4 sm:px-8 rounded-xl text-[13px] sm:text-sm font-semibold shadow-sm transition-all duration-300 transform hover:-translate-y-1'
                      style={{
                        backgroundColor: isValidHex(campaign.primaryCtaColor)
                          ? campaign.primaryCtaColor!
                          : '#2563eb',
                        color: getContrastColor(campaign.primaryCtaColor || '#2563eb'),
                        border: 'none',
                      }}
                      onClick={() => navigate(campaign.primaryCtaHref!)}
                    >
                      {campaign.primaryCtaLabel}
                    </Button>
                  )}
                  {campaign.secondaryCtaLabel && campaign.secondaryCtaHref && (
                    <Button
                      type='button'
                      variant='default'
                      size='lg'
                      className='flex-1 sm:flex-none h-11 sm:h-12 px-4 sm:px-8 rounded-xl text-[13px] sm:text-sm font-semibold shadow-sm transition-all duration-300 transform hover:-translate-y-1'
                      style={{
                        backgroundColor: isValidHex(campaign.secondaryCtaColor)
                          ? campaign.secondaryCtaColor!
                          : '#ffffff',
                        color: getContrastColor(campaign.secondaryCtaColor || '#ffffff'),
                        border: '1px solid rgba(0,0,0,0.1)',
                      }}
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
