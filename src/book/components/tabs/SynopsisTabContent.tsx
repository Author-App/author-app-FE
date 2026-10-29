import React from 'react';
import { YStack } from 'tamagui';

import UText from '@/src/components/core/text/uText';
import { READ_MAX } from '@/src/components/core/layout/layout';

interface SynopsisTabContentProps {
  synopsis?: string;
}

export function SynopsisTabContent({ synopsis }: SynopsisTabContentProps) {
  return (
    <YStack minHeight={200} maw={READ_MAX}>
      <UText variant="body" color="$textSecondary">
        {synopsis || 'No synopsis available.'}
      </UText>
    </YStack>
  );
}
