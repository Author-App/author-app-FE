import React from 'react';
import { YStack, XStack } from 'tamagui';

import UText from '@/src/components/core/text/uText';
import UImage from '@/src/components/core/image/uImage';
import UStarRating from '@/src/components/core/rating/UStarRating';
import { formatDate, getInitials } from '@/src/utils/helper';
import type { ReviewResponse } from '@/src/types/api/library.types';

interface ReviewCardProps {
  review: ReviewResponse;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const name = review.username || 'Anonymous';

  return (
    <XStack p={16} gap={12} br={20} bg="$glass" borderWidth={1} borderColor="$glassBorder">
      <UImage imageSource={undefined} fallBackText={getInitials(name)} br={20} w={40} h={40} />

      <YStack flex={1} gap={6}>
        <XStack jc="space-between" ai="center" gap={8}>
          <UText variant="body" fontWeight="600" lineHeight={20} color="$textPrimary" numberOfLines={1} flex={1}>
            {name}
          </UText>
          {review.submittedAt && (
            <UText variant="meta-s" color="$textMuted">
              {formatDate(review.submittedAt)}
            </UText>
          )}
        </XStack>
        <UStarRating rating={review.rating} size={14} gap={2} />
        {review.comment && (
          <UText variant="body-s" lineHeight={20} color="$textSecondary">
            {review.comment}
          </UText>
        )}
      </YStack>
    </XStack>
  );
}
