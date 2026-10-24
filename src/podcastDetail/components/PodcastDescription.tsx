import React, { memo } from 'react';
import { YStack } from 'tamagui';

import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import UText from '@/src/components/core/text/uText';

interface PodcastDescriptionProps {
  description: string;
}

export const PodcastDescription = memo(function PodcastDescription({ description }: PodcastDescriptionProps) {
  return (
    <UAnimatedView animation="fadeInUp" delay={300}>
      <YStack mt={32} px={20} gap={10}>
        <UText variant="display-m" color="$textPrimary" accessibilityRole="header">
          About this episode
        </UText>
        <UText variant="body" color="$textSecondary">
          {description}
        </UText>
      </YStack>
    </UAnimatedView>
  );
});
