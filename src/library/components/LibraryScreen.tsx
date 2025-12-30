import React, { memo, useCallback } from 'react';
import { YStack } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppLoader from '@/src/components/core/loaders/AppLoader';
import { URefreshableList } from '@/src/components/core/layout/uRefreshableList';
import LibraryHeader from './LibraryHeader';
import LibraryFilters from './LibraryFilters';
import LibraryBookCard from './LibraryBookCard';
import LibraryEmptyState from './LibraryEmptyState';
import UScreenError from '@/src/components/core/feedback/UScreenError';
import { useLibraryData } from '../hooks/useLibraryData';
import type { BookResponse } from '@/src/types/api/library.types';

const LibraryScreen: React.FC = () => {
  const { top, bottom } = useSafeAreaInsets();

  const {
    books,
    isLoading,
    isError,
    refetch,
    activeType,
    handleTypeChange,
    numColumns,
    navigateToBook,
  } = useLibraryData();

  // Render book item
  const renderBookItem = useCallback(
    ({ item, index }: { item: BookResponse; index: number }) => (
      <LibraryBookCard
        book={item}
        index={index}
        numColumns={numColumns}
        onPress={() => navigateToBook(item.id)}
      />
    ),
    [numColumns, navigateToBook]
  );

  const renderEmpty = useCallback(() => {
    if (isLoading) return null;
    return <LibraryEmptyState isFiltered={!!activeType} />;
  }, [activeType, isLoading]);


  const handleRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  // Content renderer
  const renderContent = () => {
    if (isLoading && books.length === 0) {
      return (
        <YStack jc="center" ai="center" flex={1} pb={64 + Math.max(bottom, 24)}>
          <AppLoader size={150} />
        </YStack>
      );
    }

    if (isError) {
      return <UScreenError message="We couldn't load your library. Please check your connection and try again." onRetry={refetch} pb={64 + Math.max(bottom, 24)} />;
    }

    return (
      <URefreshableList
        data={books}
        renderItem={renderBookItem}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        key={`${numColumns}-${activeType}`}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        onRefresh={handleRefresh}
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: 64 + Math.max(bottom, 24),
          flexGrow: 1,
        }}
      />
    );
  };

  return (
    <YStack flex={1} bg="$brandNavy" pt={top}>
      <LibraryHeader />
      <LibraryFilters
        activeType={activeType}
        onTypeChange={handleTypeChange}
        mb={8}
        px={20}
      />

      {renderContent()}
    </YStack>
  );
};

export default memo(LibraryScreen);
