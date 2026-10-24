import React, { memo } from 'react';
import { YStack } from 'tamagui';

import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import UText from '@/src/components/core/text/uText';

export const EventDescription = memo(function EventDescription({ description }: { description?: string }) {
  if (!description) return null;

  return (
    <UAnimatedView animation="fadeInUp" delay={300}>
      <YStack mt={28} gap={10}>
        <UText variant="display-m" color="$textPrimary" accessibilityRole="header">
          About this event
        </UText>
        <UText variant="body" color="$textSecondary">
          {description}
        </UText>
      </YStack>
    </UAnimatedView>
  );
});
