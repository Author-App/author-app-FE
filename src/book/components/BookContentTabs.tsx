import React from 'react';

import type { Tab } from '@/src/components/core/tabs/hooks/useTabBar';
import { AboutTabContent } from './tabs/AboutTabContent';
import { SynopsisTabContent } from './tabs/SynopsisTabContent';
import { ReviewsTabContent } from './tabs/ReviewsTabContent';
import { MoreBooksTabContent } from './tabs/MoreBooksTabContent';
import type {
  BookResponse,
  RatingStats,
  RelatedBookCardResponse,
} from '@/src/types/api/library.types';

export type BookTabKey = 'about' | 'synopsis' | 'reviews' | 'more';

export const BOOK_TABS: Tab<BookTabKey>[] = [
  { key: 'about', label: 'About' },
  { key: 'synopsis', label: 'Synopsis' },
  { key: 'reviews', label: 'Reviews' },
  { key: 'more', label: 'More Books' },
];

interface BookTabPanelProps {
  activeTab: BookTabKey;
  book: BookResponse;
  moreBooks: RelatedBookCardResponse[];
  ratingStats?: RatingStats;
  hasAccess?: boolean;
  onWriteReview: () => void;
  onBookPress: (bookId: string) => void;
}

/** The content under the tabs. The TabBar lives in the screen so it can stick while scrolling. */
export function BookTabPanel({
  activeTab,
  book,
  moreBooks,
  ratingStats,
  hasAccess,
  onWriteReview,
  onBookPress,
}: BookTabPanelProps) {
  switch (activeTab) {
    case 'about':
      return <AboutTabContent description={book.description} />;
    case 'synopsis':
      return <SynopsisTabContent synopsis={book.synopsis} />;
    case 'reviews':
      return <ReviewsTabContent ratingStats={ratingStats} hasAccess={hasAccess} onWriteReview={onWriteReview} />;
    case 'more':
      return <MoreBooksTabContent books={moreBooks} onBookPress={onBookPress} />;
    default:
      return null;
  }
}
