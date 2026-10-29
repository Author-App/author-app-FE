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
  EventResponse,
  CommunityResponse,
} from '@/src/types/api/explore.types';

/**
 * Base selectors for query results
 */
export const selectArticlesResult = exploreApi.endpoints.getArticles.select();

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
