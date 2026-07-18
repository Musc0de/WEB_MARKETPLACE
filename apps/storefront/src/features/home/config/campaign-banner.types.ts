export interface StorefrontCampaignBanner {
  id: string;
  badge?: string;
  title: string;
  description?: string;

  desktopImageUrl?: string;
  mobileImageUrl?: string;
  imageAlt?: string;

  primaryCtaLabel: string;
  primaryCtaHref: string;

  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;

  theme?: 'primary' | 'dark' | 'warm' | 'light';
  contentPosition?: 'left' | 'center';

  priority?: number;
  isActive?: boolean;
}

export interface StorefrontPromoCard {
  id: string;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref: string;
  badge?: string;
  backgroundColorClass?: string;
  iconName?: 'tag' | 'truck' | 'gift' | 'percent';
}
