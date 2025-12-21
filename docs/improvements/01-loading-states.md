# Loading States Improvements

## Current Problems

1. **Explore screen** shows plain "Loading..." text instead of skeletons
2. **Detail pages** show "Loading..." or nothing while fetching
3. **No shimmer effect** on image placeholders
4. **No pull-to-refresh** on list screens
5. **Home screen** has skeletons but others don't

## Required Components

### Task 1: Create Reusable Skeleton Components

**File to create:** `src/components/core/skeletons/index.tsx`

```tsx
import React from 'react';
import { YStack, XStack } from 'tamagui';
import { USkeleton } from '../display/uSkeleton';

// Card skeleton for content lists (blogs, podcasts, videos)
export const ContentCardSkeleton = React.memo(() => (
  <XStack gap="$3" padding="$3" backgroundColor="$neutral2" borderRadius="$4">
    <USkeleton width={100} height={100} borderRadius="$3" />
    <YStack flex={1} gap="$2">
      <USkeleton width="80%" height={16} borderRadius="$2" />
      <USkeleton width="60%" height={14} borderRadius="$2" />
      <USkeleton width="40%" height={12} borderRadius="$2" />
    </YStack>
  </XStack>
));

// Book card skeleton for library
export const BookCardSkeleton = React.memo(() => (
  <YStack width={140} gap="$2">
    <USkeleton width={140} height={200} borderRadius="$3" />
    <USkeleton width="90%" height={14} borderRadius="$2" />
    <USkeleton width="60%" height={12} borderRadius="$2" />
  </YStack>
));

// Event card skeleton
export const EventCardSkeleton = React.memo(() => (
  <YStack padding="$3" backgroundColor="$neutral2" borderRadius="$4" gap="$2">
    <USkeleton width="100%" height={150} borderRadius="$3" />
    <USkeleton width="70%" height={16} borderRadius="$2" />
    <XStack gap="$2">
      <USkeleton width={80} height={12} borderRadius="$2" />
      <USkeleton width={60} height={12} borderRadius="$2" />
    </XStack>
  </YStack>
));

// Profile header skeleton
export const ProfileHeaderSkeleton = React.memo(() => (
  <YStack alignItems="center" gap="$3" padding="$4">
    <USkeleton width={100} height={100} borderRadius={50} />
    <USkeleton width={150} height={20} borderRadius="$2" />
    <USkeleton width={200} height={14} borderRadius="$2" />
  </YStack>
));

// List skeleton generator
export const ListSkeleton = React.memo(({ 
  count = 5, 
  SkeletonComponent 
}: { 
  count?: number; 
  SkeletonComponent: React.ComponentType 
}) => (
  <YStack gap="$3" padding="$4">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonComponent key={i} />
    ))}
  </YStack>
));

ContentCardSkeleton.displayName = 'ContentCardSkeleton';
BookCardSkeleton.displayName = 'BookCardSkeleton';
EventCardSkeleton.displayName = 'EventCardSkeleton';
ProfileHeaderSkeleton.displayName = 'ProfileHeaderSkeleton';
ListSkeleton.displayName = 'ListSkeleton';
```

### Task 2: Add Shimmer Loading to Image Component

**File to modify:** `src/components/core/image/uImage.tsx`

Add a loading state with shimmer effect before image loads:

```tsx
import { useState } from 'react';
import { Image, YStack } from 'tamagui';
import { USkeleton } from '../display/uSkeleton';

interface UImageProps {
  source: { uri: string } | number;
  width: number;
  height: number;
  borderRadius?: number;
  // ... other props
}

export const UImage = React.memo(({ source, width, height, borderRadius, ...props }: UImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <YStack width={width} height={height} borderRadius={borderRadius}>
      {isLoading && (
        <USkeleton 
          width={width} 
          height={height} 
          borderRadius={borderRadius} 
          position="absolute"
          zIndex={1}
        />
      )}
      <Image
        source={source}
        width={width}
        height={height}
        borderRadius={borderRadius}
        onLoadEnd={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        opacity={isLoading ? 0 : 1}
        {...props}
      />
      {hasError && (
        <YStack 
          position="absolute" 
          width={width} 
          height={height} 
          backgroundColor="$neutral3"
          alignItems="center"
          justifyContent="center"
          borderRadius={borderRadius}
        >
          {/* Add placeholder icon or text */}
        </YStack>
      )}
    </YStack>
  );
});
```

### Task 3: Implement Pull-to-Refresh

**File to create:** `src/components/core/layout/uRefreshableList.tsx`

```tsx
import React, { useCallback, useState } from 'react';
import { RefreshControl } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { colors } from '@/constants/colors';

interface URefreshableListProps<T> {
  data: T[];
  renderItem: ({ item, index }: { item: T; index: number }) => React.ReactElement;
  onRefresh: () => Promise<void>;
  estimatedItemSize: number;
  // ... other FlashList props
}

export function URefreshableList<T>({
  data,
  renderItem,
  onRefresh,
  estimatedItemSize,
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

  return (
    <FlashList
      data={data}
      renderItem={renderItem}
      estimatedItemSize={estimatedItemSize}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={colors.primary7}
          colors={[colors.primary7]}
        />
      }
      {...props}
    />
  );
}
```

### Task 4: Update Explore Screen Loading

**File to modify:** `app/(app)/(tabs)/explore/index.tsx`

Replace the "Loading..." text with skeleton loaders:

```tsx
// In the loading section of each tab, replace:
// {isLoading && <UText>Loading...</UText>}

// With:
{isLoading && (
  <ListSkeleton count={5} SkeletonComponent={ContentCardSkeleton} />
)}
```

### Task 5: Update Detail Pages Loading

**Files to modify:**
- `app/(app)/blogDetails/[id]/index.tsx`
- `app/(app)/podcastDetail/[id]/index.tsx`
- `app/(app)/videoDetails/[id]/index.tsx`
- `app/(app)/bookDetail/[id]/index.tsx`

Add skeleton loading states:

```tsx
// Create detail page skeleton
const DetailPageSkeleton = () => (
  <YStack flex={1} backgroundColor="$background">
    <USkeleton width="100%" height={250} />
    <YStack padding="$4" gap="$3">
      <USkeleton width="80%" height={24} borderRadius="$2" />
      <USkeleton width="60%" height={16} borderRadius="$2" />
      <USkeleton width="100%" height={100} borderRadius="$3" />
      <USkeleton width="100%" height={200} borderRadius="$3" />
    </YStack>
  </YStack>
);

// Use in component:
if (isLoading) {
  return <DetailPageSkeleton />;
}
```

## Testing Checklist

After implementing, verify:
- [ ] Explore screen shows skeletons while loading each tab
- [ ] Detail pages show skeletons before content appears
- [ ] Images show shimmer before loading
- [ ] Pull-to-refresh works on Home, Library, Explore
- [ ] No "Loading..." text visible anywhere
- [ ] Skeletons match approximate layout of actual content
