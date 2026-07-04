import React, { memo } from 'react';
import { YStack, XStack, Separator } from 'tamagui';
import { Feather } from '@expo/vector-icons';

import UText from '@/src/components/core/text/uText';
import type { PrintQuoteData } from '@/src/types/api/print.types';
import { SHIPPING_CONFIG } from '@/src/types/api/print.types';

interface OrderSummaryProps {
  quote: PrintQuoteData | null;
  quantity: number;
  bookTitle: string;
  bookType: string;
  bookPrice: number;
}

const formatCurrency = (cents: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(cents / 100);
};

const OrderSummary = memo(({ quote, quantity, bookTitle, bookType, bookPrice }: OrderSummaryProps) => {
  const displayType = bookType === 'hardcover' ? 'Hardcover' : 'Paperback';
  const subtotal = bookPrice * quantity;
  
  return (
    <YStack gap={14}>
      {/* Book Info */}
      <XStack jc="space-between" ai="flex-start">
        <YStack flex={1} pr={16}>
          <UText variant="text-sm" color="$white" fontWeight="500" numberOfLines={2}>
            {bookTitle}
          </UText>
          <XStack ai="center" gap={6} mt={4}>
            <XStack
              px={8}
              py={2}
              borderRadius={6}
              bg="rgba(169, 29, 58, 0.2)"
            >
              <UText variant="text-2xs" color="$brandCrimson" fontWeight="600">
                {displayType}
              </UText>
            </XStack>
            <UText variant="text-xs" color="$neutral4">
              × {quantity}
            </UText>
          </XStack>
        </YStack>
        <UText variant="text-sm" color="$neutral3" fontWeight="500">
          ${subtotal.toFixed(2)}
        </UText>
      </XStack>

      <Separator borderColor="rgba(255, 255, 255, 0.06)" />

      {/* Shipping flat rate */}
      <XStack jc="space-between" ai="center">
        <XStack ai="center" gap={8}>
          <Feather name="truck" size={14} color="#8E8E93" />
          <YStack>
            <UText variant="text-sm" color="$neutral3">
              Standard Shipping
            </UText>
            <UText variant="text-2xs" color="$neutral4">
              {SHIPPING_CONFIG.deliveryEstimate}
            </UText>
          </YStack>
        </XStack>
        <UText variant="text-sm" color="$neutral3" fontWeight="500">
          ${SHIPPING_CONFIG.flatRate.toFixed(2)}
        </UText>
      </XStack>

      {quote ? (
        <>
          <Separator borderColor="rgba(255, 255, 255, 0.06)" />

          {/* Total row */}
          <XStack jc="space-between" ai="center">
            <XStack ai="center" gap={8}>
              <Feather name="check-circle" size={16} color="#3B9797" />
              <UText variant="text-sm" color="$white" fontWeight="600">
                Total (incl. tax)
              </UText>
            </XStack>
            <UText variant="text-md" color="$brandTeal" fontWeight="700">
              {formatCurrency(quote.amountCents, quote.currency)}
            </UText>
          </XStack>
        </>
      ) : (
        <>
          <Separator borderColor="rgba(255, 255, 255, 0.06)" />
          
          {/* Estimated total */}
          <XStack jc="space-between" ai="center">
            <UText variant="text-sm" color="$neutral4">
              Estimated Total
            </UText>
            <UText variant="text-sm" color="$neutral4">
              ${(subtotal + SHIPPING_CONFIG.flatRate).toFixed(2)}
            </UText>
          </XStack>
          
          {/* Pending quote message */}
          <XStack ai="center" jc="center" gap={8}>
            <Feather name="info" size={14} color="#8E8E93" />
            <UText variant="text-xs" color="$neutral4" textAlign="center">
              Final price after entering address (includes tax)
            </UText>
          </XStack>
        </>
      )}
    </YStack>
  );
});

OrderSummary.displayName = 'OrderSummary';

export default OrderSummary;
