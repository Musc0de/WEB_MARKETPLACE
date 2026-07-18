export interface CampaignBannerDTO {
  id: string;
  title: string;
  description?: string | null;
  theme: 'light' | 'dark' | 'primary';
  badge?: string | null;
  primaryCtaLabel?: string | null;
  primaryCtaHref?: string | null;
  primaryCtaColor?: string | null;
  secondaryCtaLabel?: string | null;
  secondaryCtaHref?: string | null;
  secondaryCtaColor?: string | null;
  desktopImageUrl?: string | null;
  mobileImageUrl?: string | null;
  isActive: boolean;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

export type CreateCampaignBannerDTO = Omit<CampaignBannerDTO, 'createdAt' | 'updatedAt'>;
export type UpdateCampaignBannerDTO = Partial<CreateCampaignBannerDTO>;
