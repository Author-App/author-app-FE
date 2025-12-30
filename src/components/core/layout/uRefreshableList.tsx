import React, { useCallback, useState } from 'react';
import { FlashList, FlashListProps } from '@shopify/flash-list';
import { YStack } from 'tamagui';
import { useURefreshControl } from '@/src/components/core/feedback/URefreshControl';

interface URefreshableListProps<T> extends Omit<FlashListProps<T>, 'refreshControl'> {
  onRefresh: () => Promise<void> | void;
}

export function URefreshableList<T>({
  onRefresh,
  ListHeaderComponent,
  ...props
}: URefreshableListProps<T>) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  }, [onRefresh]);

  const { refreshControl, refreshProps } = useURefreshControl({
    refreshing,
    onRefresh: handleRefresh,
  });

  const Header = ListHeaderComponent ? (
    <YStack>
      {refreshControl}
      {ListHeaderComponent}
    </YStack>
  ) : (
    <YStack>{refreshControl}</YStack>
  );

  return (
    <FlashList
      ListHeaderComponent={Header}
      {...props}
      {...refreshProps}
    />
  );
}

