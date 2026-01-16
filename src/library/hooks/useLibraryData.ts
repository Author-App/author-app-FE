import { useCallback, useMemo, useState } from 'react';
import { Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import type { Href } from 'expo-router';

import { useGetBooksQuery } from '@/src/store/api/libraryApi';
import { useAppSelector } from '@/src/store/hooks';
import {
  selectBooksSortedByDate,
  selectOwnedBooks,
  selectEbooks,
  selectAudiobooks,
} from '@/src/store/selectors/librarySelectors';
import type { BookResponse } from '@/src/types/api/library.types';
import type { LibraryTab } from '../types/library.types';

export const useLibraryData = () => {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<LibraryTab>('all');

  const { isLoading, isError, refetch } = useGetBooksQuery({});

  // Select data from cache using memoized selectors
  const allBooks = useAppSelector(selectBooksSortedByDate);
  const ownedBooks = useAppSelector(selectOwnedBooks);
  const ebooks = useAppSelector(selectEbooks);
  const audiobooks = useAppSelector(selectAudiobooks);

  const books: BookResponse[] = useMemo(() => {
    switch (activeTab) {
      case 'owned':
        return ownedBooks;
      case 'ebook':
        return ebooks;
      case 'audiobook':
        return audiobooks;
      case 'all':
      default:
        return allBooks;
    }
  }, [activeTab, allBooks, ownedBooks, ebooks, audiobooks]);

  const screenWidth = Dimensions.get('window').width;
  const numColumns = useMemo(() => {
    if (screenWidth > 900) return 4;
    if (screenWidth > 600) return 3;
    return 2;
  }, [screenWidth]);

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

    // Layout
    numColumns,

    // Navigation
    navigateToBook,
  };
};
