import React from 'react';
import { XStack, YStack } from 'tamagui';

import UText from '@/src/components/core/text/uText';
import UBackButton from '@/src/components/core/buttons/uBackButton';

interface ReaderHeaderProps {
  title: string;
  author: string;
  paddingTop: number;
}

export function ReaderHeader({
  title,
  author,
  paddingTop,
}: ReaderHeaderProps) {
  return (
    <XStack
      position="absolute"
      top={0}
      left={0}
      right={0}
      ai="center"
      px={16}
      pb={12}
      bg="$brandNavy"
      pt={paddingTop + 8}
    >
      <UBackButton variant="glass-md" />
      <YStack flex={1} mx={16}>
        <UText
          variant="text-sm"
          color="$white"
          numberOfLines={1}
          fontWeight="600"
        >
          {title}
        </UText>
        <UText variant="text-xs" color="$neutral4">
          {author}
        </UText>
      </YStack>
    </XStack>
  );
}
