import React from 'react';
import { YStack } from 'tamagui';

import UText from '@/src/components/core/text/uText';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import type { RatingStats } from '@/src/types/api/library.types';

import { RatingStatsCard } from './RatingStatsCard';
import { ReviewCard } from './ReviewCard';

interface ReviewsSectionProps {
  ratingStats: RatingStats;
  hasAccess?: boolean;
  onWriteReview: () => void;
}

// ponytail: plain map, not a list. It sits inside the page ScrollView, where a FlashList
// renders every row anyway. Paginate from the API if a book ever gets hundreds of reviews.
export function ReviewsSection({ ratingStats, hasAccess, onWriteReview }: ReviewsSectionProps) {
  return (
    <UAnimatedView animation="fadeInUp" delay={700}>
      <YStack gap={16} pb={16}>
        <RatingStatsCard ratingStats={ratingStats} hasAccess={hasAccess} onWriteReview={onWriteReview} />

        {ratingStats.userReviews.length === 0 ? (
          <UText variant="body" color="$textMuted" alignSelf="center" my={16}>
            No reviews yet
          </UText>
        ) : (
          <YStack gap={12}>
            {ratingStats.userReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </YStack>
        )}
      </YStack>
    </UAnimatedView>
  );
}
