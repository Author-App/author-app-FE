import React, { memo } from 'react';
import { YStack } from 'tamagui';

import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import UText from '@/src/components/core/text/uText';
import UBadge from '@/src/components/core/display/uBadge';
import { READ_MAX } from '@/src/components/core/layout/layout';

interface VideoInfoProps {
  title: string;
  duration: string;
  description?: string | null;
  inset?: number;
}

export const VideoInfo = memo(function VideoInfo({ title, duration, description, inset = 20 }: VideoInfoProps) {
  return (
    <UAnimatedView animation="fadeInUp" delay={100}>
      <YStack gap={12} px={inset}>
        <UText variant="display-l" color="$textPrimary" accessibilityRole="header">
          {title}
        </UText>
        <UBadge label={duration} tone="cyan" />

        {description && (
          <YStack gap={10} mt={20} maw={READ_MAX}>
            <UText variant="display-m" color="$textPrimary" accessibilityRole="header">
              About this video
            </UText>
            <UText variant="body" color="$textSecondary">
              {description}
            </UText>
          </YStack>
        )}
      </YStack>
    </UAnimatedView>
  );
});
