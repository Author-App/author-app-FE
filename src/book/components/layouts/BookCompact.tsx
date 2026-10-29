import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { YStack } from 'tamagui';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import UStickyTitleBar, { STICKY_BAR_HEIGHT } from '@/src/components/core/layout/uStickyTitleBar';
import { TabBar } from '@/src/components/core/tabs/TabBar';
import { useLayoutClass } from '@/src/components/core/layout/useLayoutClass';
import { BookHero } from '../BookHero';
import { BookActions } from '../BookActions';
import { BOOK_TABS, BookTabPanel } from '../BookContentTabs';
import type { BookLayoutProps } from './book.types';

// Clears the fixed action bar: 14 top + 52 button + the home indicator, plus room to breathe
const ACTION_BAR_CLEARANCE = 120;
const MEDIUM_COVER_WIDTH = 232;

/**
 * One scroll with the tab row sticking under the bar. iPhone: centred hero, docked action bar.
 * Medium: cover beside the details, the action inline in them.
 */
const BookCompact = ({ book, moreBooks, ratingStats, hasAccess, isPurchasing, tabs, onStartReading, onPurchase, onWriteReview, onBookPress }: BookLayoutProps) => {
  const { top, bottom } = useSafeAreaInsets();
  const { size, side, contentWidth } = useLayoutClass();
  const isCompact = size === 'compact';
  const px = isCompact ? 16 : side;

  const scrollY = useSharedValue(0);
  // Measured, not hard-coded: the hero grows with a two-line title or wrapped tags
  const heroHeight = useSharedValue(400);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });

  const actions = (inline: boolean) => (
    <BookActions
      book={book}
      hasAccess={hasAccess}
      isPurchasing={isPurchasing}
      onStartReading={onStartReading}
      onPurchase={onPurchase}
      inline={inline}
    />
  );

  return (
    <>
      {/* Hero glow behind the cover. Static, not a live blur. */}
      <LinearGradient colors={['#120A2A', 'rgba(2,1,3,0)']} style={styles.heroGlow} pointerEvents="none" />

      <UStickyTitleBar scrollY={scrollY} showTitleAt={heroHeight} title={book.title} thumbnail={book.thumbnail ?? ''} />

      <Animated.ScrollView
        style={{ marginTop: top + STICKY_BAR_HEIGHT }}
        contentContainerStyle={{ paddingBottom: bottom + (isCompact ? ACTION_BAR_CLEARANCE : 40) }}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        // Child 1 is the tab row: it sticks right under the bar
        stickyHeaderIndices={[1]}
      >
        {/* Spacing lives here, not on the sticky row: a margin there sticks too, as a gap */}
        <YStack pb={isCompact ? 20 : 40} px={isCompact ? 0 : side} onLayout={(e) => (heroHeight.value = e.nativeEvent.layout.height)}>
          {isCompact ? (
            <BookHero book={book} averageRating={ratingStats?.average} totalRatings={ratingStats?.total} />
          ) : (
            <BookHero
              book={book}
              averageRating={ratingStats?.average}
              totalRatings={ratingStats?.total}
              variant="side"
              coverWidth={MEDIUM_COVER_WIDTH}
            >
              {actions(true)}
            </BookHero>
          )}
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
            inset={px}
            spread={isCompact}
          />
        </YStack>

        <YStack mt={isCompact ? 16 : 20} px={px}>
          <BookTabPanel
            activeTab={tabs.activeTab}
            book={book}
            moreBooks={moreBooks}
            ratingStats={ratingStats ?? undefined}
            hasAccess={hasAccess}
            onWriteReview={onWriteReview}
            onBookPress={onBookPress}
            width={contentWidth}
          />
        </YStack>
      </Animated.ScrollView>

      {isCompact && actions(false)}
    </>
  );
};

const styles = StyleSheet.create({
  heroGlow: { position: 'absolute', top: 0, left: 0, right: 0, height: 420 },
});

export default BookCompact;
