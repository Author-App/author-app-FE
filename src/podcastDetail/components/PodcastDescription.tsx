import React, { memo } from 'react';
import { YStack } from 'tamagui';

import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import UText from '@/src/components/core/text/uText';
import { READ_MAX } from '@/src/components/core/layout/layout';

interface PodcastDescriptionProps {
  description: string;
  inset?: number;
}

export const PodcastDescription = memo(function PodcastDescription({ description, inset = 20 }: PodcastDescriptionProps) {
  return (
    <UAnimatedView animation="fadeInUp" delay={300}>
      <YStack mt={32} px={inset} gap={10}>
        <YStack maw={READ_MAX} gap={10}>
        <UText variant="display-m" color="$textPrimary" accessibilityRole="header">
          About this episode
        </UText>
        <UText variant="body" color="$textSecondary">
          {description}
        </UText>
        </YStack>
      </YStack>
    </UAnimatedView>
  );
});
