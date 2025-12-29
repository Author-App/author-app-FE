/**
 * Explore UI Types
 *
 * Types for explore screen components and sections.
 */

export type {
  ArticleResponse,
  MediaResponse,
  EventResponse,
  CommunityResponse,
  MediaType,
  EventType,
  ExplorePagination,
} from '@/src/types/api/explore.types';

export type ExploreTabType = 'Blogs' | 'Podcasts' | 'Videos' | 'Events' | 'Community';

export const EXPLORE_TABS: ExploreTabType[] = ['Blogs', 'Podcasts', 'Videos', 'Events', 'Community'];

export type ExploreSectionItem =
  | { type: 'blog'; data: import('@/src/types/api/explore.types').ArticleResponse }
  | { type: 'podcast'; data: import('@/src/types/api/explore.types').MediaResponse }
  | { type: 'video'; data: import('@/src/types/api/explore.types').MediaResponse }
  | { type: 'event'; data: import('@/src/types/api/explore.types').EventResponse }
  | { type: 'community'; data: import('@/src/types/api/explore.types').CommunityResponse };
