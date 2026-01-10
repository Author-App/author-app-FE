import { createApi } from '@reduxjs/toolkit/query/react';
import type {
  GetBooksParams,
  GetBooksApiResponse,
  GetBookDetailApiResponse,
  GetBookReviewsApiResponse,
  RateBookRequest,
  RateBookApiResponse,
  UpdateBookProgressApiResponse,
  UpdateEbookProgressRequest,
  UpdateAudiobookProgressRequest,
} from '@/src/types/api/library.types';
import baseQueryWithReauth from './baseQuery';
import { homeApi } from './homeApi';

export const libraryApi = createApi({
  reducerPath: 'libraryApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Books', 'BookDetail', 'BookReviews'],

  endpoints: (builder) => ({
    /**
     * GET /books
     * Fetches paginated list of books with optional type filter
     */
    getBooks: builder.query<GetBooksApiResponse, GetBooksParams | void>({
      query: (params) => ({
        url: '/books',
        params: params || {},
      }),
      providesTags: (result) =>
        result?.data?.books
          ? [
              ...result.data.books.map(({ id }) => ({ type: 'Books' as const, id })),
              { type: 'Books', id: 'LIST' },
            ]
          : [{ type: 'Books', id: 'LIST' }],
      // Cache book list for 5 minutes
      keepUnusedDataFor: 300,
    }),

    /**
     * GET /books/:id
     * Fetches detailed book information with related books and reviews
     */
    getBookDetail: builder.query<GetBookDetailApiResponse, string>({
      query: (id) => `/books/${id}`,
      providesTags: (result, error, id) => [
        { type: 'BookDetail', id },
        { type: 'BookReviews', id },
      ],
      // Cache book details for 10 minutes - book info is mostly static
      keepUnusedDataFor: 600,
    }),

    /**
     * GET /books/:id/reviews
     * Fetches review aggregate for a specific book
     */
    getBookReviews: builder.query<GetBookReviewsApiResponse, string>({
      query: (id) => `/books/${id}/reviews`,
      providesTags: (result, error, id) => [{ type: 'BookReviews', id }],
    }),

    /**
     * POST /books/:id/reviews
     * Submit a rating/review for a book
     */
    rateBook: builder.mutation<RateBookApiResponse, { id: string; body: RateBookRequest }>({
      query: ({ id, body }) => ({
        url: `/books/${id}/reviews`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'BookReviews', id },
        { type: 'BookDetail', id },
      ],
    }),

    /**
     * PUT /books/:bookId/progress
     * Update ebook reading progress (tracked by page number)
     */
    updateEbookProgress: builder.mutation<
      UpdateBookProgressApiResponse,
      UpdateEbookProgressRequest
    >({
      query: ({ bookId, currentPage }) => ({
        url: `/books/${bookId}/progress`,
        method: 'PUT',
        body: { currentPage },
      }),
      invalidatesTags: (result, error, { bookId }) => [
        { type: 'BookDetail', id: bookId },
      ],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Invalidate home feed to update continue reading section
          dispatch(homeApi.util.invalidateTags(['HomeFeed']));
        } catch {
          // Mutation failed, no need to invalidate
        }
      },
    }),

    /**
     * PUT /books/:bookId/progress
     * Update audiobook listening progress (tracked by position in seconds)
     */
    updateAudiobookProgress: builder.mutation<
      UpdateBookProgressApiResponse,
      UpdateAudiobookProgressRequest
    >({
      query: ({ bookId, currentPositionSec }) => ({
        url: `/books/${bookId}/progress`,
        method: 'PUT',
        body: { currentPositionSec },
      }),
      invalidatesTags: (result, error, { bookId }) => [
        { type: 'BookDetail', id: bookId },
      ],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Invalidate home feed to update continue reading section
          dispatch(homeApi.util.invalidateTags(['HomeFeed']));
        } catch {
          // Mutation failed, no need to invalidate
        }
      },
    }),

    /**
     * Toggle bookmark status for a book
     * TODO: Implement when endpoint is available
     */
    // toggleBookmark: builder.mutation<void, string>({
    //   query: (id) => ({
    //     url: `/books/${id}/bookmark`,
    //     method: 'POST',
    //   }),
    //   invalidatesTags: (result, error, id) => [
    //     { type: 'Books', id },
    //     { type: 'BookDetail', id },
    //   ],
    // }),
  }),
});

export const {
  useGetBooksQuery,
  useGetBookDetailQuery,
  useLazyGetBookDetailQuery,
  useGetBookReviewsQuery,
  useRateBookMutation,
  useUpdateEbookProgressMutation,
  useUpdateAudiobookProgressMutation,
} = libraryApi;
