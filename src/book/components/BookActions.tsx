import React from 'react';
import { XStack, YStack, getTokenValue } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import UText from '@/src/components/core/text/uText';
import { NeonButton } from '@/src/components/core/buttons/neonButton';
import { formatPrice } from '@/src/utils/currency';
import type { BookResponse } from '@/src/types/api/library.types';
import { getBookTypeLabel, isPrintBook } from '@/src/utils/bookHelpers';

interface BookActionsProps {
  book: BookResponse;
  hasAccess?: boolean;
  isPurchasing?: boolean;
  onStartReading: () => void;
  onPurchase: () => void;
}

/** Fixed bar over the home indicator. Owned digital books open; everything else shows the price. */
export function BookActions({
  book,
  hasAccess,
  isPurchasing,
  onStartReading,
  onPurchase,
}: BookActionsProps) {
  const { bottom } = useSafeAreaInsets();
  const isAudiobook = book.type === 'audiobook';
  const isPrint = isPrintBook(book.type);
  // Print books are never "opened": owning one still means ordering another copy
  const canOpen = hasAccess && !isPrint;

  const action = canOpen
    ? { label: isAudiobook ? 'Listen Now' : 'Read Now', icon: isAudiobook ? 'headset-outline' : 'book-outline' }
    : { label: isPrint ? 'Order' : 'Buy', icon: 'bag-outline' };

  const handlePress = () => {
    if (canOpen) return onStartReading();
    if (isPrint) {
      return router.push({ pathname: '/(app)/checkout/[bookId]', params: { bookId: book.id } });
    }
    onPurchase();
  };

  return (
    <XStack
      pos="absolute"
      left={0}
      right={0}
      bottom={0}
      pt={14}
      px={16}
      pb={Math.max(bottom, 16)}
      gap={14}
      ai="center"
      bg="rgba(7,5,18,0.88)"
      borderTopWidth={1}
      borderTopColor="$glassBorder"
    >
      {!canOpen && (
        <YStack gap={2}>
          <UText variant="meta-s" color="$textMuted">
            {getBookTypeLabel(book.type)}
          </UText>
          <UText variant="display-l" fontSize={20} lineHeight={24} letterSpacing={0} color="$accentCyan">
            {formatPrice(book.price, book.currency)}
          </UText>
        </YStack>
      )}

      <NeonButton
        flex={1}
        onPress={handlePress}
        // Only a digital purchase waits on a request; print goes to checkout
        loading={isPurchasing && !isPrint}
        accessibilityLabel={action.label}
        boxShadow="0 0 22px rgba(135,54,247,0.5), 0 0 40px rgba(0,240,255,0.18)"
      >
        <XStack ai="center" gap={8}>
          <Ionicons name={action.icon as 'bag-outline'} size={18} color={getTokenValue('$textPrimary', 'color')} />
          <UText variant="label-button" color="$textPrimary">
            {action.label}
          </UText>
        </XStack>
      </NeonButton>
    </XStack>
  );
}
