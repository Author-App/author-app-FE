import React from 'react';
import { YStack, XStack } from 'tamagui';
import { Rating } from 'react-native-ratings';

import UText from '@/src/components/core/text/uText';
import UImage from '@/src/components/core/image/uImage';
import { formatDate } from '@/src/utils/helper';
import type { ReviewResponse } from '@/src/types/api/library.types';

interface ReviewCardProps {
  review: ReviewResponse;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <YStack
      bg="rgba(255, 255, 255, 0.05)"
      borderWidth={1}
      borderColor="rgba(255, 255, 255, 0.08)"
      br={12}
      p={16}
    >
      <XStack gap={12}>
        <UImage
          imageSource={undefined}
          fallBackText={review.username || 'User'}
          borderRadius={999}
          w={40}
          h={40}
        />

        <YStack flex={1}>
          <XStack jc="space-between" ai="center">
            <UText variant="text-md" color="$white" fontWeight="600">
              {review.username || 'Anonymous'}
            </UText>
            <UText variant="text-xs" color="$neutral1">
              {review.submittedAt ? formatDate(review.submittedAt) : ''}
            </UText>
          </XStack>

          <Rating
            type="custom"
            imageSize={14}
            readonly
            startingValue={review.rating}
            ratingColor="#D2B46C"
            ratingBackgroundColor="rgba(255, 255, 255, 0.2)"
            tintColor="transparent"
            style={{ alignSelf: 'flex-start', marginTop: 6 }}
          />

          {review.comment && (
            <UText variant="text-sm" color="$neutral1" mt={10} lineHeight={20}>
              {review.comment}
            </UText>
          )}
        </YStack>
      </XStack>
    </YStack>
  );
}
