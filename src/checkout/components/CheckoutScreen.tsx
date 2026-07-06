import React, { useCallback, useMemo, useState } from 'react';
import { Alert, ActivityIndicator, Pressable } from 'react-native';
import { YStack, XStack, ScrollView, Image, Separator } from 'tamagui';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  interpolate,
} from 'react-native-reanimated';

import { UScreenLayout } from '@/src/components/core/layout/UScreenLayout';
import UKeyboardAvoidingView from '@/src/components/core/layout/uKeyboardAvoidingView';
import UText from '@/src/components/core/text/uText';
import UBackButton from '@/src/components/core/buttons/uBackButton';
import { NeonButton } from '@/src/components/core/buttons/neonButton';

import { ContactInfoFields, AddressFields } from './ShippingForm';
import { SHIPPING_CONFIG } from '@/src/types/api/print.types';

import { useBookDetail } from '@/src/book/hooks/useBookDetail';
import { useCheckoutForm } from '../hooks/useCheckoutForm';
import { isPrintBook } from '@/src/utils/bookHelpers';

const AnimatedYStack = Animated.createAnimatedComponent(YStack);

interface CheckoutScreenProps {
  bookId: string;
}

// Inline Quantity Stepper - compact version for the book card
const InlineQuantityStepper = ({ 
  quantity, 
  onChange, 
  min = 1, 
  max = 10 
}: { 
  quantity: number; 
  onChange: (q: number) => void;
  min?: number;
  max?: number;
}) => {
  const canDecrement = quantity > min;
  const canIncrement = quantity < max;

  return (
    <XStack ai="center" gap={2}>
      <Pressable
        onPress={() => canDecrement && onChange(quantity - 1)}
        style={{ opacity: canDecrement ? 1 : 0.3 }}
      >
        <XStack
          w={28}
          h={28}
          borderRadius={8}
          bg="rgba(255, 255, 255, 0.08)"
          ai="center"
          jc="center"
        >
          <Feather name="minus" size={14} color="#fff" />
        </XStack>
      </Pressable>
      
      <XStack
        w={36}
        h={28}
        borderRadius={8}
        bg="rgba(59, 151, 151, 0.2)"
        ai="center"
        jc="center"
      >
        <UText variant="text-sm" color="$brandTeal" fontWeight="700">
          {quantity}
        </UText>
      </XStack>
      
      <Pressable
        onPress={() => canIncrement && onChange(quantity + 1)}
        style={{ opacity: canIncrement ? 1 : 0.3 }}
      >
        <XStack
          w={28}
          h={28}
          borderRadius={8}
          bg="rgba(255, 255, 255, 0.08)"
          ai="center"
          jc="center"
        >
          <Feather name="plus" size={14} color="#fff" />
        </XStack>
      </Pressable>
    </XStack>
  );
};

// Section Header with optional edit button
const SectionHeader = ({ 
  title, 
  onEdit,
  showEdit = false,
}: { 
  title: string; 
  onEdit?: () => void;
  showEdit?: boolean;
}) => (
  <XStack jc="space-between" ai="center" mb={16}>
    <UText variant="text-sm" color="$white" fontWeight="600">
      {title.toUpperCase()}
    </UText>
    {showEdit && onEdit && (
      <Pressable onPress={onEdit}>
        <UText variant="text-xs" color="$brandTeal">
          Edit
        </UText>
      </Pressable>
    )}
  </XStack>
);

// Expandable Order Summary
const OrderSummarySection = ({
  bookTitle,
  bookPrice,
  quantity,
  quote,
  isExpanded,
  onToggle,
}: {
  bookTitle: string;
  bookPrice: number;
  quantity: number;
  quote: any;
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  const subtotal = bookPrice * quantity;
  const shipping = SHIPPING_CONFIG.flatRate;
  const total = quote ? quote.amountCents / 100 : subtotal + shipping;
  
  const expandProgress = useSharedValue(isExpanded ? 1 : 0);
  
  React.useEffect(() => {
    expandProgress.value = withTiming(isExpanded ? 1 : 0, { duration: 200 });
  }, [isExpanded]);
  
  const contentStyle = useAnimatedStyle(() => ({
    opacity: expandProgress.value,
    maxHeight: interpolate(expandProgress.value, [0, 1], [0, 200]),
    overflow: 'hidden' as const,
  }));
  
  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${interpolate(expandProgress.value, [0, 1], [0, 180])}deg` }],
  }));

  return (
    <YStack gap={12}>
      {/* Expandable header */}
      <Pressable onPress={onToggle}>
        <XStack jc="space-between" ai="center">
          <XStack ai="center" gap={8}>
            <UText variant="text-xs" color="$neutral4">
              Order Summary
            </UText>
            <Animated.View style={chevronStyle}>
              <Feather name="chevron-up" size={14} color="#8E8E93" />
            </Animated.View>
          </XStack>
        </XStack>
      </Pressable>

      {/* Expandable content */}
      <AnimatedYStack style={contentStyle}>
        <YStack gap={10} pb={8}>
          <XStack jc="space-between">
            <UText variant="text-xs" color="$neutral4" numberOfLines={1} flex={1} mr={16}>
              {bookTitle} × {quantity}
            </UText>
            <UText variant="text-xs" color="$neutral3">
              ${subtotal.toFixed(2)}
            </UText>
          </XStack>
          
          <XStack jc="space-between">
            <UText variant="text-xs" color="$neutral4">
              Shipping ({SHIPPING_CONFIG.deliveryEstimate})
            </UText>
            <UText variant="text-xs" color="$neutral3">
              ${shipping.toFixed(2)}
            </UText>
          </XStack>
          
          {quote && (
            <XStack jc="space-between">
              <UText variant="text-xs" color="$neutral4">
                Tax
              </UText>
              <UText variant="text-xs" color="$neutral3">
                ${((quote.amountCents / 100) - subtotal - shipping).toFixed(2)}
              </UText>
            </XStack>
          )}
        </YStack>
      </AnimatedYStack>

      {/* Always visible total line */}
      <Separator borderColor="rgba(255, 255, 255, 0.08)" />
      <XStack jc="space-between" ai="center">
        <UText variant="text-sm" color="$white" fontWeight="600">
          Total
        </UText>
        <UText variant="text-md" color="$brandTeal" fontWeight="700">
          ${total.toFixed(2)}
        </UText>
      </XStack>
    </YStack>
  );
};

const CheckoutScreen = ({ bookId }: CheckoutScreenProps) => {
  const { top, bottom } = useSafeAreaInsets();
  const [showOrderSummary, setShowOrderSummary] = useState(false);

  // Fetch book details
  const { book, isLoading: isLoadingBook } = useBookDetail(bookId);

  // Success handler
  const handleSuccess = useCallback((printOrderId: string) => {
    Alert.alert(
      'Order Placed!',
      'Your print book order has been placed successfully. You will receive an email with tracking information once your order ships.',
      [{ text: 'View Orders', onPress: () => router.back() }]
    );
  }, []);

  // Error handler
  const handleError = useCallback((message: string) => {
    Alert.alert('Order Error', message);
  }, []);

  // Form hook
  const {
    values,
    setFieldValue,
    getFieldError,
    quantity,
    handleQuantityChange,
    quote,
    isPending,
    isGettingQuote,
    quoteError,
    isCreatingOrder,
    handlePlaceOrder,
    isFormValid,
    isProcessing,
    hasContactErrors,
    hasAddressErrors,
    refs,
  } = useCheckoutForm({
    bookId,
    onSuccess: handleSuccess,
    onError: handleError,
  });

  // Validate book is a print book
  const isValidPrintBook = useMemo(() => {
    if (!book) return false;
    return isPrintBook(book.type);
  }, [book]);

  // Handle back navigation
  const handleBack = useCallback(() => {
    router.back();
  }, []);

  // Calculate total for button
  const buttonTotal = useMemo(() => {
    if (quote) return (quote.amountCents / 100).toFixed(2);
    const subtotal = (book?.price || 0) * quantity;
    return (subtotal + SHIPPING_CONFIG.flatRate).toFixed(2);
  }, [quote, book?.price, quantity]);

  // Loading state
  if (isLoadingBook) {
    return (
      <UScreenLayout pt={top}>
        <XStack px={20} py={12}>
          <UBackButton variant="glass-md" />
        </XStack>
        <YStack flex={1} ai="center" jc="center">
          <ActivityIndicator size="large" color="#3B9797" />
        </YStack>
      </UScreenLayout>
    );
  }

  // Book not found
  if (!book) {
    return (
      <UScreenLayout pt={top}>
        <XStack px={20} py={12}>
          <UBackButton variant="glass-md" />
        </XStack>
        <YStack flex={1} ai="center" jc="center" gap={16} px={24}>
          <XStack w={64} h={64} borderRadius={32} bg="rgba(231, 76, 60, 0.15)" ai="center" jc="center">
            <Feather name="alert-circle" size={32} color="#E74C3C" />
          </XStack>
          <UText variant="heading-h2" color="$white" textAlign="center">
            Book Not Found
          </UText>
          <NeonButton onPress={handleBack} title="Go Back" />
        </YStack>
      </UScreenLayout>
    );
  }

  // Not a print book
  if (!isValidPrintBook) {
    return (
      <UScreenLayout pt={top}>
        <XStack px={20} py={12}>
          <UBackButton variant="glass-md" />
        </XStack>
        <YStack flex={1} ai="center" jc="center" gap={16} px={24}>
          <XStack w={64} h={64} borderRadius={32} bg="rgba(59, 151, 151, 0.15)" ai="center" jc="center">
            <Feather name="info" size={32} color="#3B9797" />
          </XStack>
          <UText variant="heading-h2" color="$white" textAlign="center">
            Not Available for Print
          </UText>
          <UText variant="text-md" color="$neutral4" textAlign="center">
            This book is not available as a print book.
          </UText>
          <NeonButton onPress={handleBack} title="Go Back" />
        </YStack>
      </UScreenLayout>
    );
  }

  const displayType = book.type === 'hardcover' ? 'Hardcover' : 'Paperback';

  return (
    <UScreenLayout pt={top}>
      {/* Header */}
      <XStack px={20} py={12} ai="center" jc="space-between">
        <UBackButton variant="glass-md" />
        <UText variant="text-md" color="$white" fontWeight="600">
          Checkout
        </UText>
        <XStack w={40} />
      </XStack>

      <ScrollView 
        flex={1} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottom + 180 }}
        keyboardShouldPersistTaps="handled"
      >
        <UKeyboardAvoidingView dismissOnTap={true}>
          <YStack px={20} gap={24}>
            
            {/* ═══════════════════════════════════════════════════════
                BOOK CARD - Receipt style with inline quantity
            ═══════════════════════════════════════════════════════ */}
            <YStack
              bg="rgba(255, 255, 255, 0.03)"
              borderRadius={16}
              p={16}
              borderWidth={1}
              borderColor="rgba(255, 255, 255, 0.06)"
            >
              <XStack gap={14}>
                {/* Book Cover */}
                <YStack
                  w={60}
                  h={86}
                  borderRadius={8}
                  overflow="hidden"
                  bg="rgba(255, 255, 255, 0.05)"
                >
                  {book.thumbnail ? (
                    <Image
                      source={{ uri: book.thumbnail }}
                      width={60}
                      height={86}
                      resizeMode="cover"
                    />
                  ) : (
                    <YStack flex={1} ai="center" jc="center">
                      <Feather name="book" size={24} color="#666" />
                    </YStack>
                  )}
                </YStack>

                {/* Book Info + Quantity */}
                <YStack flex={1} jc="space-between">
                  <YStack gap={2}>
                    <UText variant="text-sm" color="$white" fontWeight="600" numberOfLines={2}>
                      {book.title}
                    </UText>
                    <UText variant="text-xs" color="$neutral4">
                      by {book.author}
                    </UText>
                  </YStack>
                  
                  <XStack ai="center" jc="space-between" mt={8}>
                    <XStack ai="center" gap={8}>
                      <XStack
                        px={8}
                        py={3}
                        borderRadius={6}
                        bg="rgba(169, 29, 58, 0.15)"
                      >
                        <UText variant="text-2xs" color="$brandCrimson" fontWeight="600">
                          {displayType}
                        </UText>
                      </XStack>
                      <UText variant="text-sm" color="$brandTeal" fontWeight="700">
                        ${book.price?.toFixed(2)}
                      </UText>
                    </XStack>
                    
                    <InlineQuantityStepper
                      quantity={quantity}
                      onChange={handleQuantityChange}
                    />
                  </XStack>
                </YStack>
              </XStack>
            </YStack>

            {/* ═══════════════════════════════════════════════════════
                CONTACT INFORMATION - Always visible form
            ═══════════════════════════════════════════════════════ */}
            <YStack>
              <SectionHeader title="Contact Information" />
              <ContactInfoFields
                values={values}
                setFieldValue={setFieldValue}
                getFieldError={getFieldError}
                refs={refs}
              />
            </YStack>

            {/* ═══════════════════════════════════════════════════════
                SHIPPING ADDRESS - Always visible form
            ═══════════════════════════════════════════════════════ */}
            <YStack>
              <SectionHeader title="Shipping Address" />
              <AddressFields
                values={values}
                setFieldValue={setFieldValue}
                getFieldError={getFieldError}
                refs={refs}
              />
            </YStack>

            {/* ═══════════════════════════════════════════════════════
                SHIPPING METHOD - Simple selectable card
            ═══════════════════════════════════════════════════════ */}
            <YStack>
              <SectionHeader title="Shipping Method" />
              <XStack
                bg="rgba(59, 151, 151, 0.08)"
                borderRadius={12}
                p={14}
                borderWidth={1}
                borderColor="rgba(59, 151, 151, 0.2)"
                ai="center"
                gap={12}
              >
                <XStack
                  w={20}
                  h={20}
                  borderRadius={10}
                  borderWidth={2}
                  borderColor="$brandTeal"
                  ai="center"
                  jc="center"
                >
                  <XStack w={10} h={10} borderRadius={5} bg="$brandTeal" />
                </XStack>
                <YStack flex={1}>
                  <UText variant="text-sm" color="$white" fontWeight="500">
                    Standard Shipping
                  </UText>
                  <UText variant="text-xs" color="$neutral4">
                    {SHIPPING_CONFIG.deliveryEstimate}
                  </UText>
                </YStack>
                <UText variant="text-sm" color="$brandTeal" fontWeight="600">
                  ${SHIPPING_CONFIG.flatRate.toFixed(2)}
                </UText>
              </XStack>
            </YStack>

          </YStack>
        </UKeyboardAvoidingView>
      </ScrollView>

      {/* ═══════════════════════════════════════════════════════
          STICKY BOTTOM - Order summary + CTA button
      ═══════════════════════════════════════════════════════ */}
      <YStack
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          px={20}
          pt={16}
          pb={bottom + 16}
          bg="rgba(10, 25, 47, 0.98)"
          borderTopWidth={1}
          borderTopColor="rgba(255, 255, 255, 0.08)"
          gap={16}
        >
          {/* Order Summary (expandable) */}
          <OrderSummarySection
            bookTitle={book.title}
            bookPrice={book.price || 0}
            quantity={quantity}
            quote={quote}
            isExpanded={showOrderSummary}
            onToggle={() => setShowOrderSummary(!showOrderSummary)}
          />

          {/* Error message if any */}
          {quoteError && (
            <UText variant="text-xs" color="#E74C3C" textAlign="center">
              {quoteError}
            </UText>
          )}

          {/* Pay Button with total */}
          <NeonButton
            onPress={handlePlaceOrder}
            disabled={isCreatingOrder || !isFormValid || isPending || isGettingQuote}
            loading={isCreatingOrder}
          >
            <XStack ai="center" gap={8}>
              {(isPending || isGettingQuote) && (
                <ActivityIndicator size="small" color="#fff" />
              )}
              <UText variant="text-sm" color="white" fontWeight="600">
                {isCreatingOrder 
                  ? 'Processing...' 
                  : isPending || isGettingQuote 
                    ? 'Calculating...'
                    : `Pay $${buttonTotal}`
                }
              </UText>
            </XStack>
          </NeonButton>
        </YStack>
    </UScreenLayout>
  );
};

export default CheckoutScreen;
