import { z } from 'zod';
import { statusResponseSchema, libraryPaginationSchema } from './common.schemas';

// ============================================================================
// BOOK ENTITY SCHEMAS
// ============================================================================

export const bookTypeSchema = z.enum(['ebook', 'audiobook']);

export const tagSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const bookProgressSchema = z.object({
  // Ebook fields (null for audiobooks)
  currentPage: z.number().nullable(),
  totalPages: z.number().nullable().optional(),
  // Audiobook fields (null for ebooks)
  currentPositionSec: z.number().nullable(),
  durationSec: z.number().nullable().optional(),
  // Shared fields
  percentage: z.number(),
  lastReadAt: z.string(),
});

export const bookSchema = z.object({
  id: z.string(),
  title: z.string(),
  author: z.string(),
  description: z.string(),
  synopsis: z.string().optional(),
  type: bookTypeSchema,
  isFree: z.boolean(),
  price: z.number(),
  currency: z.string(),
  categories: z.array(z.string()),
  tags: z.array(tagSchema),
  sampleUrl: z.string().optional(),
  thumbnail: z.string().optional(),
  master: z.string().optional(),
  totalPages: z.number().optional(),
  durationSec: z.number().optional(),
  publishedAt: z.string().nullable(),
  hasAccess: z.boolean(),
  bookmark: z.boolean(),
  createdAt: z.string().nullable(),
  updatedAt: z.string().nullable(),
  progress: bookProgressSchema.optional(),
});

export const bookListDataSchema = z.object({
  books: z.array(bookSchema),
  pagination: libraryPaginationSchema,
});

/**
 * GET /books - Book list response
 */
export const getBooksResponseSchema = statusResponseSchema(bookListDataSchema);

// ============================================================================
// BOOK DETAIL SCHEMAS
// ============================================================================

export const relatedBookSchema = z.object({
  id: z.string(),
  title: z.string(),
  author: z.string(),
  thumbnail: z.string().optional(),
});

export const reviewSchema = z.object({
  id: z.string(),
  username: z.string().optional(),
  rating: z.number(),
  comment: z.string(),
  recommended: z.boolean(),
  submittedAt: z.string().nullable(),
  isUserReview: z.boolean(),
});

export const ratingsBreakdownSchema = z.object({
  '1': z.number(),
  '2': z.number(),
  '3': z.number(),
  '4': z.number(),
  '5': z.number(),
});

export const reviewAggregateSchema = z.object({
  averageRating: z.number(),
  totalRating: z.number(),
  recommendedCount: z.number(),
  recommendedPercentage: z.number(),
  ratingsBreakdown: ratingsBreakdownSchema,
  userReviews: z.array(reviewSchema),
  currentUserReview: reviewSchema.optional(),
});

export const bookDetailAggregateSchema = z.object({
  book: bookSchema,
  moreBooks: z.array(relatedBookSchema),
  reviews: reviewAggregateSchema,
});

/**
 * GET /books/:id - Book detail response
 */
export const getBookDetailResponseSchema = statusResponseSchema(bookDetailAggregateSchema);

/**
 * GET /books/:id/reviews - Book reviews response
 */
export const getBookReviewsResponseSchema = statusResponseSchema(reviewAggregateSchema);

// ============================================================================
// BOOK MUTATION SCHEMAS
// ============================================================================

/**
 * POST /books/:id/reviews - Rate book response
 */
export const rateBookResponseSchema = statusResponseSchema(
  z.object({
    review: reviewSchema,
  })
);

export const bookProgressUpdateDataSchema = z.object({
  currentPage: z.number().nullable(),
  currentPositionSec: z.number().nullable(),
  percentage: z.number(),
  totalPages: z.number().nullable(),
  durationSec: z.number().nullable(),
  lastReadAt: z.string(),
});

/**
 * PUT /books/:id/progress - Update book progress response
 */
export const updateBookProgressResponseSchema = z.object({
  success: z.literal(true),
  statusCode: z.literal(200),
  message: z.string(),
  data: bookProgressUpdateDataSchema,
});

// ============================================================================
// EXPORTED TYPES
// ============================================================================

export type BookType = z.infer<typeof bookTypeSchema>;
export type Tag = z.infer<typeof tagSchema>;
export type BookProgress = z.infer<typeof bookProgressSchema>;
export type Book = z.infer<typeof bookSchema>;
export type BookListData = z.infer<typeof bookListDataSchema>;
export type GetBooksResponse = z.infer<typeof getBooksResponseSchema>;

export type RelatedBook = z.infer<typeof relatedBookSchema>;
export type Review = z.infer<typeof reviewSchema>;
export type RatingsBreakdown = z.infer<typeof ratingsBreakdownSchema>;
export type ReviewAggregate = z.infer<typeof reviewAggregateSchema>;
export type BookDetailAggregate = z.infer<typeof bookDetailAggregateSchema>;
export type GetBookDetailResponse = z.infer<typeof getBookDetailResponseSchema>;
export type GetBookReviewsResponse = z.infer<typeof getBookReviewsResponseSchema>;
export type RateBookResponse = z.infer<typeof rateBookResponseSchema>;
export type BookProgressUpdateData = z.infer<typeof bookProgressUpdateDataSchema>;
export type UpdateBookProgressResponse = z.infer<typeof updateBookProgressResponseSchema>;
