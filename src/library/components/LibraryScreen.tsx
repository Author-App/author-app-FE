import React, { memo, useCallback } from 'react';
import { XStack, YStack } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTabBarInset } from '@/src/navigations/hooks/useTabBarInset';
import { useLayoutClass } from '@/src/components/core/layout/useLayoutClass';

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

// The iPhone grid predates the shared sizes and keeps its 14pt gap
const COMPACT_GAP = 14;

const LibraryScreen: React.FC = () => {
  const { top } = useSafeAreaInsets();
  const { clearance } = useTabBarInset();
  const { size, side, contentWidth, gridGap, coverMin, columns } = useLayoutClass();
  const gap = size === 'compact' ? COMPACT_GAP : gridGap;
  const numColumns = columns(coverMin);
  const cardWidth = (contentWidth - gap * (numColumns - 1)) / numColumns;

  const {
    books,
    isLoading,
    isError,
    refetch,
    activeTab,
    handleTabChange,
    navigateToBook,
  } = useLibraryData();

  // Render book item
  // FlashList splits the row into equal cells: half a gap on each side of every card
  const renderBookItem = useCallback(
    ({ item }: { item: BookResponse }) => (
      <YStack px={gap / 2}>
        <LibraryBookCard
          book={item}
          onPress={() => {
            haptics.light();
            navigateToBook(item.id);
          }}
        />
      </YStack>
    ),
    [gap, navigateToBook]
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
        <XStack flexWrap="wrap" px={side} pt={20} gap={gap} accessibilityLabel="Loading library">
          {Array.from({ length: numColumns * 2 }, (_, i) => (
            <YStack key={i} w={cardWidth}>
              <USkeleton width="100%" height={cardWidth * 1.5 + 70} radius={16} />
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
          paddingHorizontal: side - gap / 2,
          flexGrow: 1,
        }}
      />
    );
  };

  return (
    <UScreenLayout pt={top}>
      <LibraryHeader px={size === 'compact' ? undefined : side} />
      <LibraryFilters activeTab={activeTab} onTabChange={handleTabChange} inset={side} />

      {renderContent()}
    </UScreenLayout>
  );
};

export default memo(LibraryScreen);
