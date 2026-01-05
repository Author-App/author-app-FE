import React from 'react';
import { YStack } from 'tamagui';

import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import { TabBar } from '@/src/components/core/tabs/TabBar';
import { useTabBar, Tab } from '@/src/components/core/tabs/hooks/useTabBar';
import { AboutTabContent } from './tabs/AboutTabContent';
import { SynopsisTabContent } from './tabs/SynopsisTabContent';
import { ReviewsTabContent } from './tabs/ReviewsTabContent';
import type { BookResponse, RatingStats } from '@/src/types/api/library.types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type BookTabKey = 'about' | 'synopsis' | 'reviews';

const BOOK_TABS: Tab<BookTabKey>[] = [
  { key: 'about', label: 'About' },
  { key: 'synopsis', label: 'Synopsis' },
  { key: 'reviews', label: 'Reviews' },
];

interface BookContentTabsProps {
  book: BookResponse;
  ratingStats?: RatingStats;
  hasAccess?: boolean;
  onWriteReview: () => void;
}

export function BookContentTabs({
  book,
  ratingStats,
  hasAccess,
  onWriteReview,
}: BookContentTabsProps) {
  const {
    activeTab,
    tabMeasurements,
    indicatorX,
    indicatorWidth,
    handleTabLayout,
    handleTabPress,
  } = useTabBar(BOOK_TABS, 'about');
  const {bottom} = useSafeAreaInsets()

  const renderContent = () => {
    switch (activeTab) {
      case 'about':
        return <AboutTabContent description={book.description} />;
      case 'synopsis':
        return <SynopsisTabContent synopsis={book.synopsis} />;
      case 'reviews':
        return (
          <ReviewsTabContent
            ratingStats={ratingStats}
            hasAccess={hasAccess}
            onWriteReview={onWriteReview}
          />
        );
      default:
        return null;
    }
  };

  return (
    <UAnimatedView animation="fadeInUp" delay={300}>
      <YStack mt={24} pb={bottom+20}>
        <TabBar
          tabs={BOOK_TABS}
          activeTab={activeTab}
          onTabPress={handleTabPress}
          tabMeasurements={tabMeasurements}
          onTabLayout={handleTabLayout}
          indicatorX={indicatorX}
          indicatorWidth={indicatorWidth}
          indicatorColor="$brandCrimson"
        />

        <YStack mt={20}>{renderContent()}</YStack>
      </YStack>
    </UAnimatedView>
  );
}
