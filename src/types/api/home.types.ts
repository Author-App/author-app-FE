/**
 * Home API Types
 *
 * Request and response types for home feed endpoints.
 * Based on actual API response structure.
 */

// ============================================================================
// RESPONSE ENTITIES
// ============================================================================

/**
 * Banner displayed at top of home screen
 */
export interface HomeBanner {
  title: string;
}

/**
 * Book item in home feed carousels
 */
export interface HomeBook {
  id: string;
  title: string;
  image?: string;
  hasAccess?: boolean;
  price: number;
  currency: string;
}

/**
 * Article item in home feed carousels
 */
export interface HomeArticle {
  id: string;
  title: string;
  image?: string;
  readTime?: { value: number; unit: string };
}

/**
 * Progress info for continue reading items
 */
export interface ContinueReadingProgress {
  currentPage: number;
  currentPositionSec: number;
  lastReadAt: string;
  percentage: number;
  totalPages: number;
}

/**
 * Book item in continue reading section (lighter than full BookResponse)
 */
export interface ContinueReadingBook {
  id: string;
  title: string;
  image?: string;
  price: number;
  currency: string;
  hasAccess: boolean;
  progress: ContinueReadingProgress;
}

// ============================================================================
// HOME FEED
// ============================================================================

/**
 * GET /home - Response
 * Main home feed data
 */
export interface HomeFeedResponse {
  banner: HomeBanner | null;
  trendingBooks: HomeBook[];
  articles: HomeArticle[];
  audioBooks: HomeBook[];
  continueReading: ContinueReadingBook[];
}

// ============================================================================
// UI TYPES (for transforming API data)
// ============================================================================

/**
 * Section type identifiers
 */
export type HomeSectionType = 'books' | 'audiobooks' | 'articles' | 'continueReading';

/**
 * Section titles mapped by type
 */
export const HOME_SECTION_TITLES: Record<HomeSectionType, string> = {
  books: 'Trending Books',
  audiobooks: 'New Audiobooks',
  articles: 'Featured Articles',
  continueReading: 'Continue Reading',
};

/**
 * Discriminated union for type-safe sections
 * TypeScript knows data type based on section type
 */
export type HomeSection =
  | { type: 'books'; data: HomeBook[] }
  | { type: 'audiobooks'; data: HomeBook[] }
  | { type: 'articles'; data: HomeArticle[] }
  | { type: 'continueReading'; data: ContinueReadingBook[] };
