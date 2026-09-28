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
 * Hero banner from API
 */
export interface HeroBanner {
  id: string;
  type: 'book' | 'audiobook' | 'paperback' | 'hardcover' | 'article' | 'event';
  resourceId: string;
  title: string;
  tagline?: string;
  displayOrder?: number;
  cover?: string;
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
  type?: 'ebook' | 'audiobook' | 'hardcover' | 'paperback';
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
  banners?: HeroBanner[];
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
 * Discriminated union for type-safe sections
 * TypeScript knows data type based on section type
 */
export type HomeSection =
  | { type: 'books'; data: HomeBook[] }
  | { type: 'audiobooks'; data: HomeBook[] }
  | { type: 'articles'; data: HomeArticle[] }
  | { type: 'continueReading'; data: ContinueReadingBook[] };
