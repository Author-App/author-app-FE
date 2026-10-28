import React from 'react';
import { XStack, YStack } from 'tamagui';

import UText from '@/src/components/core/text/uText';

interface ReaderFooterProps {
  currentPage: number;
  totalPages: number;
  progressPercent: number;
  paddingBottom: number;
}

export function ReaderFooter({ currentPage, totalPages, progressPercent, paddingBottom }: ReaderFooterProps) {
  return (
    <YStack
      pos="absolute"
      left={0}
      right={0}
      bottom={0}
      gap={10}
      px={20}
      pt={12}
      pb={paddingBottom + 12}
      bg="rgba(7,5,18,0.92)"
      borderTopWidth={1}
      borderTopColor="$glassBorder"
      accessible
      accessibilityRole="text"
      accessibilityLabel={`Page ${currentPage} of ${totalPages}, ${progressPercent} percent read`}
    >
      <YStack h={3} br={2} bg="$track" overflow="hidden">
        <YStack h="100%" w={`${progressPercent}%`} bg="$accentCyan" />
      </YStack>
      <XStack jc="space-between" ai="center">
        <UText variant="meta-s" color="$textSecondary">
          Page {currentPage} of {totalPages}
        </UText>
        <UText variant="meta-s" color="$accentCyan">
          {progressPercent}%
        </UText>
      </XStack>
    </YStack>
  );
}
