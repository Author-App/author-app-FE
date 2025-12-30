import React, { useCallback, useState } from 'react';
import { RefreshControl } from 'react-native';
import { FlashList, FlashListProps } from '@shopify/flash-list';
import { getTokenValue } from 'tamagui';

interface URefreshableListProps<T> extends Omit<FlashListProps<T>, 'refreshControl'> {
  onRefresh: () => Promise<void> | void;
}

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

  const primaryColor = getTokenValue('$neutral1');

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

