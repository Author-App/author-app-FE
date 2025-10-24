// Base common properties for all banner types
interface BaseBannerProps {
  id: string;
  image: string;
}

// Event banner specific data
export interface EventBannerData extends BaseBannerProps {
  bannerType: 'event';
  title: string;
  description?: string;
  date: string;
  time: string;
  location?: string;
  attendeeCount?: number;
  organizerName?: string;
  organizerAvatar?: string;
  badges?: string[];
}

// Promo banner specific data
export interface PromoBannerData extends BaseBannerProps {
  bannerType: 'promo';
  title: string;
  subtitle?: string;
  description?: string;
  discountPercentage?: number;
  originalPrice?: number;
  discountedPrice?: number;
  validUntil?: string;
  badges?: string[];
}

// Book banner specific data
export interface BookBannerData extends BaseBannerProps {
  bannerType: 'book';
  title: string;
  author: string;
  genre?: string;
  publishedDate?: string;
  rating?: number;
  totalRatings?: number;
  pageCount?: number;
  readingProgress?: number; // 0-1 representing percentage
  badges?: string[];
}

// Audiobook banner specific data
export interface AudiobookBannerData extends BaseBannerProps {
  bannerType: 'audiobook';
  title: string;
  author: string;
  narrator?: string;
  genre?: string;
  duration?: string; // e.g., "8h 45m"
  listenedProgress?: number; // 0-1 representing percentage
  currentChapter?: string;
  totalChapters?: number;
  badges?: string[];
}

// Union type for all banner data
export type HeroBannerData = 
  | EventBannerData 
  | PromoBannerData 
  | BookBannerData 
  | AudiobookBannerData;

// Common banner component props
export interface BannerComponentProps {
  data: HeroBannerData;
}