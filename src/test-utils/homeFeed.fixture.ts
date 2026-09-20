import type {
  ApiResponse,
} from '@/src/types/api/common.types';
import type {
  ContinueReadingBook,
  HomeArticle,
  HomeBook,
  HomeFeedResponse,
} from '@/src/types/api/home.types';

const book = (id: string): HomeBook => ({
  id,
  title: `Book ${id}`,
  price: 9.99,
  currency: 'USD',
});

const article = (id: string): HomeArticle => ({
  id,
  title: `Article ${id}`,
});

const continueReadingBook = (id: string): ContinueReadingBook => ({
  id,
  title: `Book ${id}`,
  price: 9.99,
  currency: 'USD',
  hasAccess: true,
  progress: {
    currentPage: 12,
    currentPositionSec: 0,
    lastReadAt: '2026-01-01T00:00:00.000Z',
    percentage: 25,
    totalPages: 48,
  },
});

/**
 * A home feed with every section filled.
 * Pass overrides to empty a section or change one value.
 */
export const buildHomeFeed = (
  overrides: Partial<HomeFeedResponse> = {}
): ApiResponse<HomeFeedResponse> => ({
  success: true,
  data: {
    banner: { title: 'Welcome back' },
    banners: [],
    trendingBooks: [book('b1')],
    articles: [article('a1')],
    audioBooks: [book('ab1')],
    continueReading: [continueReadingBook('cr1')],
    ...overrides,
  },
});
