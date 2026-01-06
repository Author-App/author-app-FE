import { useCallback, useMemo, useState } from 'react';
import { Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import type { Href } from 'expo-router';

import { useGetBooksQuery } from '@/src/store/api/libraryApi';
import type { BookResponse } from '@/src/types/api/library.types';
import type { LibraryTab } from '../types/library.types';

export const useLibraryData = () => {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<LibraryTab>('all');

  const { data, isLoading, isError, refetch } = useGetBooksQuery({});

  const books: BookResponse[] = useMemo(() => {
    if (!data?.data?.books) return [];

    let booksList = [...data.data.books];

    // Filter based on active tab
    switch (activeTab) {
      case 'owned':
        booksList = booksList.filter((book) => book.hasAccess || book.isFree);
        break;
      case 'ebook':
        booksList = booksList.filter((book) => book.type === 'ebook');
        break;
      case 'audiobook':
        booksList = booksList.filter((book) => book.type === 'audiobook');
        break;
      case 'all':
      default:
        // No filter for all books
        break;
    }

    return booksList.sort(
      (a, b) =>
        new Date(b.publishedAt ?? b.createdAt ?? 0).getTime() -
        new Date(a.publishedAt ?? a.createdAt ?? 0).getTime()
    );
  }, [data, activeTab]);

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
