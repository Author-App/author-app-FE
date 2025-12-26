/**
 * Home Selectors
 *
 * Memoized selectors for home API cache data.
 * Uses RTK Query's cache selectors pattern.
 */

import { createSelector } from '@reduxjs/toolkit';
import { homeApi } from '@/src/store/api/homeApi';
import type { HomeSection, HomeFeedResponse } from '@/src/types/api/home.types';

/**
 * Transforms API response into typed sections array
 */
const buildSections = (data: HomeFeedResponse): HomeSection[] => {
  const sections: HomeSection[] = [];

  if (data.trendingBooks?.length) {
    sections.push({ type: 'books', data: data.trendingBooks });
  }

  if (data.articles?.length) {
    sections.push({ type: 'articles', data: data.articles });
  }

  if (data.audioBooks?.length) {
    sections.push({ type: 'audiobooks', data: data.audioBooks });
  }

  return sections;
};

/**
 * Select home feed query result
 */
export const selectHomeFeedResult = homeApi.endpoints.getHomeFeed.select();

/**
 * Select home banner from cache
 */
export const selectHomeBanner = createSelector(
  [selectHomeFeedResult],
  (result) => result?.data?.data?.banner ?? null
);

/**
 * Select transformed sections for FlashList
 */
export const selectHomeSections = createSelector(
  [selectHomeFeedResult],
  (result) => {
    const data = result?.data?.data;
    if (!data) return [];
    return buildSections(data);
  }
);

/**
 * Select trending books from cache
 */
export const selectTrendingBooks = createSelector(
  [selectHomeFeedResult],
  (result) => result?.data?.data?.trendingBooks ?? []
);

/**
 * Select articles from cache
 */
export const selectHomeArticles = createSelector(
  [selectHomeFeedResult],
  (result) => result?.data?.data?.articles ?? []
);

/**
 * Select audiobooks from cache
 */
export const selectAudioBooks = createSelector(
  [selectHomeFeedResult],
  (result) => result?.data?.data?.audioBooks ?? []
);

/**
 * Select loading state
 */
export const selectHomeFeedIsLoading = createSelector(
  [selectHomeFeedResult],
  (result) => result?.isLoading ?? true
);

/**
 * Select error state
 */
export const selectHomeFeedError = createSelector(
  [selectHomeFeedResult],
  (result) => result?.error ?? null
);
