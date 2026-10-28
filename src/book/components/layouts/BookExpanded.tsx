import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { XStack, YStack } from 'tamagui';
import { useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import UStickyTitleBar, { STICKY_BAR_HEIGHT } from '@/src/components/core/layout/uStickyTitleBar';
import USkeleton from '@/src/components/core/display/uSkeleton';
import { TabBar } from '@/src/components/core/tabs/TabBar';
import { useLayoutClass } from '@/src/components/core/layout/useLayoutClass';
import { PANE_GAP, paneWidth } from '@/src/components/core/layout/layout';
import { BookHero } from '../BookHero';
import { BookActions } from '../BookActions';
import { BOOK_TABS, BookTabPanel } from '../BookContentTabs';
import type { BookLayoutProps } from './book.types';

const PANE_COVER_WIDTH = 300;

/** Two panes: the book and its action stay still on the left; the tabs stick and their content scrolls on the right. */
const BookExpanded = ({ book, moreBooks, ratingStats, hasAccess, isPurchasing, tabs, onStartReading, onPurchase, onWriteReview, onBookPress }: BookLayoutProps) => {
  const { top, bottom } = useSafeAreaInsets();
  const { side, contentWidth } = useLayoutClass();
  const pane = paneWidth(contentWidth);
  const contentPane = contentWidth - pane - PANE_GAP;
  const scrollY = useSharedValue(0);

  return (
    <>
      <LinearGradient colors={['#120A2A', 'rgba(2,1,3,0)']} style={styles.heroGlow} pointerEvents="none" />
      <UStickyTitleBar scrollY={scrollY} />

      <XStack flex={1} mt={top + STICKY_BAR_HEIGHT} px={side} gap={PANE_GAP}>
        {/* Its own scroll only matters when a long title or Larger Text makes it taller than the window */}
        <ScrollView
          style={{ width: pane, flexGrow: 0 }}
          contentContainerStyle={{ paddingBottom: bottom + 24 }}
          showsVerticalScrollIndicator={false}
        >
          <BookHero
            book={book}
            averageRating={ratingStats?.average}
            totalRatings={ratingStats?.total}
            coverWidth={PANE_COVER_WIDTH}
            px={0}
          >
            <BookActions
              book={book}
              hasAccess={hasAccess}
              isPurchasing={isPurchasing}
              onStartReading={onStartReading}
              onPurchase={onPurchase}
              inline
            />
          </BookHero>
        </ScrollView>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: bottom + 40 }}
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={[0]}
        >
          {/* Solid, so the text scrolls under the card and never through the tabs */}
          <YStack bg="$glassSolid" br={16} px={16} borderWidth={1} borderColor="$glassBorder">
            <TabBar
              tabs={BOOK_TABS}
              activeTab={tabs.activeTab}
              onTabPress={tabs.handleTabPress}
              tabMeasurements={tabs.tabMeasurements}
              onTabLayout={tabs.handleTabLayout}
              indicatorX={tabs.indicatorX}
              indicatorWidth={tabs.indicatorWidth}
              inset={0}
              spread={false}
            />
          </YStack>
          <YStack mt={24}>
            <BookTabPanel
              activeTab={tabs.activeTab}
              book={book}
              moreBooks={moreBooks}
              ratingStats={ratingStats ?? undefined}
              hasAccess={hasAccess}
              onWriteReview={onWriteReview}
              onBookPress={onBookPress}
              width={contentPane}
            />
          </YStack>
        </ScrollView>
      </XStack>
    </>
  );
};

/** The loading shape of BookExpanded. */
export const BookExpandedSkeleton = () => {
  const { top } = useSafeAreaInsets();
  const { side, contentWidth } = useLayoutClass();

  return (
    <XStack flex={1} mt={top + STICKY_BAR_HEIGHT} px={side} gap={PANE_GAP}>
      <YStack w={paneWidth(contentWidth)} ai="center" gap={14}>
        <USkeleton width={PANE_COVER_WIDTH} height={PANE_COVER_WIDTH * 1.5} radius={14} />
        <USkeleton width={240} height={24} radius={8} mt={6} />
        <USkeleton width={120} height={14} radius={7} />
        <USkeleton width={160} height={16} radius={8} />
        <USkeleton width="100%" height={56} radius={28} mt={16} />
      </YStack>
      <YStack flex={1} gap={14}>
        <USkeleton width="100%" height={44} radius={8} />
        <USkeleton width="100%" height={14} radius={7} mt={16} />
        <USkeleton width="92%" height={14} radius={7} />
        <USkeleton width="70%" height={14} radius={7} />
      </YStack>
    </XStack>
  );
};

const styles = StyleSheet.create({
  heroGlow: { position: 'absolute', top: 0, left: 0, right: 0, height: 420 },
});

export default BookExpanded;
