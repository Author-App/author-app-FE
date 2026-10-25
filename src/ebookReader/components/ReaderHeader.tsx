import React from 'react';
import { XStack, YStack } from 'tamagui';

import UText from '@/src/components/core/text/uText';
import UBackButton from '@/src/components/core/buttons/uBackButton';

interface ReaderHeaderProps {
  title: string;
  author: string;
  paddingTop: number;
  onBack: () => void;
}

export function ReaderHeader({ title, author, paddingTop, onBack }: ReaderHeaderProps) {
  return (
    <XStack
      pos="absolute"
      top={0}
      left={0}
      right={0}
      ai="center"
      gap={12}
      px={16}
      pb={10}
      pt={paddingTop + 8}
      bg="rgba(7,5,18,0.92)"
      borderBottomWidth={1}
      borderBottomColor="$glassBorder"
    >
      <UBackButton variant="glass-md" onPress={onBack} />
      <YStack flex={1} gap={2}>
        <UText variant="display-s" color="$textPrimary" numberOfLines={1}>
          {title}
        </UText>
        {author ? (
          <UText variant="body-s" color="$textSecondary" numberOfLines={1}>
            {author}
          </UText>
        ) : null}
      </YStack>
    </XStack>
  );
}
