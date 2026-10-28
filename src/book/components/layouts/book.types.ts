import type { useBookDetail } from '../../hooks/useBookDetail';
import type { useTabBar } from '@/src/components/core/tabs/hooks/useTabBar';
import type { BookTabKey } from '../BookContentTabs';

type Detail = ReturnType<typeof useBookDetail>;

export interface BookLayoutProps {
  book: NonNullable<Detail['book']>;
  moreBooks: Detail['moreBooks'];
  ratingStats: Detail['ratingStats'];
  hasAccess: Detail['hasAccess'];
  isPurchasing: Detail['isPurchasing'];
  tabs: ReturnType<typeof useTabBar<BookTabKey>>;
  onStartReading: () => void;
  onPurchase: () => void;
  onWriteReview: () => void;
  onBookPress: (bookId: string) => void;
}
