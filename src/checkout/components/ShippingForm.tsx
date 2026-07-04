import React, { memo, RefObject, useCallback, useState } from 'react';
import { TextInput, ScrollView, Pressable, Text } from 'react-native';
import { YStack, XStack } from 'tamagui';
import { Feather } from '@expo/vector-icons';

import UText from '@/src/components/core/text/uText';
import UInput from '@/src/components/core/inputs/uInput';
import type { ShippingAddress } from '@/src/types/api/print.types';
import { US_STATES } from '@/src/types/api/print.types';

interface ShippingFormProps {
  values: ShippingAddress;
  setFieldValue: (field: string, value: string) => void;
  getFieldError: (field: keyof ShippingAddress) => string | undefined;
  refs: {
    lastNameRef: RefObject<TextInput | null>;
    street1Ref: RefObject<TextInput | null>;
    street2Ref: RefObject<TextInput | null>;
    cityRef: RefObject<TextInput | null>;
    stateRef: RefObject<TextInput | null>;
    postcodeRef: RefObject<TextInput | null>;
    phoneRef: RefObject<TextInput | null>;
    emailRef: RefObject<TextInput | null>;
  };
}

// Label component for inputs
const InputLabel = ({ label, required = false }: { label: string; required?: boolean }) => (
  <UText variant="text-xs" color="$neutral3" mb={6}>
    {label}{required && <UText color="$brandCrimson"> *</UText>}
  </UText>
);

// Contact Information Fields
export const ContactInfoFields = memo(({ values, setFieldValue, getFieldError, refs }: ShippingFormProps) => (
  <YStack gap={14}>
    <XStack gap={12}>
      <YStack flex={1}>
        <InputLabel label="First Name" required />
        <UInput
          placeholder="John"
          value={values.firstName}
          onChangeText={(text) => setFieldValue('firstName', text)}
          error={getFieldError('firstName')}
          returnKeyType="next"
          onSubmitEditing={() => refs.lastNameRef.current?.focus()}
          autoCapitalize="words"
          textContentType="givenName"
          autoComplete="given-name"
        />
      </YStack>
      <YStack flex={1}>
        <InputLabel label="Last Name" required />
        <UInput
          ref={refs.lastNameRef}
          placeholder="Doe"
          value={values.lastName}
          onChangeText={(text) => setFieldValue('lastName', text)}
          error={getFieldError('lastName')}
          returnKeyType="next"
          onSubmitEditing={() => refs.emailRef.current?.focus()}
          autoCapitalize="words"
          textContentType="familyName"
          autoComplete="family-name"
        />
      </YStack>
    </XStack>

    <YStack>
      <InputLabel label="Email" />
      <UInput
        ref={refs.emailRef}
        placeholder="john@example.com (Optional)"
        value={values.email}
        onChangeText={(text) => setFieldValue('email', text.toLowerCase())}
        error={getFieldError('email')}
        returnKeyType="next"
        onSubmitEditing={() => refs.phoneRef.current?.focus()}
        keyboardType="email-address"
        autoCapitalize="none"
        textContentType="emailAddress"
        autoComplete="email"
      />
    </YStack>

    <YStack>
      <InputLabel label="Phone Number" required />
      <UInput
        ref={refs.phoneRef}
        placeholder="+1 (555) 123-4567"
        value={values.phone}
        onChangeText={(text) => setFieldValue('phone', text)}
        error={getFieldError('phone')}
        returnKeyType="next"
        onSubmitEditing={() => refs.street1Ref.current?.focus()}
        keyboardType="phone-pad"
        textContentType="telephoneNumber"
        autoComplete="tel"
      />
    </YStack>
  </YStack>
));

ContactInfoFields.displayName = 'ContactInfoFields';

// Address Fields
export const AddressFields = memo(({ values, setFieldValue, getFieldError, refs }: ShippingFormProps) => {
  const [showStatePicker, setShowStatePicker] = useState(false);

  // Handle state selection
  const handleStateSelect = useCallback((stateCode: string) => {
    setFieldValue('stateCode', stateCode);
    setShowStatePicker(false);
  }, [setFieldValue]);

  return (
    <YStack gap={14}>
      {/* USA Only Notice */}
      <XStack
        px={12}
        py={10}
        borderRadius={10}
        bg="rgba(59, 151, 151, 0.1)"
        borderWidth={1}
        borderColor="rgba(59, 151, 151, 0.2)"
        ai="center"
        gap={10}
      >
        <Feather name="flag" size={16} color="#3B9797" />
        <UText variant="text-xs" color="$brandTeal">
          Shipping available to United States only
        </UText>
      </XStack>

      {/* Street Address */}
      <YStack>
        <InputLabel label="Street Address" required />
        <UInput
          ref={refs.street1Ref}
          placeholder="123 Main Street"
          value={values.street1}
          onChangeText={(text) => setFieldValue('street1', text)}
          error={getFieldError('street1')}
          returnKeyType="next"
          onSubmitEditing={() => refs.street2Ref.current?.focus()}
          autoCapitalize="words"
          textContentType="streetAddressLine1"
          autoComplete="street-address"
        />
      </YStack>

      {/* Apt/Suite */}
      <YStack>
        <InputLabel label="Apt, Suite, Unit" />
        <UInput
          ref={refs.street2Ref}
          placeholder="Apt 4B (Optional)"
          value={values.street2}
          onChangeText={(text) => setFieldValue('street2', text)}
          error={getFieldError('street2')}
          returnKeyType="next"
          onSubmitEditing={() => refs.cityRef.current?.focus()}
          autoCapitalize="words"
          textContentType="streetAddressLine2"
          autoComplete="address-line2"
        />
      </YStack>

      {/* City & State */}
      <XStack gap={12}>
        <YStack flex={2}>
          <InputLabel label="City" required />
          <UInput
            ref={refs.cityRef}
            placeholder="New York"
            value={values.city}
            onChangeText={(text) => setFieldValue('city', text)}
            error={getFieldError('city')}
            returnKeyType="next"
            onSubmitEditing={() => setShowStatePicker(true)}
            autoCapitalize="words"
            textContentType="addressCity"
            autoComplete="postal-address-locality"
          />
        </YStack>
        <YStack flex={1}>
          <InputLabel label="State" required />
          <Pressable onPress={() => setShowStatePicker(!showStatePicker)}>
            <XStack
              h={48}
              px={14}
              borderRadius={12}
              bg="rgba(255, 255, 255, 0.05)"
              borderWidth={1}
              borderColor={getFieldError('stateCode') ? '$brandCrimson' : 'rgba(255, 255, 255, 0.1)'}
              ai="center"
              jc="space-between"
            >
              <UText
                variant="text-sm"
                color={values.stateCode ? '$white' : '$neutral4'}
              >
                {values.stateCode || 'Select'}
              </UText>
              <Feather name="chevron-down" size={16} color="#8E8E93" />
            </XStack>
          </Pressable>
          {getFieldError('stateCode') && (
            <UText variant="text-xs" color="$brandCrimson" mt={4}>
              {getFieldError('stateCode')}
            </UText>
          )}
        </YStack>
      </XStack>

      {/* State Picker Dropdown */}
      {showStatePicker && (
        <YStack
          bg="rgba(30, 30, 35, 0.98)"
          borderRadius={12}
          borderWidth={1}
          borderColor="rgba(255, 255, 255, 0.1)"
          maxHeight={200}
          overflow="hidden"
        >
          <ScrollView showsVerticalScrollIndicator={true}>
            {US_STATES.map((state) => (
              <Pressable
                key={state.code}
                onPress={() => handleStateSelect(state.code)}
              >
                <XStack
                  px={14}
                  py={12}
                  ai="center"
                  jc="space-between"
                  bg={values.stateCode === state.code ? 'rgba(59, 151, 151, 0.15)' : 'transparent'}
                  borderBottomWidth={1}
                  borderBottomColor="rgba(255, 255, 255, 0.05)"
                >
                  <UText variant="text-sm" color="$white">
                    {state.name}
                  </UText>
                  <UText variant="text-xs" color="$neutral4">
                    {state.code}
                  </UText>
                </XStack>
              </Pressable>
            ))}
          </ScrollView>
        </YStack>
      )}

      {/* ZIP Code & Country (locked to US) */}
      <XStack gap={12}>
        <YStack flex={1}>
          <InputLabel label="ZIP Code" required />
          <UInput
            ref={refs.postcodeRef}
            placeholder="10001"
            value={values.postcode}
            onChangeText={(text) => setFieldValue('postcode', text)}
            error={getFieldError('postcode')}
            returnKeyType="done"
            keyboardType="number-pad"
            maxLength={10}
            textContentType="postalCode"
            autoComplete="postal-code"
          />
        </YStack>
        <YStack flex={1}>
          <InputLabel label="Country" required />
          <XStack
            h={48}
            px={14}
            borderRadius={12}
            bg="rgba(255, 255, 255, 0.03)"
            borderWidth={1}
            borderColor="rgba(255, 255, 255, 0.1)"
            ai="center"
            gap={8}
          >
            <Text style={{ fontSize: 16 }}>🇺🇸</Text>
            <UText variant="text-sm" color="$neutral3">
              United States
            </UText>
          </XStack>
        </YStack>
      </XStack>

    </YStack>
  );
});

AddressFields.displayName = 'AddressFields';

// Legacy default export for backward compatibility
const ShippingForm = memo(({ values, setFieldValue, getFieldError, refs }: ShippingFormProps) => {
  return (
    <YStack gap={16}>
      <ContactInfoFields
        values={values}
        setFieldValue={setFieldValue}
        getFieldError={getFieldError}
        refs={refs}
      />
      <AddressFields
        values={values}
        setFieldValue={setFieldValue}
        getFieldError={getFieldError}
        refs={refs}
      />
    </YStack>
  );
});

ShippingForm.displayName = 'ShippingForm';

export default ShippingForm;
