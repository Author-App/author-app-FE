/**
 * Library Selectors
 *
 * Memoized selectors for library API cache data.
 * Uses RTK Query's cache selectors pattern.
 */

import { createSelector } from '@reduxjs/toolkit';
import { libraryApi } from '@/src/store/api/libraryApi';
import type { BookResponse } from '@/src/types/api/library.types';

/**
 * Base selector for books query result
 */
export const selectBooksResult = libraryApi.endpoints.getBooks.select({});

/**
 * Select all books from cache
 */
export const selectAllBooks = createSelector(
  [selectBooksResult],
  (result): BookResponse[] => result?.data?.data?.books ?? []
);

/**
 * Select books sorted by publish date (newest first)
 */
export const selectBooksSortedByDate = createSelector(
  [selectAllBooks],
  (books): BookResponse[] =>
    [...books].sort(
      (a, b) =>
        new Date(b.publishedAt ?? b.createdAt ?? 0).getTime() -
        new Date(a.publishedAt ?? a.createdAt ?? 0).getTime()
    )
);

/**
 * Select only owned books (purchased or free)
 */
export const selectOwnedBooks = createSelector(
  [selectBooksSortedByDate],
  (books): BookResponse[] =>
    books.filter((book) => book.hasAccess || book.isFree)
);

/**
 * Select only ebooks
 */
export const selectEbooks = createSelector(
  [selectBooksSortedByDate],
  (books): BookResponse[] => books.filter((book) => book.type === 'ebook')
);

/**
 * Select only audiobooks
 */
export const selectAudiobooks = createSelector(
  [selectBooksSortedByDate],
  (books): BookResponse[] => books.filter((book) => book.type === 'audiobook')
);
