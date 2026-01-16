/**
 * Article Selectors
 *
 * Memoized selectors for article detail API cache data.
 * Uses RTK Query's cache selectors pattern.
 */

import { createSelector } from '@reduxjs/toolkit';
import { exploreApi } from '@/src/store/api/exploreApi';
import type { ArticleDetailResponse } from '@/src/types/api/explore.types';

/**
 * Create a selector for a specific article detail query result
 */
export const selectArticleDetailResult = (articleId: string) =>
  exploreApi.endpoints.getArticleDetail.select(articleId);

/**
 * Select article from cache
 */
export const selectArticle = (articleId: string) =>
  createSelector(
    [selectArticleDetailResult(articleId)],
    (result): ArticleDetailResponse | null => result?.data?.data ?? null
  );
