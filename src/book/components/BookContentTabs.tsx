import React from 'react';
import { YStack } from 'tamagui';

import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import { TabBar } from '@/src/components/core/tabs/TabBar';
import { useTabBar, Tab } from '@/src/components/core/tabs/hooks/useTabBar';
import { AboutTabContent } from './tabs/AboutTabContent';
import { SynopsisTabContent } from './tabs/SynopsisTabContent';
import { ReviewsTabContent } from './tabs/ReviewsTabContent';
import { MoreBooksTabContent } from './tabs/MoreBooksTabContent';
import type {
  BookResponse,
  RatingStats,
  RelatedBookCardResponse,
} from '@/src/types/api/library.types';

type BookTabKey = 'about' | 'synopsis' | 'reviews' | 'more';

const BOOK_TABS: Tab<BookTabKey>[] = [
  { key: 'about', label: 'About' },
  { key: 'synopsis', label: 'Synopsis' },
  { key: 'reviews', label: 'Reviews' },
  { key: 'more', label: 'More Books' },
];

interface BookContentTabsProps {
  book: BookResponse;
  moreBooks: RelatedBookCardResponse[];
  ratingStats?: RatingStats;
  hasAccess?: boolean;
  onWriteReview: () => void;
  onBookPress: (bookId: string) => void;
}

export function BookContentTabs({
  book,
  moreBooks,
  ratingStats,
  hasAccess,
  onWriteReview,
  onBookPress,
}: BookContentTabsProps) {
  const {
    activeTab,
    tabMeasurements,
    indicatorX,
    indicatorWidth,
    handleTabLayout,
    handleTabPress,
  } = useTabBar(BOOK_TABS, 'about');

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
      case 'more':
        return <MoreBooksTabContent books={moreBooks} onBookPress={onBookPress} />;
      default:
        return null;
    }
  };

  return (
    <UAnimatedView animation="fadeInUp" delay={300}>
      <YStack mt={24}>
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

        <YStack mt={20} px={20}>{renderContent()}</YStack>
      </YStack>
    </UAnimatedView>
  );
}
