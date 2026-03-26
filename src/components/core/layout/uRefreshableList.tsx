import React, { useCallback, useState, forwardRef } from 'react';
import { FlashList, FlashListProps } from '@shopify/flash-list';
import { YStack } from 'tamagui';
import { useURefreshControl } from '@/src/components/core/feedback/URefreshControl';
import haptics from '@/src/utils/haptics';

interface URefreshableListProps<T> extends Omit<FlashListProps<T>, 'refreshControl'> {
  onRefresh: () => Promise<void> | void;
}

function URefreshableListInner<T>(
  {
    onRefresh,
    ListHeaderComponent,
    ...props
  }: URefreshableListProps<T>,
  ref: React.ForwardedRef<any>
) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    haptics.medium();
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
      ref={ref}
      ListHeaderComponent={Header}
      {...props}
      {...refreshProps}
    />
  );
}

export const URefreshableList = forwardRef(URefreshableListInner) as <T>(
  props: URefreshableListProps<T> & { ref?: React.ForwardedRef<any> }
) => React.ReactElement;

