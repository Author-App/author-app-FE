import React from 'react';
import { YStack } from 'tamagui';

import UText from '@/src/components/core/text/uText';

interface AboutTabContentProps {
  description?: string;
}

export function AboutTabContent({ description }: AboutTabContentProps) {
  return (
    <YStack>
      <UText variant="text-md" color="$neutral1">
        {description || 'No description available.'}
      </UText>
    </YStack>
  );
}
