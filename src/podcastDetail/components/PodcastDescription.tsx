/**
 * Podcast Description Component
 *
 * Displays podcast description in a card.
 */

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
      <YStack mt={24} p={16} bg="$color3" br={16}>
        <UText variant="text-md" color="$neutral1" lineHeight={24}>
          {description}
        </UText>
      </YStack>
    </UAnimatedView>
  );
});
