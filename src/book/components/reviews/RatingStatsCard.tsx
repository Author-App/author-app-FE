import React, { memo } from 'react';
import { YStack, XStack, Progress, YStackProps } from 'tamagui';

import UText from '@/src/components/core/text/uText';
import UStarRating from '@/src/components/core/rating/UStarRating';
import type { RatingStats } from '@/src/types/api/library.types';
import { UButton } from '@/src/components/core/buttons/uButton';

interface RatingStatsCardProps extends YStackProps {
  ratingStats: RatingStats;
  hasAccess?: boolean;
  onWriteReview?: () => void;
}

export function RatingStatsCard({
  ratingStats,
  hasAccess,
  onWriteReview,
  ...props
}: RatingStatsCardProps) {
  const breakdownEntries = Object.entries(ratingStats.breakdown).reverse();
  const maxCount = Math.max(...Object.values(ratingStats.breakdown), 1);
  const canReview = hasAccess && onWriteReview;

  return (
    <YStack
      bg="rgba(255, 255, 255, 0.08)"
      borderWidth={1}
      borderColor="rgba(255, 255, 255, 0.12)"
      br={16}
      p={20}
      {...props}
    >
      {/* Overall Rating - Centered */}
      <YStack ai="center" mb={8}>
        <XStack ai="center" gap={6}>
          <UText variant="heading-h1" color="$white">
            {ratingStats.average.toFixed(1)}
          </UText>
          <UStarRating rating={ratingStats.average} size={20} />
        </XStack>
        <UText variant="text-sm" color="$neutral3" mt={4}>
          {ratingStats.total} {ratingStats.total === 1 ? 'rating' : 'ratings'}
        </UText>
      </YStack>

      {/* Recommended */}
      <YStack ai="center" mb={20}>
        <XStack ai="center" gap={6}>
          <UText variant="heading-h2" color="$brandTeal">
            {ratingStats.recommended}%
          </UText>
          <UText variant="text-md" color="$neutral1">
            Recommended
          </UText>
        </XStack>
      </YStack>

      {/* Rating Breakdown */}
      <YStack gap={10} mb={canReview ? 20 : 0}>
        {breakdownEntries.map(([star, count]) => {
          const percentage = maxCount > 0 ? ((count as number) / maxCount) * 100 : 0;
          return (
            <BreakdownRow
              key={star}
              star={star}
              count={count as number}
              percentage={percentage}
            />
          );
        })}
      </YStack>

      {canReview && (
        <UButton 
          onPress={onWriteReview} 
          mt={15}
          h={48}
          bg="$brandTeal"
          br={24}
          pressStyle={{ opacity: 0.8 }}
        >
          <UText variant="text-md" color="$white" fontWeight="600">
            Write a Review
          </UText>
        </UButton>
      )}
    </YStack>
  );
}


interface BreakdownRowProps {
  star: string;
  count: number;
  percentage: number;
}

const BreakdownRow = memo(function BreakdownRow({ star, count, percentage }: BreakdownRowProps) {
  return (
    <XStack ai="center" gap={8}>
      <XStack ai="center" gap={4} width={36}>
        <UText variant="text-md" color="$white">
          {star}
        </UText>
        <UText variant="text-sm" color="$secondary">★</UText>
      </XStack>
      <Progress
        value={percentage}
        backgroundColor="rgba(255, 255, 255, 0.1)"
        height={8}
        flex={1}
        br={4}
      >
        <Progress.Indicator backgroundColor="$secondary" br={4} />
      </Progress>
      <UText variant="text-sm" color="$neutral3" width={30} textAlign="right">
        {count}
      </UText>
    </XStack>
  );
});
