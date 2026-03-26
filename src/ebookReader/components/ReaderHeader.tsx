import React from 'react';
import { XStack, YStack, getTokenValue } from 'tamagui';

import UText from '@/src/components/core/text/uText';
import UIconButton from '@/src/components/core/buttons/uIconButtonVariants';
import IconArrowLeft from '@/assets/icons/iconArrowLeft';
import { haptics } from '@/src/utils/haptics';

interface ReaderHeaderProps {
  title: string;
  author: string;
  paddingTop: number;
  onBack: () => void;
}

export function ReaderHeader({
  title,
  author,
  paddingTop,
  onBack,
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
      <UIconButton
        variant="glass-md"
        icon={IconArrowLeft}
        onPress={onBack}
      />
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
