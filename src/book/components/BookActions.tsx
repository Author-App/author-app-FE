import React from 'react';
import { YStack, XStack } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import UText from '@/src/components/core/text/uText';
import { NeonButton } from '@/src/components/core/buttons/neonButton';
import IconBook from '@/assets/icons/iconBook';
import IconHeadphone from '@/assets/icons/iconHeadphone';
import type { BookResponse } from '@/src/types/api/library.types';

interface BookActionsProps {
  book: BookResponse;
  hasAccess?: boolean;
  onStartReading: () => void;
  onPurchase: () => void;
}

export function BookActions({
  book,
  hasAccess,
  onStartReading,
  onPurchase,
}: BookActionsProps) {
  const { bottom } = useSafeAreaInsets();
  const isAudiobook = book.type === 'audiobook';
  const TypeIcon = isAudiobook ? IconHeadphone : IconBook;
  const actionLabel = isAudiobook ? 'Start Listening' : 'Start Reading';

  return (
    <YStack
      position="absolute"
      bottom={0}
      left={0}
      right={0}
      px={20}
      pb={bottom + 16}
      pt={16}
      bg="$brandNavy"
      btw={1}
      btc="rgba(255, 255, 255, 0.1)"
    >
      {hasAccess ? (
        <NeonButton onPress={onStartReading}>
          <XStack ai="center" gap={10}>
            <TypeIcon dimen={20} color="$white" />
            <UText variant="text-md" color="$white" fontWeight="600">
              {actionLabel}
            </UText>
          </XStack>
        </NeonButton>
      ) : (
        <NeonButton onPress={onPurchase} title={`Purchase – $${book.price} ${book.currency}`} />
      )}
    </YStack>
  );
}
