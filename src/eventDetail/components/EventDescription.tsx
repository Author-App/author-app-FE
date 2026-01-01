import React, { memo } from 'react';
import { YStack } from 'tamagui';

import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import UText from '@/src/components/core/text/uText';

interface EventDescriptionProps {
  description?: string;
}

export const EventDescription = memo(function EventDescription({
  description,
}: EventDescriptionProps) {
  if (!description) return null;

  return (
    <UAnimatedView animation="fadeInUp" delay={300}>
      <YStack mt={24} gap={12}>
        <UText variant="heading-h2" color="$white">
          About this Event
        </UText>
        <UText variant="text-md" color="$neutral3" lh={24}>
          {description}
        </UText>
      </YStack>
    </UAnimatedView>
  );
});
