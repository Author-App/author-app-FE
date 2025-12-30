import { useCallback, useMemo, useState } from 'react';
import { Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import type { Href } from 'expo-router';

import { useGetBooksQuery } from '@/src/store/api/libraryApi';
import type { BookResponse } from '@/src/types/api/library.types';
import type { BookType } from '../types/library.types';

export const useLibraryData = () => {
  const router = useRouter();

  const [activeType, setActiveType] = useState<BookType>('');

  const { data, isLoading, isError, refetch } = useGetBooksQuery({});

  const books: BookResponse[] = useMemo(() => {
    if (!data?.data?.books) return [];

    let booksList = [...data.data.books];

    if (activeType) {
      booksList = booksList.filter((book) => book.type === activeType);
    }

    return booksList.sort(
      (a, b) =>
        new Date(b.publishedAt ?? b.createdAt ?? 0).getTime() -
        new Date(a.publishedAt ?? a.createdAt ?? 0).getTime()
    );
  }, [data, activeType]);

  const screenWidth = Dimensions.get('window').width;
  const numColumns = useMemo(() => {
    if (screenWidth > 900) return 4;
    if (screenWidth > 600) return 3;
    return 2;
  }, [screenWidth]);

  // Handlers
  const handleTypeChange = useCallback((value: string) => {
    if (value === 'ebook' || value === 'audiobook' || value === '') {
      setActiveType(value);
    }
  }, []);

  const navigateToBook = useCallback(
    (bookId: string) => {
      router.push({
        pathname: '/(app)/bookDetail/[id]',
        params: { id: bookId },
      } as unknown as Href);
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
    activeType,
    handleTypeChange,

    // Layout
    numColumns,

    // Navigation
    navigateToBook,
  };
};
