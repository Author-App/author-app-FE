import React, { memo } from 'react';
import { YStack, XStack } from 'tamagui';

import IconDuration from '@/assets/icons/iconDuration';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import UText from '@/src/components/core/text/uText';

interface VideoInfoProps {
  title: string;
  duration: string;
  description?: string | null;
}

export const VideoInfo = memo(function VideoInfo({
  title,
  duration,
  description,
}: VideoInfoProps) {
  return (
    <YStack gap={16} px={16}>
      {/* Title */}
      <UAnimatedView animation="fadeInUp" delay={100}>
        <UText variant="heading-h1" color="$white">
          {title}
        </UText>
      </UAnimatedView>

      {/* Duration badge */}
      <UAnimatedView animation="fadeInUp" delay={200}>
        <XStack ai="center" gap={8}>
          <XStack
            ai="center"
            gap={6}
            bg="rgba(169, 29, 58, 0.15)"
            px={12}
            py={6}
            br={20}
          >
            <IconDuration dimen={14} />
            <UText variant="text-sm" color="$brandCrimson">
              {duration}
            </UText>
          </XStack>
        </XStack>
      </UAnimatedView>

      {/* Description */}
      {description && (
        <UAnimatedView animation="fadeInUp" delay={300}>
          <YStack gap={8} mt={8}>
            <UText variant="heading-h2" color="$white">
              About this Video
            </UText>
            <UText variant="text-md" color="$neutral3">
              {description}
            </UText>
          </YStack>
        </UAnimatedView>
      )}
    </YStack>
  );
});
