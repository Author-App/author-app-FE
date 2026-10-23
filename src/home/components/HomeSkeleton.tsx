import React, { memo } from 'react';
import { XStack, YStack } from 'tamagui';

import USkeleton from '@/src/components/core/display/uSkeleton';

/** Placeholder in the shape of the feed: banner, dots, a Continue Reading row, a books row. */
const HomeSkeleton = () => (
  <YStack
    px={16}
    gap={24}
    accessible
    accessibilityLabel="Loading home"
    accessibilityState={{ busy: true }}
  >
    <USkeleton width="100%" height={212} radius={24} />
    <XStack gap={6} jc="center">
      <YStack w={20} h={6} br={3} bg="rgba(255,255,255,0.12)" />
      <YStack w={6} h={6} br={3} bg="rgba(255,255,255,0.08)" />
      <YStack w={6} h={6} br={3} bg="rgba(255,255,255,0.08)" />
    </XStack>

    <YStack gap={12}>
      <USkeleton width={180} height={16} radius={8} />
      <XStack gap={12}>
        <USkeleton width={320} height={144} radius={20} />
        <USkeleton width={320} height={144} radius={20} />
      </XStack>
    </YStack>

    <YStack gap={12}>
      <USkeleton width={150} height={16} radius={8} />
      <XStack gap={14}>
        {[0, 1, 2].map((i) => (
          <YStack key={i} gap={8}>
            <USkeleton width={120} height={180} radius={12} />
            <USkeleton width={96} height={12} radius={6} />
          </YStack>
        ))}
      </XStack>
    </YStack>
  </YStack>
);

export default memo(HomeSkeleton);
