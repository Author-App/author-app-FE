import React, { memo, RefObject, useState } from 'react';
import { TextInput, ScrollView } from 'react-native';
import { XStack, YStack, getTokenValue } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

import UText from '@/src/components/core/text/uText';
import UInput, { FieldError } from '@/src/components/core/inputs/uInput';
import type { ShippingAddress } from '@/src/types/api/print.types';
import { US_STATES } from '@/src/types/api/print.types';

interface ShippingFormProps {
  values: ShippingAddress;
  setFieldValue: (field: string, value: string) => void;
  touchField: (field: keyof ShippingAddress) => void;
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

/** Glass field bound to one form key: value, change, blur-to-touch and its error. */
const bindField = ({ values, setFieldValue, touchField, getFieldError }: ShippingFormProps) => (field: keyof ShippingAddress) => ({
  variant: 'glass' as const,
  value: values[field] ?? '',
  onChangeText: (text: string) => setFieldValue(field, text),
  onBlur: () => touchField(field),
  error: getFieldError(field),
});

export const ContactInfoFields = memo(function ContactInfoFields(props: ShippingFormProps) {
  const field = bindField(props);
  const { refs, setFieldValue } = props;

  return (
    <YStack gap={14}>
      <XStack gap={12}>
        <YStack flex={1}>
          <UInput
            {...field('firstName')}
            label="First name"
            placeholder="John"
            returnKeyType="next"
            onSubmitEditing={() => refs.lastNameRef.current?.focus()}
            autoCapitalize="words"
            textContentType="givenName"
            autoComplete="given-name"
          />
        </YStack>
        <YStack flex={1}>
          <UInput
            {...field('lastName')}
            ref={refs.lastNameRef}
            label="Last name"
            placeholder="Doe"
            returnKeyType="next"
            onSubmitEditing={() => refs.emailRef.current?.focus()}
            autoCapitalize="words"
            textContentType="familyName"
            autoComplete="family-name"
          />
        </YStack>
      </XStack>

      <UInput
        {...field('email')}
        ref={refs.emailRef}
        label="Email (optional)"
        placeholder="john@example.com"
        onChangeText={(text) => setFieldValue('email', text.toLowerCase())}
        returnKeyType="next"
        onSubmitEditing={() => refs.phoneRef.current?.focus()}
        keyboardType="email-address"
        autoCapitalize="none"
        textContentType="emailAddress"
        autoComplete="email"
      />

      <UInput
        {...field('phone')}
        ref={refs.phoneRef}
        label="Phone number"
        placeholder="+1 (555) 123-4567"
        returnKeyType="next"
        onSubmitEditing={() => refs.street1Ref.current?.focus()}
        keyboardType="phone-pad"
        textContentType="telephoneNumber"
        autoComplete="tel"
      />
    </YStack>
  );
});

export const AddressFields = memo(function AddressFields(props: ShippingFormProps) {
  const field = bindField(props);
  const { values, refs, setFieldValue, touchField, getFieldError } = props;
  const [showStatePicker, setShowStatePicker] = useState(false);
  const stateError = getFieldError('stateCode');
  const muted = getTokenValue('$textMuted', 'color');

  const selectState = (stateCode: string) => {
    setFieldValue('stateCode', stateCode);
    touchField('stateCode');
    setShowStatePicker(false);
    refs.postcodeRef.current?.focus();
  };

  return (
    <YStack gap={14}>
      <XStack px={12} py={10} gap={10} ai="center" br={12} bg="$glassCyan" borderWidth={1} borderColor="$glassCyanBorder">
        <Ionicons name="flag-outline" size={16} color={getTokenValue('$accentCyan', 'color')} />
        <UText variant="body-s" color="$accentCyan">
          Shipping to the United States only
        </UText>
      </XStack>

      <UInput
        {...field('street1')}
        ref={refs.street1Ref}
        label="Street address"
        placeholder="123 Main Street"
        returnKeyType="next"
        onSubmitEditing={() => refs.street2Ref.current?.focus()}
        autoCapitalize="words"
        textContentType="streetAddressLine1"
        autoComplete="street-address"
      />

      <UInput
        {...field('street2')}
        ref={refs.street2Ref}
        label="Apt, suite, unit (optional)"
        placeholder="Apt 4B"
        returnKeyType="next"
        onSubmitEditing={() => refs.cityRef.current?.focus()}
        autoCapitalize="words"
        textContentType="streetAddressLine2"
        autoComplete="address-line2"
      />

      <XStack gap={12} ai="flex-start">
        <YStack flex={2}>
          <UInput
            {...field('city')}
            ref={refs.cityRef}
            label="City"
            placeholder="New York"
            returnKeyType="next"
            onSubmitEditing={() => setShowStatePicker(true)}
            autoCapitalize="words"
            textContentType="addressCity"
            autoComplete="postal-address-locality"
          />
        </YStack>
        <YStack flex={1} gap={6}>
          <UText variant="meta" color={showStatePicker ? '$accentCyan' : '$textSecondary'}>
            State
          </UText>
          <XStack
            h={50}
            px={14}
            br={14}
            ai="center"
            jc="space-between"
            borderWidth={1}
            bg={stateError ? '$inputErrorBg' : showStatePicker ? '$glassCyan' : '$glass'}
            borderColor={stateError ? '$inputErrorBorder' : showStatePicker ? '$accentCyan' : '$inputBorder'}
            onPress={() => setShowStatePicker((open) => !open)}
            accessible
            accessibilityRole="button"
            accessibilityLabel={`State, ${values.stateCode || 'not selected'}`}
            accessibilityState={{ expanded: showStatePicker }}
          >
            <UText variant="body" fontSize={15} color={values.stateCode ? '$textPrimary' : '$textMuted'}>
              {values.stateCode || 'Select'}
            </UText>
            <Ionicons name={showStatePicker ? 'chevron-up' : 'chevron-down'} size={16} color={muted} />
          </XStack>
          {stateError && <FieldError message={stateError} />}
        </YStack>
      </XStack>

      {showStatePicker && (
        <YStack maxHeight={220} br={14} overflow="hidden" bg="rgba(10,8,20,0.98)" borderWidth={1} borderColor="$glassBorder">
          <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled">
            {US_STATES.map((state) => {
              const isSelected = values.stateCode === state.code;
              return (
                <XStack
                  key={state.code}
                  px={14}
                  py={12}
                  ai="center"
                  jc="space-between"
                  bg={isSelected ? 'rgba(135,54,247,0.18)' : 'transparent'}
                  borderBottomWidth={1}
                  borderBottomColor="$glassBorder"
                  onPress={() => selectState(state.code)}
                  accessible
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                >
                  <UText variant="body" fontSize={15} color="$textPrimary">
                    {state.name}
                  </UText>
                  <UText variant="meta-s" color="$textMuted">
                    {state.code}
                  </UText>
                </XStack>
              );
            })}
          </ScrollView>
        </YStack>
      )}

      <XStack gap={12} ai="flex-start">
        <YStack flex={1}>
          <UInput
            {...field('postcode')}
            ref={refs.postcodeRef}
            label="ZIP code"
            placeholder="10001"
            returnKeyType="done"
            keyboardType="number-pad"
            maxLength={10}
            textContentType="postalCode"
            autoComplete="postal-code"
          />
        </YStack>
        <YStack flex={1} gap={6}>
          <UText variant="meta" color="$textSecondary">
            Country
          </UText>
          <XStack h={50} px={14} br={14} ai="center" bg="$glass" borderWidth={1} borderColor="$inputBorder" opacity={0.7}>
            <UText variant="body" fontSize={15} color="$textSecondary">
              United States
            </UText>
          </XStack>
        </YStack>
      </XStack>
    </YStack>
  );
});
