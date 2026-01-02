import React from 'react';
import { YStack, XStack } from 'tamagui';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import UBackButton from '@/src/components/core/buttons/uBackButton';
import AppLoader from '@/src/components/core/loaders/AppLoader';
import UScreenError from '@/src/components/core/feedback/UScreenError';
import RatingModal from '@/src/components/core/modals/ratingModal';
import PaymentModal from '@/src/components/core/modals/paymentModal';

import { useBookDetail } from '@/src/book/hooks/useBookDetail';
import { BookHero } from './BookHero';
import { BookTags } from './BookInfo';
import { BookActions } from './BookActions';
import { BookContentTabs } from './BookContentTabs';
import { MoreBooksSection } from './MoreBooksSection';
import UScreenLayout from '@/src/components/core/layout/UScreenLayout';

export function BookDetailScreen() {
  const { bookId } = useLocalSearchParams<{ bookId: string }>();
  const { top } = useSafeAreaInsets();

  const {
    book,
    moreBooks,
    ratingStats,
    hasAccess,
    isLoading,
    isError,
    isReviewModalVisible,
    isPaymentModalVisible,
    setReviewModalVisible,
    closePaymentModal,
    refetch,
    startReading,
    purchaseBook,
    confirmPayment,
    submitReview,
    openRelatedBook,
  } = useBookDetail(bookId);

  // Loading state
  if (isLoading) {
    return (
      <YStack flex={1} backgroundColor="$brandNavy">
        <XStack pt={top + 8} pb={12} px={16}>
          <UBackButton variant="glass-md" />
        </XStack>
        <AppLoader bg="transparent" />
      </YStack>
    );
  }

  // Error state
  if (isError || !book) {
    return (
      <YStack flex={1} backgroundColor="$brandNavy">
        <XStack pt={top + 8} pb={12} px={16}>
          <UBackButton variant="glass-md" />
        </XStack>
        <UScreenError
          message="Unable to load book details. Please try again."
          onRetry={refetch}
        />
      </YStack>
    );
  }

  return (
    <UScreenLayout flex={1} pt={top + 8}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: 20 }}
      >
        <BookHero 
          book={book} 
          averageRating={ratingStats?.average} 
          totalRatings={ratingStats?.total}
        />

        <BookTags book={book} />

        <BookContentTabs
          book={book}
          ratingStats={ratingStats ?? undefined}
          hasAccess={hasAccess}
          onWriteReview={() => setReviewModalVisible(true)}
        />

        {moreBooks.length > 0 && (
          <MoreBooksSection
            books={moreBooks}
            onBookPress={openRelatedBook}
          />
        )}
      </ScrollView>

      {/* Fixed bottom action button */}
      <BookActions
        book={book}
        hasAccess={hasAccess}
        onStartReading={startReading}
        onPurchase={purchaseBook}
      />

      {/* Modals */}
      <RatingModal
        visible={isReviewModalVisible}
        onClose={() => setReviewModalVisible(false)}
        onSubmit={submitReview}
        allowRating
        allowReview
      />

      <PaymentModal
        visible={isPaymentModalVisible}
        onClose={closePaymentModal}
        onPay={confirmPayment}
      />
    </UScreenLayout>
  );
}
