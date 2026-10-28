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
  HeroBanner,
} from '@/src/types/api/home.types';

export type BannerType = 'book' | 'audiobook' | 'event' | 'article' | 'paperback' | 'hardcover';

export interface BannerItem {
  id: string;
  type: BannerType;
  resourceId?: string;  // For API banners - the actual book/article ID
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

export interface HomeLayoutProps {
  sections: HomeSectionItem[];
  onBannerPress: (item: BannerItem) => void;
  onBookPress: (book: HomeBook) => void;
  onArticlePress: (article: HomeArticle) => void;
  onContinueReadingPress: (book: ContinueReadingBook) => void;
  onSeeAll: (section: HomeSectionItem['type']) => void;
  refreshControl: React.ReactNode;
  refreshProps: object;
}
