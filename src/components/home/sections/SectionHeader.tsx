import React, { memo } from 'react';
import { YStack, XStack } from 'tamagui';

import UText from '@/src/components/core/text/uText';
import { HORIZONTAL_PADDING } from './FeaturedBooks/constants';

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

const SectionHeader = memo(({ title, subtitle }: SectionHeaderProps) => (
  <XStack jc="space-between" ai="flex-end" px={HORIZONTAL_PADDING} mb={20}>
    <YStack flex={1} mr={16}>
      <UText variant="playfair-lg" color="$white" fontWeight={700}>
        {title}
      </UText>
      {subtitle && (
        <UText variant="text-sm" color="$neutralAlphaLight6" mt={4}>
          {subtitle}
        </UText>
      )}
    </YStack>
  </XStack>
));

SectionHeader.displayName = 'SectionHeader';

export default SectionHeader;
