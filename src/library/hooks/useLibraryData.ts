import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import type { Href } from 'expo-router';

import { useGetBooksQuery } from '@/src/store/api/libraryApi';
import { useAppSelector } from '@/src/store/hooks';
import {
  selectBooksSortedByDate,
  selectOwnedBooks,
  selectEbooks,
  selectAudiobooks,
  selectHardcovers,
  selectPaperbacks,
} from '@/src/store/selectors/librarySelectors';
import type { BookResponse } from '@/src/types/api/library.types';
import type { LibraryTab } from '../types/library.types';

export const useLibraryData = () => {
  const router = useRouter();

  const { tab } = useLocalSearchParams<{ tab?: LibraryTab }>();
  const [activeTab, setActiveTab] = useState<LibraryTab>(tab ?? 'all');

  // Cleared once used, so the next "See all" with the same tab still counts as a change
  useEffect(() => {
    if (!tab) return;
    setActiveTab(tab);
    router.setParams({ tab: undefined });
  }, [tab, router]);

  const { isLoading, isError, refetch } = useGetBooksQuery({});

  // Select data from cache using memoized selectors
  const allBooks = useAppSelector(selectBooksSortedByDate);
  const ownedBooks = useAppSelector(selectOwnedBooks);
  const ebooks = useAppSelector(selectEbooks);
  const audiobooks = useAppSelector(selectAudiobooks);
  const hardcovers = useAppSelector(selectHardcovers);
  const paperbacks = useAppSelector(selectPaperbacks);

  const books: BookResponse[] = useMemo(() => {
    switch (activeTab) {
      case 'owned':
        return ownedBooks;
      case 'ebook':
        return ebooks;
      case 'audiobook':
        return audiobooks;
      case 'hardcover':
        return hardcovers;
      case 'paperback':
        return paperbacks;
      case 'all':
      default:
        return allBooks;
    }
  }, [activeTab, allBooks, ownedBooks, ebooks, audiobooks, hardcovers, paperbacks]);

  // Handlers
  const handleTabChange = useCallback((value: LibraryTab) => {
    setActiveTab(value);
  }, []);

  const navigateToBook = useCallback(
    (bookId: string) => {
      router.push(`/(app)/book/${bookId}` as Href);
    },
    [router]
  );

  return {
    // Data
    books,
    isLoading,
    isError,
    refetch,

    // Filters
    activeTab,
    handleTabChange,

    // Navigation
    navigateToBook,
  };
};
