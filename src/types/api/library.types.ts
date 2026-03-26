export interface Tag {
  id: string;
  name: string;
}

export interface PaginationMeta {
  total: number;
  currentPage: number;
  pageSize: number;
  hasMore: boolean;
}

export interface GetBooksParams {
  type?: 'ebook' | 'audiobook' | '';
  page?: number;
  pageSize?: number;
}

export interface BookProgress {
  // Ebook fields (null for audiobooks)
  currentPage: number | null;
  totalPages?: number | null;
  // Audiobook fields (null for ebooks)
  currentPositionSec: number | null;
  durationSec: number | null;
  // Shared fields
  percentage: number;
  lastReadAt: string;
}

export interface BookResponse {
  id: string;
  title: string;
  author: string;
  description: string;
  synopsis?: string;
  type: 'ebook' | 'audiobook';
  isFree: boolean;
  price: number;
  currency: string;
  categories: string[];
  tags: Tag[];
  sampleUrl?: string;
  thumbnail?: string;
  master?: string;
  totalPages?: number;
  durationSec?: number;
  publishedAt: string | null;
  hasAccess: boolean;
  bookmark: boolean;
  createdAt: string | null;
  updatedAt: string | null;
  progress?: BookProgress;
}

export interface BookListResponse {
  books: BookResponse[];
  pagination: PaginationMeta;
}

export interface GetBooksApiResponse {
  status: string;
  data: BookListResponse;
}

export interface RelatedBookCardResponse {
  id: string;
  title: string;
  author: string;
  thumbnail?: string;
}

export interface ReviewResponse {
  id: string;
  username?: string;
  rating: number;
  comment: string;
  recommended: boolean;
  submittedAt: string | null;
  isUserReview: boolean;
}

export interface RatingsBreakdown {
  '1': number;
  '2': number;
  '3': number;
  '4': number;
  '5': number;
}

export interface ReviewAggregateResponse {
  averageRating: number;
  totalRating: number;
  recommendedCount: number;
  recommendedPercentage: number;
  ratingsBreakdown: RatingsBreakdown;
  userReviews: ReviewResponse[];
  currentUserReview?: ReviewResponse;
}

export interface BookDetailAggregateResponse {
  book: BookResponse;
  moreBooks: RelatedBookCardResponse[];
  reviews: ReviewAggregateResponse;
}

export interface GetBookDetailApiResponse {
  status: string;
  data: BookDetailAggregateResponse;
}

// ============================================================================
// GET /books/:id/reviews - Book Reviews
// ============================================================================

export interface GetBookReviewsApiResponse {
  status: string;
  data: ReviewAggregateResponse;
}

// ============================================================================
// POST /books/:id/reviews - Rate/Review Book
// ============================================================================

export interface RateBookRequest {
  rating: number;
  comment?: string;
  recommended?: boolean;
}

export interface RateBookApiResponse {
  status: string;
  data: {
    review: ReviewResponse;
  };
}

export interface UpdateEbookProgressRequest {
  bookId: string;
  currentPage: number;
}

export interface UpdateAudiobookProgressRequest {
  bookId: string;
  currentPositionSec: number;
}

export type UpdateBookProgressRequest = UpdateEbookProgressRequest | UpdateAudiobookProgressRequest;

export interface BookProgressData {
  currentPage: number | null;
  currentPositionSec: number | null;
  percentage: number;
  totalPages: number | null;
  durationSec: number | null;
  lastReadAt: string;
}

export interface UpdateBookProgressApiResponse {
  success: true;
  statusCode: 200;
  message: string;
  data: BookProgressData;
}

// ============================================================================
// Computed types for UI
// ============================================================================

export interface RatingStats {
  average: number;
  total: number;
  recommended: number;
  breakdown: RatingsBreakdown;
  userReviews: ReviewResponse[];
  currentUserReview?: ReviewResponse;
}

// ============================================================================
// Legacy Compatibility Types (for gradual migration)
// ============================================================================

/** @deprecated Use BookResponse instead */
export interface LibraryBook {
  id: number | string;
  title: string;
  author: string;
  thumbnail: string;
  isFree: boolean;
  hasAccess: boolean;
}
