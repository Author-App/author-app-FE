import React from 'react';
import { YStack } from 'tamagui';

import UText from '@/src/components/core/text/uText';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import { UGrid } from '@/src/components/core/layout/UGrid';
import type { RatingStats } from '@/src/types/api/library.types';

import { RatingStatsCard } from './RatingStatsCard';
import { ReviewCard } from './ReviewCard';

const TWO_COLUMN_WIDTH = 700;

interface ReviewsSectionProps {
  ratingStats: RatingStats;
  hasAccess?: boolean;
  onWriteReview: () => void;
  /** The space the section gets; from 700 the review cards sit two to a row */
  width?: number;
}

// ponytail: plain map, not a list. It sits inside the page ScrollView, where a FlashList
// renders every row anyway. Paginate from the API if a book ever gets hundreds of reviews.
export function ReviewsSection({ ratingStats, hasAccess, onWriteReview, width = 0 }: ReviewsSectionProps) {
  const cards = ratingStats.userReviews.map((review) => <ReviewCard key={review.id} review={review} />);

  return (
    <UAnimatedView animation="fadeInUp" delay={700}>
      <YStack gap={16} pb={16}>
        <RatingStatsCard ratingStats={ratingStats} hasAccess={hasAccess} onWriteReview={onWriteReview} />

        {ratingStats.userReviews.length === 0 ? (
          <UText variant="body" color="$textMuted" alignSelf="center" my={16}>
            No reviews yet
          </UText>
        ) : (
          width >= TWO_COLUMN_WIDTH ? (
            <UGrid columns={2} gap={24} width={width}>
              {cards}
            </UGrid>
          ) : (
            <YStack gap={12}>{cards}</YStack>
          )
        )}
      </YStack>
    </UAnimatedView>
  );
}
