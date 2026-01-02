import React from 'react';
import { YStack } from 'tamagui';

import UText from '@/src/components/core/text/uText';
import { NeonButton } from '@/src/components/core/buttons/neonButton';
import { RatingStatsCard } from '../reviews/RatingStatsCard';
import { ReviewCard } from '../reviews/ReviewCard';
import type { RatingStats } from '@/src/types/api/library.types';

interface ReviewsTabContentProps {
  ratingStats?: RatingStats;
  hasAccess?: boolean;
  onWriteReview: () => void;
}

export function ReviewsTabContent({
  ratingStats,
  hasAccess,
  onWriteReview,
}: ReviewsTabContentProps) {
  const hasReviews = ratingStats && ratingStats.userReviews.length > 0;

  return (
    <YStack gap={16}>
      {ratingStats && <RatingStatsCard ratingStats={ratingStats} />}

      {hasAccess && (
        <YStack mt={4}>
          <NeonButton onPress={onWriteReview} title='Write a Review' />
        </YStack>
      )}

      {hasReviews ? (
        <YStack gap={16} mt={8}>
          {ratingStats.userReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </YStack>
      ) : (
        <UText
          variant="text-md"
          color="$neutral1"
          alignSelf="center"
          marginVertical={20}
        >
          No reviews yet
        </UText>
      )}
    </YStack>
  );
}
