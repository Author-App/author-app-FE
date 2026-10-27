import React, { memo } from 'react';
import { YStack, XStack, YStackProps } from 'tamagui';

import UText from '@/src/components/core/text/uText';
import UStarRating from '@/src/components/core/rating/UStarRating';
import { NeonButton } from '@/src/components/core/buttons/neonButton';
import type { RatingStats } from '@/src/types/api/library.types';

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
    <YStack p={20} gap={16} br={24} bg="$glass" borderWidth={1} borderColor="$glassBorder" {...props}>
      <YStack ai="center" gap={6}>
        <XStack ai="center" gap={10}>
          <UText variant="display-l" fontSize={32} lineHeight={38} letterSpacing={0} color="$textPrimary">
            {ratingStats.average.toFixed(1)}
          </UText>
          <UStarRating rating={ratingStats.average} size={20} gap={2} />
        </XStack>
        <UText variant="body-s" color="$textMuted">
          {ratingStats.total} {ratingStats.total === 1 ? 'rating' : 'ratings'}
        </UText>
        <UText variant="meta" color="$accentCyan">
          {ratingStats.recommended}% recommended
        </UText>
      </YStack>

      <YStack gap={10}>
        {breakdownEntries.map(([star, count]) => (
          <BreakdownRow key={star} star={star} count={count as number} percentage={((count as number) / maxCount) * 100} />
        ))}
      </YStack>

      {canReview && (
        <NeonButton tone="secondary" h={44} onPress={onWriteReview} title="Write a Review" />
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
    <XStack
      ai="center"
      gap={10}
      accessible
      accessibilityRole="text"
      accessibilityLabel={`${star} stars, ${count} ${count === 1 ? 'rating' : 'ratings'}`}
    >
      <UText variant="meta-s" color="$textSecondary" w={28}>
        {star} ★
      </UText>
      <YStack flex={1} h={6} br={3} bg="$track" overflow="hidden">
        <YStack h={6} br={3} bg="$gold" w={`${percentage}%`} />
      </YStack>
      <UText variant="meta-s" color="$textMuted" w={28} textAlign="right">
        {count}
      </UText>
    </XStack>
  );
});
