import React, { memo } from 'react';
import { XStack, YStack } from 'tamagui';

import UText from '@/src/components/core/text/uText';
import { HOME_GUTTER } from './constants';

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  onSeeAll?: () => void;
  px?: number;
}

const SectionHeader = memo(({ title, subtitle, onSeeAll, px = HOME_GUTTER }: SectionHeaderProps) => (
  <XStack px={px} ai="flex-end" gap={12}>
    <YStack flex={1} gap={2}>
      <UText variant="display-m" color="$textPrimary" accessibilityRole="header">
        {title}
      </UText>
      {subtitle && (
        <UText variant="body-s" color="$textMuted">
          {subtitle}
        </UText>
      )}
    </YStack>
    {onSeeAll && (
      <YStack
        minHeight={44}
        jc="center"
        onPress={onSeeAll}
        pressStyle={{ opacity: 0.7 }}
        accessible
        accessibilityRole="button"
        accessibilityLabel={`See all ${title}`}
      >
        <UText variant="link" color="$accentCyan">
          See all
        </UText>
      </YStack>
    )}
  </XStack>
));

SectionHeader.displayName = 'SectionHeader';

export default SectionHeader;
