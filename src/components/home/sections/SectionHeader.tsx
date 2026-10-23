import React, { memo } from 'react';
import { YStack } from 'tamagui';

import UText from '@/src/components/core/text/uText';
import { HOME_GUTTER } from './constants';

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

const SectionHeader = memo(({ title, subtitle }: SectionHeaderProps) => (
  <YStack px={HOME_GUTTER} gap={2}>
    <UText variant="display-m" color="$textPrimary" accessibilityRole="header">
      {title}
    </UText>
    {subtitle && (
      <UText variant="body-s" color="$textMuted">
        {subtitle}
      </UText>
    )}
  </YStack>
));

SectionHeader.displayName = 'SectionHeader';

export default SectionHeader;
