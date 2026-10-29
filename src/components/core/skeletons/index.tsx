import React from 'react';
import { YStack, XStack } from 'tamagui';
import USkeleton from '../display/uSkeleton';

/**
 * Skeleton component for content cards (blogs, podcasts, videos)
 * Used in lists where content has an image and text
 */
export const ContentCardSkeleton = React.memo(() => (
  <XStack gap="$3" padding="$3" backgroundColor="$glass" borderRadius="$4">
    <USkeleton width={100} height={100} radius={12} />
    <YStack flex={1} gap="$2">
      <USkeleton width="80%" height={16} radius={8} />
      <USkeleton width="60%" height={14} radius={8} />
      <USkeleton width="40%" height={12} radius={8} />
    </YStack>
  </XStack>
));

ContentCardSkeleton.displayName = 'ContentCardSkeleton';
