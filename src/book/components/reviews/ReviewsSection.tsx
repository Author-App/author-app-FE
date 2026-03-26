import React, { useCallback } from 'react';
import { FlashList } from '@shopify/flash-list';
import { View } from 'tamagui';

import UText from '@/src/components/core/text/uText';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import type { RatingStats } from '@/src/types/api/library.types';
import type { ReviewResponse } from '@/src/types/api/library.types';

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
  const renderReview = useCallback(
    ({ item }: { item: ReviewResponse }) => <ReviewCard review={item} />,
    []
  );

  const keyExtractor = useCallback(
    (item: ReviewResponse) => item.id.toString(),
    []
  );

  const ItemSeparatorComponent = useCallback(() => <View height={16} />, []);

  const ListEmptyComponent = useCallback(
    () => (
      <UText
        variant="text-md"
        color="$neutral1"
        alignSelf="center"
        marginVertical={15}
      >
        No reviews yet
      </UText>
    ),
    []
  );

  return (
    <UAnimatedView animation="fadeInUp" delay={700}>
      <RatingStatsCard ratingStats={ratingStats} hasAccess={hasAccess} onWriteReview={onWriteReview} />
      <FlashList
        data={ratingStats.userReviews}
        renderItem={renderReview}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={ItemSeparatorComponent}
        ListEmptyComponent={ListEmptyComponent}
        contentContainerStyle={{ paddingVertical: 16 }}
        scrollEnabled={false}
      />
    </UAnimatedView>
  );
}
