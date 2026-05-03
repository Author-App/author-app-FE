import React, { memo, RefObject } from 'react';
import { TextInput } from 'react-native';
import { YStack, XStack } from 'tamagui';

import UText from '@/src/components/core/text/uText';
import UInput from '@/src/components/core/inputs/uInput';
import type { ShippingAddress } from '@/src/types/api/print.types';

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
      <InputLabel label="Email" required />
      <UInput
        ref={refs.emailRef}
        placeholder="john@example.com"
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
export const AddressFields = memo(({ values, setFieldValue, getFieldError, refs }: ShippingFormProps) => (
  <YStack gap={14}>
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
          onSubmitEditing={() => refs.stateRef.current?.focus()}
          autoCapitalize="words"
          textContentType="addressCity"
          autoComplete="postal-address-locality"
        />
      </YStack>
      <YStack flex={1}>
        <InputLabel label="State" required />
        <UInput
          ref={refs.stateRef}
          placeholder="NY"
          value={values.stateCode}
          onChangeText={(text) => setFieldValue('stateCode', text.toUpperCase())}
          error={getFieldError('stateCode')}
          returnKeyType="next"
          onSubmitEditing={() => refs.postcodeRef.current?.focus()}
          autoCapitalize="characters"
          maxLength={3}
          textContentType="addressState"
          autoComplete="postal-address-region"
        />
      </YStack>
    </XStack>

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
          keyboardType="default"
          textContentType="postalCode"
          autoComplete="postal-code"
        />
      </YStack>
      <YStack flex={1}>
        <InputLabel label="Country" required />
        <UInput
          placeholder="US"
          value={values.countryCode}
          onChangeText={(text) => setFieldValue('countryCode', text.toUpperCase())}
          error={getFieldError('countryCode')}
          autoCapitalize="characters"
          maxLength={2}
          textContentType="countryName"
          autoComplete="country"
        />
      </YStack>
    </XStack>

    <YStack>
      <InputLabel label="Company" />
      <UInput
        placeholder="Company Name (Optional)"
        value={values.companyName}
        onChangeText={(text) => setFieldValue('companyName', text)}
        error={getFieldError('companyName')}
        autoCapitalize="words"
        textContentType="organizationName"
        autoComplete="organization"
      />
    </YStack>
  </YStack>
));

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
