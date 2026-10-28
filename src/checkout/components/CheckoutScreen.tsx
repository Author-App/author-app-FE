import React, { useCallback } from 'react';
import { Alert, ScrollView } from 'react-native';
import { XStack, YStack, getTokenValue } from 'tamagui';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import UScreenLayout from '@/src/components/core/layout/UScreenLayout';
import UKeyboardAvoidingView from '@/src/components/core/layout/uKeyboardAvoidingView';
import UHeader from '@/src/components/core/layout/uHeader';
import UText from '@/src/components/core/text/uText';
import UBadge from '@/src/components/core/display/uBadge';
import USkeleton from '@/src/components/core/display/uSkeleton';
import ULocalImage from '@/src/components/core/image/uLocalImage';
import UEmptyState from '@/src/components/core/feedback/UEmptyState';
import UScreenError from '@/src/components/core/feedback/UScreenError';
import UBackButton from '@/src/components/core/buttons/uBackButton';
import { NeonButton } from '@/src/components/core/buttons/neonButton';

import { ContactInfoFields, AddressFields } from './ShippingForm';
import { SHIPPING_CONFIG } from '@/src/types/api/print.types';
import { useBookDetail } from '@/src/book/hooks/useBookDetail';
import { useCheckoutForm } from '../hooks/useCheckoutForm';
import { getBookTypeLabel, getBookTypeTone, isPrintBook } from '@/src/utils/bookHelpers';
import { formatPrice } from '@/src/utils/currency';

// Clears the fixed pay bar: total row + 52 button + the home indicator, plus room to breathe
const PAY_BAR_CLEARANCE = 150;

function QuantityStepper({ quantity, max, onChange }: { quantity: number; max: number; onChange: (n: number) => void }) {
  const steps = [
    { icon: 'remove' as const, label: 'Decrease quantity', next: quantity - 1, enabled: quantity > 1 },
    { icon: 'add' as const, label: 'Increase quantity', next: quantity + 1, enabled: quantity < max },
  ];
  const button = (step: (typeof steps)[number]) => (
    <XStack
      key={step.icon}
      w={32}
      h={32}
      br={10}
      ai="center"
      jc="center"
      bg="$glass"
      borderWidth={1}
      borderColor="$glassBorder"
      opacity={step.enabled ? 1 : 0.35}
      disabled={!step.enabled}
      onPress={() => onChange(step.next)}
      pressStyle={{ scale: 0.94 }}
      accessible
      accessibilityRole="button"
      accessibilityLabel={step.label}
      accessibilityState={{ disabled: !step.enabled }}
    >
      <Ionicons name={step.icon} size={16} color={getTokenValue('$textPrimary', 'color')} />
    </XStack>
  );

  return (
    <XStack ai="center" gap={8}>
      {button(steps[0])}
      <UText variant="display-s" color="$accentCyan" w={24} textAlign="center" accessibilityLabel={`Quantity ${quantity}`}>
        {quantity}
      </UText>
      {button(steps[1])}
    </XStack>
  );
}

function SectionTitle({ children }: { children: string }) {
  return (
    <UText variant="display-m" color="$textPrimary" mb={14} accessibilityRole="header">
      {children}
    </UText>
  );
}

function SummaryRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <XStack jc="space-between" ai="center" gap={16}>
      <UText variant="body-s" color={strong ? '$textPrimary' : '$textSecondary'} flex={1} numberOfLines={1}>
        {label}
      </UText>
      <UText variant={strong ? 'display-s' : 'body-s'} color={strong ? '$accentCyan' : '$textSecondary'}>
        {value}
      </UText>
    </XStack>
  );
}

const CheckoutScreen = ({ bookId }: { bookId: string }) => {
  const { bottom } = useSafeAreaInsets();
  const { book, isLoading: isLoadingBook, isError: isBookError, refetch } = useBookDetail(bookId);

  const handleSuccess = useCallback((_orderId: string, isConfirmed: boolean) => {
    Alert.alert(
      isConfirmed ? 'Order placed' : 'Payment received',
      isConfirmed
        ? 'Your print book order is placed. You will get an email with tracking once it ships.'
        : "We're confirming your order. You will get an email once it is confirmed, then tracking once it ships.",
      [{ text: 'Done', onPress: () => router.back() }]
    );
  }, []);

  const handleError = useCallback((message: string) => {
    Alert.alert('Order error', message);
  }, []);

  const {
    values,
    setFieldValue,
    touchField,
    getFieldError,
    quantity,
    maxQuantity,
    handleQuantityChange,
    quote,
    isQuoting,
    quoteError,
    isCreatingOrder,
    handlePlaceOrder,
    canPay,
    refs,
  } = useCheckoutForm({ bookId, onSuccess: handleSuccess, onError: handleError });

  const header = (
    <UHeader
      variant="premium"
      title="Checkout"
      textProps={{ variant: 'display-l' }}
      leftControl={<UBackButton variant="glass-md" />}
      pb={8}
    />
  );

  if (isLoadingBook) {
    return (
      <UScreenLayout>
        {header}
        <YStack px={16} pt={16} gap={14}>
          <USkeleton width="100%" height={118} radius={20} />
          <USkeleton width={160} height={18} radius={8} mt={12} />
          <USkeleton width="100%" height={50} radius={14} />
          <USkeleton width="100%" height={50} radius={14} />
        </YStack>
      </UScreenLayout>
    );
  }

  if (isBookError) {
    return (
      <UScreenLayout pb={bottom}>
        {header}
        <UScreenError message="Unable to load this book. Please try again." onRetry={refetch} />
      </UScreenLayout>
    );
  }

  if (!book || !isPrintBook(book.type)) {
    return (
      <UScreenLayout pb={bottom}>
        {header}
        <YStack flex={1} jc="center">
          <UEmptyState
            icon={book ? 'information-circle-outline' : 'alert-circle-outline'}
            title={book ? 'Not available in print' : 'Book not found'}
            message={book ? 'This book is not sold as a print copy.' : undefined}
          />
        </YStack>
      </UScreenLayout>
    );
  }

  const price = book.price ?? 0;
  const currency = quote?.currency ?? book.currency;
  const subtotal = price * quantity;
  const total = quote ? quote.amountCents / 100 : subtotal + SHIPPING_CONFIG.flatRate;
  const payLabel = isQuoting
    ? 'Calculating...'
    : canPay
      ? `Pay ${formatPrice(total, currency)}`
      : 'Enter shipping details';

  return (
    <UScreenLayout>
      {header}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottom + PAY_BAR_CLEARANCE }}
        keyboardShouldPersistTaps="handled"
      >
        <UKeyboardAvoidingView dismissOnTap>
          <YStack px={16} pt={16} gap={28}>
            <XStack p={14} gap={14} br={20} bg="$glass" borderWidth={1} borderColor="$glassBorder">
              <YStack w={64} h={96} br={10} overflow="hidden" bg="$glassSolid" ai="center" jc="center">
                {book.thumbnail ? (
                  <ULocalImage source={{ uri: book.thumbnail }} width="100%" height="100%" contentFit="cover" />
                ) : (
                  <Ionicons name="book-outline" size={24} color={getTokenValue('$textMuted', 'color')} />
                )}
              </YStack>
              <YStack flex={1} jc="space-between">
                <YStack gap={4}>
                  <UText variant="display-s" color="$textPrimary" numberOfLines={2}>
                    {book.title}
                  </UText>
                  <UText variant="body-s" color="$textSecondary">
                    by {book.author}
                  </UText>
                </YStack>
                <XStack ai="center" jc="space-between">
                  <YStack gap={4}>
                    <UBadge label={getBookTypeLabel(book.type)} tone={getBookTypeTone(book.type)} />
                    <UText variant="display-s" color="$accentCyan">
                      {formatPrice(price, book.currency)}
                    </UText>
                  </YStack>
                  <QuantityStepper quantity={quantity} max={maxQuantity} onChange={handleQuantityChange} />
                </XStack>
              </YStack>
            </XStack>

            <YStack>
              <SectionTitle>Contact</SectionTitle>
              <ContactInfoFields
                values={values}
                setFieldValue={setFieldValue}
                touchField={touchField}
                getFieldError={getFieldError}
                refs={refs}
              />
            </YStack>

            <YStack>
              <SectionTitle>Shipping address</SectionTitle>
              <AddressFields
                values={values}
                setFieldValue={setFieldValue}
                touchField={touchField}
                getFieldError={getFieldError}
                refs={refs}
              />
            </YStack>

            <YStack>
              <SectionTitle>Order summary</SectionTitle>
              <YStack p={16} gap={12} br={20} bg="$glass" borderWidth={1} borderColor="$glassBorder">
                <SummaryRow label={`${book.title} × ${quantity}`} value={formatPrice(subtotal, book.currency)} />
                <SummaryRow
                  label={`Standard shipping, ${SHIPPING_CONFIG.deliveryEstimate}`}
                  value={formatPrice(SHIPPING_CONFIG.flatRate, book.currency)}
                />
                <YStack h={1} bg="$glassBorder" />
                <SummaryRow label={quote ? 'Total, incl. tax' : 'Estimated total'} value={formatPrice(total, currency)} strong />
                {!quote && (
                  <UText variant="body-s" color="$textMuted">
                    The final price, with tax, appears once the address is complete.
                  </UText>
                )}
              </YStack>
            </YStack>
          </YStack>
        </UKeyboardAvoidingView>
      </ScrollView>

      <YStack
        pos="absolute"
        left={0}
        right={0}
        bottom={0}
        pt={14}
        px={16}
        pb={Math.max(bottom, 16)}
        gap={10}
        bg="rgba(7,5,18,0.9)"
        borderTopWidth={1}
        borderTopColor="$glassBorder"
      >
        {quoteError && (
          <XStack gap={6} ai="center" jc="center" accessibilityLiveRegion="polite">
            <Ionicons name="alert-circle-outline" size={14} color={getTokenValue('$errorText', 'color')} />
            <UText variant="body-s" color="$errorText" textAlign="center" flexShrink={1}>
              {quoteError}
            </UText>
          </XStack>
        )}
        <NeonButton
          onPress={handlePlaceOrder}
          disabled={!canPay}
          loading={isCreatingOrder}
          tone={canPay || isCreatingOrder ? 'primary' : 'neutral'}
          title={payLabel}
        />
      </YStack>
    </UScreenLayout>
  );
};

export default CheckoutScreen;
