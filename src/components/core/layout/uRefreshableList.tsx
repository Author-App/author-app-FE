import React, { useCallback, useState } from 'react';
import { RefreshControl } from 'react-native';
import { FlashList, FlashListProps } from '@shopify/flash-list';
import { getTokenValue } from 'tamagui';

interface URefreshableListProps<T> extends Omit<FlashListProps<T>, 'refreshControl'> {
  onRefresh: () => Promise<void> | void;
}

/**
 * Refreshable list component that wraps FlashList with pull-to-refresh functionality
 * Automatically handles loading state and provides smooth refresh experience
 */
export function URefreshableList<T>({
  onRefresh,
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

  const primaryColor = getTokenValue('$primary7');

  return (
    <FlashList
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={primaryColor}
          colors={[primaryColor]}
        />
      }
      {...props}
    />
  );
}

