import React from 'react';
import { YStack } from 'tamagui';

import UText from '@/src/components/core/text/uText';

interface SynopsisTabContentProps {
  synopsis?: string;
}

export function SynopsisTabContent({ synopsis }: SynopsisTabContentProps) {
  return (
    <YStack minHeight={200}>
      <UText variant="text-md" color="$neutral1" lineHeight={24}>
        {synopsis || 'No synopsis available.'}
      </UText>
    </YStack>
  );
}
