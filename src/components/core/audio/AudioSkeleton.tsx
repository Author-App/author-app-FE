import React from 'react';
import { XStack, YStack } from 'tamagui';

import USkeleton from '@/src/components/core/display/uSkeleton';
import { AUDIO_COVER_SIZE } from './AudioHero';

/** Loading shape of AudioHero plus AudioPlayer: cover, title, chip, scrubber, controls. */
export function AudioSkeleton() {
  return (
    <YStack ai="center" gap={14}>
      <USkeleton width={AUDIO_COVER_SIZE} height={AUDIO_COVER_SIZE} radius={24} mb={10} />
      <USkeleton width={220} height={22} radius={8} />
      <USkeleton width={90} height={22} radius={11} />
      <USkeleton width="100%" height={4} radius={2} mt={28} />
      <XStack ai="center" gap={40} mt={24}>
        <USkeleton width={36} height={36} radius={18} />
        <USkeleton width={72} height={72} radius={36} />
        <USkeleton width={36} height={36} radius={18} />
      </XStack>
    </YStack>
  );
}
