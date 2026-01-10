import { useMemo } from 'react';
import { useGetHomeFeedQuery } from '@/src/store/api/homeApi';
import { useAppSelector } from '@/src/store/hooks';
import {
  selectHomeBanner,
  selectHomeSections,
  selectHomeFeedError,
} from '@/src/store/selectors/homeSelectors';
import type { HomeBanner } from '@/src/types/api/home.types';
import type { BannerItem, HomeSectionItem } from '../types/home.types';

interface UseHomeDataReturn {
  banner: HomeBanner | null;
  homeSections: HomeSectionItem[];
  isLoading: boolean;
  isRefreshing: boolean;
  isError: boolean;
  errorMessage: string | null;
  refetch: () => void;
}

const getErrorMessage = (error: unknown): string | null => {
  if (!error) return null;
  if (typeof error === 'object' && 'data' in error) {
    const data = (error as { data: unknown }).data;
    if (typeof data === 'object' && data && 'message' in data) {
      return (data as { message: string }).message;
    }
  }
  return 'Something went wrong';
};

export const useHomeData = (): UseHomeDataReturn => {
  const { data, isLoading, isFetching, refetch } = useGetHomeFeedQuery();

  const banner = useAppSelector(selectHomeBanner);
  const sections = useAppSelector(selectHomeSections);
  const error = useAppSelector(selectHomeFeedError);

  const { books, audiobooks, articles, continueReading } = useMemo(() => {
    const booksSection = sections.find((s) => s.type === 'books');
    const continueReadingSection = sections.find((s) => s.type === 'continueReading');
    const audiobooksSection = sections.find((s) => s.type === 'audiobooks');
    const articlesSection = sections.find((s) => s.type === 'articles');
    return {
      books: booksSection?.data ?? [],
      audiobooks: audiobooksSection?.data ?? [],
      articles: articlesSection?.data ?? [],
      continueReading: continueReadingSection?.data ?? [],
    };
  }, [sections]);

  const bannerItems = useMemo((): BannerItem[] => {
    const items: BannerItem[] = [];

    if (books.length > 0) {
      items.push({
        id: `banner-book-${books[0].id}`,
        type: 'book',
        title: books[0].title,
        subtitle: 'New Release',
        image: books[0].image,
        label: 'New Book',
      });
    }

    if (audiobooks.length > 0) {
      items.push({
        id: `banner-audiobook-${audiobooks[0].id}`,
        type: 'audiobook',
        title: audiobooks[0].title,
        subtitle: 'Listen Now',
        image: audiobooks[0].image,
        label: 'Audiobook',
      });
    }

    if (articles.length > 0) {
      items.push({
        id: `banner-article-${articles[0].id}`,
        type: 'article',
        title: articles[0].title,
        subtitle: 'Featured Read',
        image: articles[0].image,
        label: 'Article',
      });
    }

    return items;
  }, [books, audiobooks, articles]);

  const homeSections = useMemo((): HomeSectionItem[] => {
    const items: HomeSectionItem[] = [];

    if (bannerItems.length > 0) {
      items.push({ type: 'banner', data: bannerItems });
    }

    if (continueReading.length > 0) {
      items.push({
        type: 'continueReading',
        title: 'Continue Reading',
        subtitle: 'Pick up where you left off',
        data: continueReading,
      });
    }

    if (books.length > 0) {
      items.push({
        type: 'books',
        title: 'Featured Books',
        subtitle: 'Handpicked for you',
        data: books,
      });
    }

    if (audiobooks.length > 0) {
      items.push({
        type: 'audiobooks',
        title: 'Audiobooks',
        subtitle: 'Listen on the go',
        data: audiobooks,
      });
    }

    if (articles.length > 0) {
      items.push({
        type: 'articles',
        title: 'Latest Articles',
        subtitle: 'Insights & Stories',
        data: articles,
      });
    }
    
    return items;
  }, [bannerItems, books, audiobooks, articles]);

  return {
    banner,
    homeSections,
    isLoading,
    isRefreshing: isFetching && !isLoading,
    isError: !!error,
    errorMessage: getErrorMessage(error),
    refetch,
  };
};
