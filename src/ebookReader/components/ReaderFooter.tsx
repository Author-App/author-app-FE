/**
 * Reader Footer Component
 * 
 * Displays reading progress bar and page information.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { YStack, XStack } from 'tamagui';

import UText from '@/src/components/core/text/uText';

interface ReaderFooterProps {
  currentPage: number;
  totalPages: number;
  progressPercent: number;
  paddingBottom: number;
}

export function ReaderFooter({
  currentPage,
  totalPages,
  progressPercent,
  paddingBottom,
}: ReaderFooterProps) {
  return (
    <View style={[styles.container, { paddingBottom: paddingBottom + 12 }]}>
      {/* Progress Bar */}
      <YStack width="100%" height={3} bg="$neutral6" br={2} overflow="hidden" mb={12}>
        <YStack
          height="100%"
          bg="$gold"
          width={`${progressPercent}%`}
          br={2}
        />
      </YStack>

      <XStack jc="space-between" ai="center">
        <UText variant="text-xs" color="$neutral4">
          Page {currentPage} of {totalPages}
        </UText>
        <UText variant="text-xs" color="$neutral4">
          {progressPercent}% complete
        </UText>
      </XStack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: '#0A1628',
  },
});
