import React from 'react';
import { YStack, XStack, Spinner } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import UText from '@/src/components/core/text/uText';
import { NeonButton } from '@/src/components/core/buttons/neonButton';
import { formatPrice } from '@/src/utils/currency';
import IconBook from '@/assets/icons/iconBook';
import IconHeadphone from '@/assets/icons/iconHeadphone';
import type { BookResponse } from '@/src/types/api/library.types';
import { isPrintBook } from '@/src/types/api/library.types';

interface BookActionsProps {
  book: BookResponse;
  hasAccess?: boolean;
  isPurchasing?: boolean;
  onStartReading: () => void;
  onPurchase: () => void;
}

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
  const TypeIcon = isAudiobook ? IconHeadphone : IconBook;
  
  // Action label based on type
  const getActionLabel = () => {
    if (isPrint) return 'View Order';
    return isAudiobook ? 'Start Listening' : 'Start Reading';
  };

  // Purchase label based on type
  const getPurchaseLabel = () => {
    const typeLabel = book.type === 'hardcover' ? 'Hardcover' : 
                      book.type === 'paperback' ? 'Paperback' : '';
    if (isPrint) {
      return `Order ${typeLabel} – ${formatPrice(book.price, book.currency)}`;
    }
    return `Purchase – ${formatPrice(book.price, book.currency)}`;
  };

  // Handle purchase/order action
  const handlePurchasePress = () => {
    if (isPrint) {
      // Navigate to checkout for print books
      router.push({
        pathname: '/(app)/checkout/[bookId]',
        params: { bookId: book.id },
      });
    } else {
      // Digital purchase flow
      onPurchase();
    }
  };

  return (
    <YStack
      position="absolute"
      bottom={0}
      left={0}
      right={0}
      px={20}
      pb={bottom + 16}
      pt={16}
      bg="$brandNavyTransparent"
      btw={1}
      btc="rgba(255, 255, 255, 0.1)"
    >
      {hasAccess && !isPrint ? (
        <NeonButton onPress={onStartReading}>
          <XStack ai="center" gap={10}>
            <TypeIcon dimen={20} color="$white" />
            <UText variant="text-md" color="$white" fontWeight="600">
              {getActionLabel()}
            </UText>
          </XStack>
        </NeonButton>
      ) : (
        <NeonButton
          onPress={handlePurchasePress}
          disabled={isPurchasing && !isPrint}
        >
          {isPurchasing && !isPrint ? (
            <Spinner color="$white" size="small" />
          ) : (
            <UText variant="text-md" color="$white" fontWeight="600">
              {getPurchaseLabel()}
            </UText>
          )}
        </NeonButton>
      )}
    </YStack>
  );
}
