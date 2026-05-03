import React, { useCallback, useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { YStack, XStack, ScrollView, Image } from 'tamagui';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UScreenLayout } from '@/src/components/core/layout/UScreenLayout';
import UText from '@/src/components/core/text/uText';
import UBackButton from '@/src/components/core/buttons/uBackButton';
import { NeonButton } from '@/src/components/core/buttons/neonButton';

import { ContactInfoFields, AddressFields } from './ShippingForm';
import ShippingOptions from './ShippingOptions';
import OrderSummary from './OrderSummary';
import QuantitySelector from './QuantitySelector';
import CollapsibleSection from './CollapsibleSection';

import { useBookDetail } from '@/src/book/hooks/useBookDetail';
import { useCheckoutForm } from '../hooks/useCheckoutForm';
import { isPrintBook } from '@/src/types/api/library.types';

type SectionId = 'quantity' | 'contact' | 'address' | 'shipping' | 'summary';

interface CheckoutScreenProps {
  bookId: string;
}

const CheckoutScreen = ({ bookId }: CheckoutScreenProps) => {
  const { top, bottom } = useSafeAreaInsets();
  
  // Accordion state - only one section open at a time
  const [openSection, setOpenSection] = useState<SectionId>('quantity');
  
  const handleToggleSection = useCallback((id: string) => {
    setOpenSection(current => current === id ? '' as SectionId : id as SectionId);
  }, []);

  // Fetch book details
  const { book, isLoading: isLoadingBook } = useBookDetail(bookId);

  // Success handler
  const handleSuccess = useCallback((printOrderId: string) => {
    Alert.alert(
      'Order Placed!',
      'Your print book order has been placed successfully. You will receive an email with tracking information once your order ships.',
      [
        {
          text: 'View Orders',
          onPress: () => {
            router.back();
          },
        },
      ]
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
    shippingOption,
    handleShippingOptionChange,
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
        <XStack w={40} /> {/* Spacer for centering */}
      </XStack>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={100}
      >
        <ScrollView flex={1} showsVerticalScrollIndicator={false}>
          <YStack px={20} pb={bottom + 140} gap={12}>
            
            {/* Book Info Card - Always visible */}
            <YStack
              bg="rgba(255, 255, 255, 0.03)"
              borderRadius={16}
              borderWidth={1}
              borderColor="rgba(255, 255, 255, 0.08)"
              p={16}
            >
              <XStack gap={14} ai="center">
                {/* Book Cover */}
                <YStack
                  w={70}
                  h={100}
                  borderRadius={10}
                  overflow="hidden"
                  bg="rgba(255, 255, 255, 0.05)"
                  shadowColor="#000"
                  shadowOffset={{ width: 0, height: 4 }}
                  shadowOpacity={0.3}
                  shadowRadius={8}
                >
                  {book.thumbnail ? (
                    <Image
                      source={{ uri: book.thumbnail }}
                      width={70}
                      height={100}
                      resizeMode="cover"
                    />
                  ) : (
                    <YStack flex={1} ai="center" jc="center">
                      <Feather name="book" size={28} color="#8E8E93" />
                    </YStack>
                  )}
                </YStack>

                {/* Book Details */}
                <YStack flex={1} gap={6}>
                  <UText variant="text-md" color="$white" fontWeight="600" numberOfLines={2}>
                    {book.title}
                  </UText>
                  <UText variant="text-xs" color="$neutral4">
                    by {book.author}
                  </UText>
                  <XStack ai="center" gap={8} mt={4}>
                    <XStack
                      px={10}
                      py={4}
                      borderRadius={8}
                      bg="rgba(169, 29, 58, 0.2)"
                    >
                      <UText variant="text-2xs" color="$brandCrimson" fontWeight="600">
                        {displayType}
                      </UText>
                    </XStack>
                    <UText variant="text-sm" color="$brandTeal" fontWeight="700">
                      ${book.price?.toFixed(2) || '0.00'}
                    </UText>
                  </XStack>
                </YStack>
              </XStack>
            </YStack>

            {/* Collapsible Sections */}
            
            {/* Quantity Section */}
            <CollapsibleSection
              id="quantity"
              title="Quantity"
              icon="package"
              isOpen={openSection === 'quantity'}
              onToggle={handleToggleSection}
              completedText={`${quantity} ${quantity === 1 ? 'copy' : 'copies'}`}
              isCompleted={quantity > 0}
            >
              <QuantitySelector
                quantity={quantity}
                onChange={handleQuantityChange}
              />
            </CollapsibleSection>

            {/* Contact Information Section */}
            <CollapsibleSection
              id="contact"
              title="Contact Information"
              icon="user"
              isOpen={openSection === 'contact'}
              onToggle={handleToggleSection}
              completedText={values.email || 'Not provided'}
              isCompleted={Boolean(values.firstName && values.lastName && values.email && values.phone)}
              hasError={hasContactErrors}
            >
              <ContactInfoFields
                values={values}
                setFieldValue={setFieldValue}
                getFieldError={getFieldError}
                refs={refs}
              />
            </CollapsibleSection>

            {/* Shipping Address Section */}
            <CollapsibleSection
              id="address"
              title="Shipping Address"
              icon="map-pin"
              isOpen={openSection === 'address'}
              onToggle={handleToggleSection}
              completedText={values.city ? `${values.city}, ${values.stateCode}` : 'Not provided'}
              isCompleted={Boolean(values.street1 && values.city && values.stateCode && values.postcode && values.countryCode)}
              hasError={hasAddressErrors}
            >
              <AddressFields
                values={values}
                setFieldValue={setFieldValue}
                getFieldError={getFieldError}
                refs={refs}
              />
            </CollapsibleSection>

            {/* Shipping Method Section */}
            <CollapsibleSection
              id="shipping"
              title="Shipping Method"
              icon="truck"
              isOpen={openSection === 'shipping'}
              onToggle={handleToggleSection}
              completedText={shippingOption.replace(/_/g, ' ')}
              isCompleted={Boolean(shippingOption)}
            >
              <ShippingOptions
                selected={shippingOption}
                onSelect={handleShippingOptionChange}
              />
            </CollapsibleSection>

            {/* Order Summary Section */}
            <CollapsibleSection
              id="summary"
              title="Order Summary"
              icon="shopping-bag"
              isOpen={openSection === 'summary'}
              onToggle={handleToggleSection}
              completedText={quote ? `$${(quote.amountCents / 100).toFixed(2)}` : 'Pending'}
              isCompleted={Boolean(quote)}
            >
              <OrderSummary
                quote={quote}
                quantity={quantity}
                bookTitle={book.title}
                bookType={book.type || 'paperback'}
                bookPrice={book.price || 0}
              />
            </CollapsibleSection>
          </YStack>
        </ScrollView>

        {/* Bottom Action Buttons */}
        <YStack
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          px={20}
          py={16}
          pb={bottom + 16}
          bg="rgba(10, 25, 47, 0.95)"
          borderTopWidth={1}
          borderTopColor="rgba(255, 255, 255, 0.08)"
        >
          {!quote && !isGettingQuote ? (
            // No quote yet - form needs to be completed or error
            <YStack ai="center" py={8}>
              <UText 
                variant="text-xs" 
                color={quoteError ? '#E74C3C' : '$neutral4'} 
                textAlign="center"
              >
                {quoteError || 'Complete all fields to see shipping costs'}
              </UText>
            </YStack>
          ) : (
            // Show quote (or loading state)
            <YStack gap={10}>
              <XStack jc="space-between" ai="center" px={4}>
                <XStack ai="center" gap={6}>
                  <UText variant="text-xs" color="$neutral4">
                    Total
                  </UText>
                  {(isPending || isGettingQuote) && (
                    <XStack ai="center" gap={4}>
                      <ActivityIndicator size="small" color="#3B9797" />
                      <UText variant="text-2xs" color="$neutral5">
                        {isGettingQuote ? 'Calculating...' : 'Updating...'}
                      </UText>
                    </XStack>
                  )}
                </XStack>
                <UText 
                  variant="text-md" 
                  color={isPending || isGettingQuote ? '$neutral4' : '$brandTeal'} 
                  fontWeight="700"
                  opacity={isPending ? 0.6 : 1}
                >
                  {quote ? `$${(quote.amountCents / 100).toFixed(2)}` : '—'}
                </UText>
              </XStack>
              <NeonButton
                onPress={handlePlaceOrder}
                disabled={isCreatingOrder || !isFormValid || isPending || isGettingQuote}
                loading={isCreatingOrder}
                title="Place Order"
              />
            </YStack>
          )}
        </YStack>
      </KeyboardAvoidingView>
    </UScreenLayout>
  );
};

export default CheckoutScreen;
