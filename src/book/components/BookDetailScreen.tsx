import React from 'react';
import { YStack } from 'tamagui';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import UBackButton from '@/src/components/core/buttons/uBackButton';
import USkeleton from '@/src/components/core/display/uSkeleton';
import UScreenError from '@/src/components/core/feedback/UScreenError';
import RatingModal from '@/src/components/core/modals/ratingModal';
import UScreenLayout from '@/src/components/core/layout/UScreenLayout';
import { useLayoutClass } from '@/src/components/core/layout/useLayoutClass';
import { useTabBar } from '@/src/components/core/tabs/hooks/useTabBar';
import { haptics } from '@/src/utils/haptics';

import { useBookDetail } from '@/src/book/hooks/useBookDetail';
import { BOOK_TABS } from './BookContentTabs';
import BookCompact from './layouts/BookCompact';
import BookExpanded, { BookExpandedSkeleton } from './layouts/BookExpanded';

export function BookDetailScreen() {
  const { bookId } = useLocalSearchParams<{ bookId: string }>();
  const { top, bottom } = useSafeAreaInsets();
  const tabs = useTabBar(BOOK_TABS, 'about');
  const { size } = useLayoutClass();

  const {
    book,
    moreBooks,
    ratingStats,
    hasAccess,
    isLoading,
    isError,
    isPurchasing,
    isReviewModalVisible,
    setReviewModalVisible,
    refetch,
    startReading,
    purchaseBook,
    submitReview,
    openRelatedBook,
  } = useBookDetail(bookId);

  const backButton = (
    <YStack pos="absolute" top={top + 8} left={16} zIndex={2}>
      <UBackButton variant="glass-md" />
    </YStack>
  );

  if (isLoading && size === 'expanded') {
    return (
      <UScreenLayout>
        {backButton}
        <BookExpandedSkeleton />
      </UScreenLayout>
    );
  }

  if (isLoading) {
    return (
      <UScreenLayout pt={top + 25} ai="center" gap={14}>
        {backButton}
        <USkeleton width={168} height={252} radius={14} />
        <USkeleton width={220} height={22} radius={8} mt={6} />
        <USkeleton width={120} height={14} radius={7} />
        <USkeleton width={160} height={16} radius={8} />
      </UScreenLayout>
    );
  }

  if (isError || !book) {
    return (
      <UScreenLayout pt={top} pb={bottom}>
        {backButton}
        <UScreenError message="Unable to load book details. Please try again." onRetry={refetch} />
      </UScreenLayout>
    );
  }

  const Layout = size === 'expanded' ? BookExpanded : BookCompact;

  return (
    <UScreenLayout>
      <Layout
        book={book}
        moreBooks={moreBooks}
        ratingStats={ratingStats}
        hasAccess={hasAccess}
        isPurchasing={isPurchasing}
        tabs={tabs}
        onStartReading={startReading}
        onPurchase={purchaseBook}
        onWriteReview={() => {
          haptics.medium();
          setReviewModalVisible(true);
        }}
        onBookPress={openRelatedBook}
      />

      <RatingModal
        visible={isReviewModalVisible}
        onClose={() => setReviewModalVisible(false)}
        onSubmit={submitReview}
        bookTitle={book.title}
      />
    </UScreenLayout>
  );
}
