import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { YStack } from 'tamagui';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import UBackButton from '@/src/components/core/buttons/uBackButton';
import USkeleton from '@/src/components/core/display/uSkeleton';
import UScreenError from '@/src/components/core/feedback/UScreenError';
import RatingModal from '@/src/components/core/modals/ratingModal';
import UScreenLayout from '@/src/components/core/layout/UScreenLayout';
import UStickyTitleBar, { STICKY_BAR_HEIGHT } from '@/src/components/core/layout/uStickyTitleBar';
import { TabBar } from '@/src/components/core/tabs/TabBar';
import { useTabBar } from '@/src/components/core/tabs/hooks/useTabBar';
import { haptics } from '@/src/utils/haptics';

import { useBookDetail } from '@/src/book/hooks/useBookDetail';
import { BookHero } from './BookHero';
import { BookActions } from './BookActions';
import { BOOK_TABS, BookTabPanel } from './BookContentTabs';

// Clears the fixed action bar: 14 top + 52 button + the home indicator, plus room to breathe
const ACTION_BAR_CLEARANCE = 120;

export function BookDetailScreen() {
  const { bookId } = useLocalSearchParams<{ bookId: string }>();
  const { top, bottom } = useSafeAreaInsets();
  const tabs = useTabBar(BOOK_TABS, 'about');

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

  const scrollY = useSharedValue(0);
  // Measured, not hard-coded: the hero grows with a two-line title or wrapped tags
  const heroHeight = useSharedValue(400);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });
  const backButton = (
    <YStack pos="absolute" top={top + 8} left={16} zIndex={2}>
      <UBackButton variant="glass-md" />
    </YStack>
  );

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

  return (
    <UScreenLayout>
      {/* Hero glow behind the cover. Static, not a live blur. */}
      <LinearGradient colors={['#120A2A', 'rgba(2,1,3,0)']} style={styles.heroGlow} pointerEvents="none" />

      <UStickyTitleBar scrollY={scrollY} showTitleAt={heroHeight} title={book.title} thumbnail={book.thumbnail ?? ''} />

      <Animated.ScrollView
        style={{ marginTop: top + STICKY_BAR_HEIGHT }}
        contentContainerStyle={{ paddingBottom: bottom + ACTION_BAR_CLEARANCE }}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        // Child 1 is the tab row: it sticks right under the bar
        stickyHeaderIndices={[1]}
      >
        {/* Spacing lives here, not on the sticky row: a margin there sticks too, as a gap */}
        <YStack pb={20} onLayout={(e) => (heroHeight.value = e.nativeEvent.layout.height)}>
          <BookHero book={book} averageRating={ratingStats?.average} totalRatings={ratingStats?.total} />
        </YStack>

        {/* Opaque, so content scrolls behind the tabs instead of through them */}
        <YStack bg="$bgPage">
          <TabBar
            tabs={BOOK_TABS}
            activeTab={tabs.activeTab}
            onTabPress={tabs.handleTabPress}
            tabMeasurements={tabs.tabMeasurements}
            onTabLayout={tabs.handleTabLayout}
            indicatorX={tabs.indicatorX}
            indicatorWidth={tabs.indicatorWidth}
          />
        </YStack>

        <YStack mt={16} px={16}>
          <BookTabPanel
            activeTab={tabs.activeTab}
            book={book}
            moreBooks={moreBooks}
            ratingStats={ratingStats ?? undefined}
            hasAccess={hasAccess}
            onWriteReview={() => {
              haptics.medium();
              setReviewModalVisible(true);
            }}
            onBookPress={openRelatedBook}
          />
        </YStack>
      </Animated.ScrollView>

      <BookActions
        book={book}
        hasAccess={hasAccess}
        isPurchasing={isPurchasing}
        onStartReading={startReading}
        onPurchase={purchaseBook}
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

const styles = StyleSheet.create({
  heroGlow: { position: 'absolute', top: 0, left: 0, right: 0, height: 420 },
});
