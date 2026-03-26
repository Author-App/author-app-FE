/**
 * Explore Selectors
 *
 * Memoized selectors for explore API cache data.
 * Uses RTK Query's cache selectors pattern.
 */

import { createSelector } from '@reduxjs/toolkit';
import { exploreApi } from '@/src/store/api/exploreApi';
import type {
  ArticleResponse,
  MediaResponse,
  EventResponse,
  CommunityResponse,
  MediaQueryParams,
} from '@/src/types/api/explore.types';

/**
 * Base selectors for query results
 */
export const selectArticlesResult = exploreApi.endpoints.getArticles.select();

export const selectPodcastsResult = exploreApi.endpoints.getMedia.select({
  mediaType: 'podcast',
} as MediaQueryParams);

export const selectVideosResult = exploreApi.endpoints.getMedia.select({
  mediaType: 'video',
} as MediaQueryParams);

export const selectEventsResult = exploreApi.endpoints.getEvents.select();

export const selectCommunitiesResult =
  exploreApi.endpoints.getCommunities.select();

/**
 * Select articles list from cache
 */
export const selectArticles = createSelector(
  [selectArticlesResult],
  (result): ArticleResponse[] => result?.data?.data?.articles ?? []
);

/**
 * Select podcasts list from cache
 */
export const selectPodcasts = createSelector(
  [selectPodcastsResult],
  (result): MediaResponse[] => result?.data?.data?.media ?? []
);

/**
 * Select videos list from cache
 */
export const selectVideos = createSelector(
  [selectVideosResult],
  (result): MediaResponse[] => result?.data?.data?.media ?? []
);

/**
 * Select events list from cache
 */
export const selectEvents = createSelector(
  [selectEventsResult],
  (result): EventResponse[] => result?.data?.data?.events ?? []
);

/**
 * Select communities list from cache
 */
export const selectCommunities = createSelector(
  [selectCommunitiesResult],
  (result): CommunityResponse[] => result?.data?.data?.communities ?? []
);

/**
 * Select error from current query result
 */
export const selectArticlesError = createSelector(
  [selectArticlesResult],
  (result) => result?.error ?? null
);

export const selectPodcastsError = createSelector(
  [selectPodcastsResult],
  (result) => result?.error ?? null
);

export const selectVideosError = createSelector(
  [selectVideosResult],
  (result) => result?.error ?? null
);

export const selectEventsError = createSelector(
  [selectEventsResult],
  (result) => result?.error ?? null
);

export const selectCommunitiesError = createSelector(
  [selectCommunitiesResult],
  (result) => result?.error ?? null
);
