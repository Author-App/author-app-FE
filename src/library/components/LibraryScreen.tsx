import React, { memo, useCallback } from 'react';
import { Dimensions } from 'react-native';
import { XStack, YStack } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTabBarInset } from '@/src/navigations/hooks/useTabBarInset';

import USkeleton from '@/src/components/core/display/uSkeleton';
import { URefreshableList } from '@/src/components/core/layout/uRefreshableList';
import UScreenLayout from '@/src/components/core/layout/UScreenLayout';
import haptics from '@/src/utils/haptics';
import LibraryHeader from './LibraryHeader';
import LibraryFilters from './LibraryFilters';
import LibraryBookCard from './LibraryBookCard';
import LibraryEmptyState from './LibraryEmptyState';
import UScreenError from '@/src/components/core/feedback/UScreenError';
import { useLibraryData } from '../hooks/useLibraryData';
import type { BookResponse } from '@/src/types/api/library.types';

// Two columns inside the 16pt gutters with a 14pt gap, the same grid as the cards
const SKELETON_WIDTH = (Dimensions.get('window').width - 16 * 2 - 14) / 2;

const LibraryScreen: React.FC = () => {
  const { top } = useSafeAreaInsets();
  const { clearance } = useTabBarInset();

  const {
    books,
    isLoading,
    isError,
    refetch,
    activeTab,
    handleTabChange,
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
        onPress={() => {
          haptics.light();
          navigateToBook(item.id);
        }}
      />
    ),
    [numColumns, navigateToBook]
  );

  const renderEmpty = useCallback(() => {
    if (isLoading) return null;
    return <LibraryEmptyState isFiltered={activeTab !== 'all'} />;
  }, [activeTab, isLoading]);


  const handleRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  // Content renderer
  const renderContent = () => {
    if (isLoading && books.length === 0) {
      return (
        <XStack flexWrap="wrap" px={16} pt={20} gap={14} accessibilityLabel="Loading library">
          {[0, 1, 2, 3].map((i) => (
            <YStack key={i} w={SKELETON_WIDTH}>
              <USkeleton width="100%" height={SKELETON_WIDTH * 1.5 + 70} radius={16} />
            </YStack>
          ))}
        </XStack>
      );
    }

    if (isError) {
      return <UScreenError message="We couldn't load your library. Please check your connection and try again." onRetry={refetch} pb={clearance} />;
    }

    return (
      <URefreshableList
        data={books}
        renderItem={renderBookItem}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        key={`${numColumns}-${activeTab}`}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        onRefresh={handleRefresh}
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: clearance,
          flexGrow: 1,
        }}
      />
    );
  };

  return (
    <UScreenLayout pt={top}>
      <LibraryHeader />
      <LibraryFilters activeTab={activeTab} onTabChange={handleTabChange} />

      {renderContent()}
    </UScreenLayout>
  );
};

export default memo(LibraryScreen);
