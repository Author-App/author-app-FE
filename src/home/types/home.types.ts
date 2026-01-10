import { HomeArticle, HomeBook, ContinueReadingBook } from '@/src/types/api/home.types';

export type {
  HomeBanner,
  HomeBook,
  HomeArticle,
  HomeFeedResponse,
  HomeSectionType,
  HomeSection,
  ContinueReadingBook,
  ContinueReadingProgress,
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
  | { type: 'books'; title: string; subtitle: string; data: HomeBook[] }
  | { type: 'audiobooks'; title: string; subtitle: string; data: HomeBook[] }
  | { type: 'articles'; title: string; subtitle: string; data: HomeArticle[] }
  | { type: 'continueReading'; title: string; subtitle: string; data: ContinueReadingBook[] };
