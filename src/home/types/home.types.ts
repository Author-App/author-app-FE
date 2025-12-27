export type {
  HomeBanner,
  HomeBook,
  HomeArticle,
  HomeFeedResponse,
  HomeSectionType,
  HomeSection,
} from '@/src/types/api/home.types';

export type BannerType = 'book' | 'audiobook' | 'event' | 'article';

export interface BannerItem {
  id: string;
  type: BannerType;
  title: string;
  subtitle?: string;
  image?: string;
  label?: string;
}

export type HomeSectionItem =
  | { type: 'banner'; data: BannerItem[] }
  | { type: 'books'; title: string; subtitle: string; data: import('@/src/types/api/home.types').HomeBook[] }
  | { type: 'audiobooks'; title: string; subtitle: string; data: import('@/src/types/api/home.types').HomeBook[] }
  | { type: 'articles'; title: string; subtitle: string; data: import('@/src/types/api/home.types').HomeArticle[] };
