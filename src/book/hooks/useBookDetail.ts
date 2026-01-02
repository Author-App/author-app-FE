import { useCallback, useState, useMemo } from 'react';
import { useRouter } from 'expo-router';
import type { Href } from 'expo-router';
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
    error,
    refetch,
  } = useGetBookDetailQuery(bookId!, {
    skip: !bookId,
  });

  // Debug logging
  console.log('📚 [useBookDetail] bookId:', bookId);
  console.log('📚 [useBookDetail] isLoading:', isLoading, 'isError:', isError);
  console.log('📚 [useBookDetail] data:', JSON.stringify(data, null, 2));
  if (error) {
    console.log('📚 [useBookDetail] error:', JSON.stringify(error, null, 2));
  }

  // Mutations
  const [rateBookMutation, { isLoading: isSubmittingReview }] = useRateBookMutation();

  // Review modal state
  const [isReviewModalVisible, setReviewModalVisible] = useState(false);

  // Purchase hook - reusable across the app
  const {
    isPaymentModalVisible,
    isCreatingOrder,
    startPurchase,
    confirmPayment,
    cancelPayment,
  } = useBookPurchase({
    onPaymentSuccess: () => {
      refetch();
    },
    onPaymentFailed: () => {
      // Error already shown by hook
    },
  });

  // Extract data
  const book: BookResponse | undefined = data?.data?.book;
  const moreBooks: RelatedBookCardResponse[] = data?.data?.moreBooks ?? [];
  const reviews = data?.data?.reviews;

  // Computed rating stats
  const ratingStats: RatingStats | null = useMemo(() => {
    if (!reviews) return null;
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

    if (book.type === 'audiobook') {
      router.push({
        pathname: '/(app)/audiobookPlayer',
        params: { bookId: book.id },
      });
    } else {
      router.push({
        pathname: '/(app)/ebookReader',
        params: { bookId: book.id },
      });
    }
  }, [book, router]);

  // Purchase book - delegates to reusable hook
  const purchaseBook = useCallback(() => {
    if (!bookId) return;
    startPurchase(bookId);
  }, [bookId, startPurchase]);

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
    isCreatingOrder,

    // Review modal
    isReviewModalVisible,
    setReviewModalVisible,

    // Payment modal (from useBookPurchase)
    isPaymentModalVisible,
    closePaymentModal: cancelPayment,
    confirmPayment,

    // Actions
    refetch,
    startReading,
    purchaseBook,
    submitReview,
    openRelatedBook,
  };
}
