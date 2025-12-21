import React from 'react';
import { YStack, XStack } from 'tamagui';
import USkeleton from '../display/uSkeleton';

/**
 * Skeleton component for content cards (blogs, podcasts, videos)
 * Used in lists where content has an image and text
 */
export const ContentCardSkeleton = React.memo(() => (
  <XStack gap="$3" padding="$3" backgroundColor="$neutral2" borderRadius="$4">
    <USkeleton width={100} height={100} radius={12} />
    <YStack flex={1} gap="$2">
      <USkeleton width="80%" height={16} radius={8} />
      <USkeleton width="60%" height={14} radius={8} />
      <USkeleton width="40%" height={12} radius={8} />
    </YStack>
  </XStack>
));

ContentCardSkeleton.displayName = 'ContentCardSkeleton';

/**
 * Skeleton component for book cards in library
 * Used in horizontal scrollable lists
 */
export const BookCardSkeleton = React.memo(() => (
  <YStack width={140} gap="$2">
    <USkeleton width={140} height={200} radius={12} />
    <USkeleton width="90%" height={14} radius={8} />
    <USkeleton width="60%" height={12} radius={8} />
  </YStack>
));

BookCardSkeleton.displayName = 'BookCardSkeleton';

/**
 * Skeleton component for event cards
 * Used in events list with larger image
 */
export const EventCardSkeleton = React.memo(() => (
  <YStack padding="$3" backgroundColor="$neutral2" borderRadius="$4" gap="$2">
    <USkeleton width="100%" height={150} radius={12} />
    <USkeleton width="70%" height={16} radius={8} />
    <XStack gap="$2">
      <USkeleton width={80} height={12} radius={8} />
      <USkeleton width={60} height={12} radius={8} />
    </XStack>
  </YStack>
));

EventCardSkeleton.displayName = 'EventCardSkeleton';

/**
 * Skeleton component for profile header
 * Used in profile/settings screens
 */
export const ProfileHeaderSkeleton = React.memo(() => (
  <YStack alignItems="center" gap="$3" padding="$4">
    <USkeleton width={100} height={100} radius={50} />
    <USkeleton width={150} height={20} radius={8} />
    <USkeleton width={200} height={14} radius={8} />
  </YStack>
));

ProfileHeaderSkeleton.displayName = 'ProfileHeaderSkeleton';

/**
 * Generic list skeleton generator
 * Renders multiple instances of a skeleton component
 */
export const ListSkeleton = React.memo(
  ({
    count = 5,
    SkeletonComponent,
  }: {
    count?: number;
    SkeletonComponent: React.ComponentType;
  }) => (
    <YStack gap="$3" padding="$4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonComponent key={i} />
      ))}
    </YStack>
  )
);

ListSkeleton.displayName = 'ListSkeleton';

