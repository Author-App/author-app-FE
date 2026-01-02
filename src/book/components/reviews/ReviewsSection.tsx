import React from 'react';
import { YStack } from 'tamagui';

import UText from '@/src/components/core/text/uText';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import { NeonButton } from '@/src/components/core/buttons/neonButton';
import type { RatingStats } from '@/src/types/api/library.types';

import { RatingStatsCard } from './RatingStatsCard';
import { ReviewCard } from './ReviewCard';

interface ReviewsSectionProps {
  ratingStats: RatingStats;
  hasAccess?: boolean;
  onWriteReview: () => void;
}

export function ReviewsSection({
  ratingStats,
  hasAccess,
  onWriteReview,
}: ReviewsSectionProps) {
  const hasReviews = ratingStats.userReviews.length > 0;

  return (
    <UAnimatedView animation="fadeInUp" delay={700}>
      <YStack mt={32}>
        <UText variant="heading-h2" color="$white" mb={16}>
          Reviews
        </UText>

        <RatingStatsCard ratingStats={ratingStats} />

        {/* Write review button - only show if user has access */}
        {hasAccess && (
          <YStack mt={20} mb={16}>
            <NeonButton onPress={onWriteReview} title='Write a Review' />
          </YStack>
        )}

        {/* Reviews list */}
        <YStack gap={16} mt={hasAccess ? 0 : 16}>
          {hasReviews ? (
            ratingStats.userReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))
          ) : (
            <UText
              variant="text-md"
              color="$neutral1"
              alignSelf="center"
              marginVertical={15}
            >
              No reviews yet
            </UText>
          )}
        </YStack>
      </YStack>
    </UAnimatedView>
  );
}
