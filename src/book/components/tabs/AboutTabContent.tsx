import React from 'react';
import { YStack } from 'tamagui';

import UText from '@/src/components/core/text/uText';
import { READ_MAX } from '@/src/components/core/layout/layout';

interface AboutTabContentProps {
  description?: string;
}

export function AboutTabContent({ description }: AboutTabContentProps) {
  return (
    <YStack maw={READ_MAX}>
      <UText variant="body" color="$textSecondary">
        {description || 'No description available.'}
      </UText>
    </YStack>
  );
}
