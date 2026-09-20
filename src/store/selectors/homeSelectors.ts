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
  if (data.continueReading?.length) {
    sections.push({ type: 'continueReading', data: data.continueReading });
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
 * Select hero banners array from cache
 */
export const selectHeroBanners = createSelector(
  [selectHomeFeedResult],
  (result) => result?.data?.data?.banners ?? []
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
 * Select error state
 */
export const selectHomeFeedError = createSelector(
  [selectHomeFeedResult],
  (result) => result?.error ?? null
);
