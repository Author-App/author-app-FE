import { useCallback, useState, useMemo } from 'react';
import { useRouter } from 'expo-router';
import type { Href } from 'expo-router';
import { haptics } from '@/src/utils/haptics';
import {
  useGetBookDetailQuery,
  useRateBookMutation,
} from '@/src/store/api/libraryApi';
import { useBookPurchase } from '@/src/hooks/useBookPurchase';
import type {
  BookResponse,
  RelatedBookCardResponse,
  RatingStats,
  RateBookRequest,
} from '@/src/types/api/library.types';

export function useBookDetail(bookId: string | undefined) {
  const router = useRouter();

  // API queries
  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetBookDetailQuery(bookId!, {
    skip: !bookId,
  });

  // Mutations
  const [rateBookMutation, { isLoading: isSubmittingReview }] = useRateBookMutation();

  // Review modal state
  const [isReviewModalVisible, setReviewModalVisible] = useState(false);

  // Purchase hook
  const { isPurchasing, purchase } = useBookPurchase({
    onSuccess: refetch,
    onError: (message) => alert(message),
  });

  // Extract data
  const book: BookResponse | undefined = data?.data?.book;
  const moreBooks: RelatedBookCardResponse[] = data?.data?.moreBooks ?? [];
  const reviews = data?.data?.reviews;
  // Computed rating stats - use dummy data if no reviews from API
  const ratingStats: RatingStats | null = useMemo(() => {
    if (!reviews) {
      return null;
    }
    return {
      average: reviews.averageRating,
      total: reviews.totalRating,
      recommended: reviews.recommendedPercentage,
      breakdown: reviews.ratingsBreakdown,
      userReviews: reviews.userReviews,
      currentUserReview: reviews.currentUserReview,
    };
  }, [reviews]);

  // Check if user has access (free book or purchased)
  const hasAccess = book?.isFree || book?.hasAccess;

  // Navigate to reader/player
  const startReading = useCallback(() => {
    if (!book) return;
    haptics.medium();

    if (book.type === 'audiobook') {
      router.push(`/(app)/audiobookPlayer?bookId=${book.id}`);
    } else {
      router.push(`/(app)/ebookReader?bookId=${book.id}`);
    }
  }, [book, router]);

  // Purchase book
  const purchaseBook = useCallback(() => {
    if (!bookId) return;
    haptics.medium();
    purchase(bookId);
  }, [bookId, purchase]);

  // Submit review
  const submitReview = useCallback(
    async (rating?: number, comment?: string) => {
      if (!bookId) return;

      try {
        const payload: RateBookRequest = {
          rating: rating ?? 0,
        };

        if (comment && comment.trim().length > 0) {
          payload.comment = comment.trim();
        }

        await rateBookMutation({
          id: bookId,
          body: payload,
        }).unwrap();

        haptics.success();
        alert('Review submitted successfully');
        setReviewModalVisible(false);
        refetch();
      } catch (error) {
        const errorData = error as { data?: { message?: string } };
        alert(errorData?.data?.message || 'Failed to submit review');
      }
    },
    [bookId, rateBookMutation, refetch]
  );

  // Navigate to related book
  const openRelatedBook = useCallback(
    (relatedBookId: string) => {
      haptics.light();
      router.push(`/(app)/book/${relatedBookId}` as Href);
    },
    [router]
  );

  return {
    // Data
    book,
    moreBooks,
    ratingStats,
    hasAccess,

    // Loading states
    isLoading,
    isFetching,
    isError,
    isSubmittingReview,
    isPurchasing,

    // Review modal
    isReviewModalVisible,
    setReviewModalVisible,

    // Actions
    refetch,
    startReading,
    purchaseBook,
    submitReview,
    openRelatedBook,
  };
}
