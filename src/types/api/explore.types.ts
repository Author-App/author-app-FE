/**
 * Explore API Types
 *
 * Request and response types for explore endpoints.
 * Based on actual API response structure.
 */

// ============================================================================
// PAGINATION
// ============================================================================

export interface ExplorePagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

// ============================================================================
// ARTICLES / BLOGS
// ============================================================================

export interface ArticleAuthor {
  name: string;
  profileImage?: string;
}

export interface ArticleResponse {
  id: string;
  title: string;
  author: ArticleAuthor;
  publishedAt: string | null;
  readTime?: { value: number; unit: string };
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleDetailResponse extends ArticleResponse {
  content: string; // Full HTML or markdown content
}

export interface ArticleListResponse {
  articles: ArticleResponse[];
  pagination: ExplorePagination;
}

// ============================================================================
// MEDIA (PODCASTS & VIDEOS)
// ============================================================================

export type MediaType = 'video' | 'podcast';

export interface MediaProgress {
  currentPositionSec: number;
  durationSec: number;
  lastPlayedAt: string;
  percentage: number;
  watchedSec: number;
}

export interface MediaResponse {
  id: string;
  name: string;
  description?: string;
  durationSec: number;
  fileUrl: string;
  mediaType: MediaType;
  thumbnail?: string;
  createdAt: string | null;
  updatedAt: string | null;
  progress?: MediaProgress;
}

export interface MediaListResponse {
  media: MediaResponse[];
  pagination: ExplorePagination;
}

export interface MediaQueryParams {
  mediaType: MediaType;
  page?: number;
  limit?: number;
}

// ============================================================================
// EVENTS
// ============================================================================

export type EventType = 'offline' | 'online';

export interface EventResponse {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  eventDate: string | null;
  eventTime: string;
  eventType: EventType;
  location?: string;
  locationGoogleMapLink?: string;
  googleMeetLink?: string;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface EventListResponse {
  events: EventResponse[];
  pagination: ExplorePagination;
}

// ============================================================================
// COMMUNITIES
// ============================================================================

export interface CommunityResponse {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  threadCount: number;
  isJoined: boolean;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface CommunityListResponse {
  communities: CommunityResponse[];
  pagination: ExplorePagination;
}

// ============================================================================
// QUERY PARAMS
// ============================================================================

export interface ExploreQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}
