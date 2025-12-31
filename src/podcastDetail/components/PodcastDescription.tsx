import React, { memo } from 'react';
import { YStack } from 'tamagui';

import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import UText from '@/src/components/core/text/uText';

interface PodcastDescriptionProps {
  description: string;
}

export const PodcastDescription = memo(function PodcastDescription({
  description,
}: PodcastDescriptionProps) {
  
  return (
    <UAnimatedView animation="fadeInUp" delay={300}>
      <YStack mt={24} gap={12}>
        <UText variant="heading-h2" color="$white">
          About this Episode
        </UText>
        <UText variant="text-md" color="$neutral3" lineHeight={24}>
          {description}
        </UText>
      </YStack>
    </UAnimatedView>
  );
});
