import React from 'react';
import { YStack, XStack, Progress } from 'tamagui';

import UText from '@/src/components/core/text/uText';
import type { RatingStats } from '@/src/types/api/library.types';

interface RatingStatsCardProps {
  ratingStats: RatingStats;
}

export function RatingStatsCard({ ratingStats }: RatingStatsCardProps) {
  const breakdownEntries = Object.entries(ratingStats.breakdown).reverse();

  return (
    <YStack
      bg="rgba(255, 255, 255, 0.08)"
      borderWidth={1}
      borderColor="rgba(255, 255, 255, 0.12)"
      br={16}
      p={20}
    >
      <XStack ai="center" width="100%" jc="space-between">
        {/* Rating bars */}
        <YStack width="60%" gap={10}>
          {breakdownEntries.map(([star, count]) => (
            <XStack key={star} ai="center" gap={8}>
              <UText variant="text-sm" color="$white" width={15}>
                {star}
              </UText>
              <UText variant="text-xs" color="$secondary">★</UText>
              <Progress
                value={(count as number) * 20}
                backgroundColor="rgba(255, 255, 255, 0.1)"
                height={6}
                flex={1}
                br={3}
              >
                <Progress.Indicator backgroundColor="$secondary" br={3} />
              </Progress>
            </XStack>
          ))}
        </YStack>

        {/* Average rating & recommended */}
        <YStack ai="flex-end" gap={16}>
          <YStack ai="flex-end">
            <XStack ai="center" gap={4}>
              <UText variant="heading-h1" color="$white">
                {ratingStats.average.toFixed(1)}
              </UText>
              <UText variant="text-md" color="$secondary">★</UText>
            </XStack>
            <UText variant="text-xs" color="$neutral1">
              {ratingStats.total} ratings
            </UText>
          </YStack>

          <YStack ai="flex-end">
            <UText variant="heading-h2" color="$brandTeal">
              {ratingStats.recommended}%
            </UText>
            <UText variant="text-xs" color="$neutral1">
              Recommended
            </UText>
          </YStack>
        </YStack>
      </XStack>
    </YStack>
  );
}
