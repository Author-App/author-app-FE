/**
 * Book Detail Selectors
 *
 * Memoized selectors for book detail API cache data.
 * Uses RTK Query's cache selectors pattern.
 */

import { createSelector } from '@reduxjs/toolkit';
import { libraryApi } from '@/src/store/api/libraryApi';
import type {
  BookResponse,
  RelatedBookCardResponse,
  RatingStats,
} from '@/src/types/api/library.types';

/**
 * Create a selector for a specific book detail query result
 */
export const selectBookDetailResult = (bookId: string) =>
  libraryApi.endpoints.getBookDetail.select(bookId);

/**
 * Select book from cache
 */
export const selectBook = (bookId: string) =>
  createSelector(
    [selectBookDetailResult(bookId)],
    (result): BookResponse | undefined => result?.data?.data?.book
  );

/**
 * Select related books from cache
 */
export const selectMoreBooks = (bookId: string) =>
  createSelector(
    [selectBookDetailResult(bookId)],
    (result): RelatedBookCardResponse[] => result?.data?.data?.moreBooks ?? []
  );

/**
 * Select reviews data from cache
 */
export const selectReviews = (bookId: string) =>
  createSelector(
    [selectBookDetailResult(bookId)],
    (result) => result?.data?.data?.reviews
  );

/**
 * Select computed rating stats from cache
 */
export const selectRatingStats = (bookId: string) =>
  createSelector([selectReviews(bookId)], (reviews): RatingStats | null => {
    if (!reviews) return null;

    return {
      average: reviews.averageRating,
      total: reviews.totalRating,
      recommended: reviews.recommendedPercentage,
      breakdown: reviews.ratingsBreakdown,
      userReviews: reviews.userReviews,
      currentUserReview: reviews.currentUserReview,
    };
  });

/**
 * Select whether user has access to the book (free or purchased)
 */
export const selectHasAccess = (bookId: string) =>
  createSelector([selectBook(bookId)], (book): boolean => {
    if (!book) return false;
    return book.isFree || book.hasAccess;
  });
