import { forwardRef, memo, useMemo, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { GetProps, GetThemeValueForKey, Input as TamaguiInput, XStack, YStack, getTokenValue } from 'tamagui';

import { UInputVariant } from '@/src/components/core/types/input/inputVariants';
import UText from '@/src/components/core/text/uText';

interface UInputProps extends Omit<GetProps<typeof TamaguiInput>, 'variant'> {
  variant?: UInputVariant;
  error?: string;
  /** Shown above the field and read by screen readers. Only the glass variant renders it. */
  label?: string;
  textAlignVertical?: 'top' | 'center' | 'bottom';
}

interface StylesType extends Omit<GetProps<typeof TamaguiInput>, 'ref'> {
  pressBackgroundColor?: GetThemeValueForKey<'backgroundColor'>;
  hoverBackgroundColor?: GetThemeValueForKey<'backgroundColor'>;
}

const getErrorColor = (variant: UInputVariant = 'primary') => {
  switch (variant) {
    case 'primary':
      return '$white';
    case 'tertiary':
      return '$orange8';
    default:
      return '$white';
  }
};

const getVariantStyle = (variant: UInputVariant = 'primary'): StylesType => {
  const baseStyles: StylesType = {
    backgroundColor: '$primary',
    hoverBackgroundColor: '$primaryAlpha2',
    pressBackgroundColor: '$primaryAlpha3',
    placeholderTextColor: '$neutral5',
    borderColor: '$secondary',
    borderWidth: 2,
    minHeight: 40,
    py: 12,
    px: 16,
    color: '$white',
    fontFamily:'$cormorantgaramond',
    fontSize:16,
    letterSpacing:0,
    borderRadius: 10,
    boxSizing: 'border-box',
    marginBottom: 0
  };

  switch (variant) {
    case 'primary':
      return {
        ...baseStyles,
      };
    case 'tertiary':
      return {
        ...baseStyles,
        backgroundColor: '$transparent',
        hoverBackgroundColor: '$primaryAlpha1',
        pressBackgroundColor: '$primaryAlpha2',
      };
    case 'dark':
      return {
        ...baseStyles,
        backgroundColor: '$transparent',
        hoverBackgroundColor: '$transparent',
        pressBackgroundColor: '$transparent',
        borderColor: '$transparent',
        borderWidth: 0,
        borderRadius: 0,
        color: '$white',
        placeholderTextColor: '$placeholderGray',
        py: 0,
        px: 0,
        minHeight: 30,
        width: '100%',
      };
    default:
      return baseStyles;
  }
};

/** Inline error under a field. Announced by screen readers without moving focus. */
export const FieldError = ({ message }: { message: string }) => (
  <XStack gap={6} ai="center" accessibilityLiveRegion="polite">
    <Ionicons name="alert-circle-outline" size={14} color={getTokenValue('$errorText', 'color')} />
    <UText variant="body-s" color="$errorText">
      {message}
    </UText>
  </XStack>
);

const GlassInput = forwardRef<any, UInputProps>(
  ({ label, error, secureTextEntry, onFocus, onBlur, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const [hidden, setHidden] = useState(true);

    // Error wins over focus, so the problem stays visible while the user fixes it.
    const state = error ? 'error' : focused ? 'focused' : 'default';

    return (
      <YStack gap={6}>
        {label && (
          <UText variant="meta" color={focused ? '$accentCyan' : '$textSecondary'}>
            {label}
          </UText>
        )}
        <XStack
          h={50}
          br={14}
          pl={14}
          pr={secureTextEntry ? 4 : 14}
          ai="center"
          borderWidth={1}
          bg={state === 'error' ? '$inputErrorBg' : state === 'focused' ? '$glassCyan' : '$glass'}
          borderColor={
            state === 'error' ? '$inputErrorBorder' : state === 'focused' ? '$accentCyan' : '$inputBorder'
          }
          boxShadow={
            state === 'focused'
              ? '0 0 0 3px rgba(0,240,255,0.18), 0 0 18px rgba(0,240,255,0.25)'
              : undefined
          }
        >
          <TamaguiInput
            ref={ref}
            unstyled
            flex={1}
            h="100%"
            fontFamily="$inter"
            fontSize={15}
            color="$textPrimary"
            placeholderTextColor="$textMuted"
            accessibilityLabel={label}
            secureTextEntry={secureTextEntry && hidden}
            onFocus={(e) => {
              setFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              onBlur?.(e);
            }}
            {...props}
          />
          {secureTextEntry && (
            <YStack
              w={44}
              h={44}
              ai="center"
              jc="center"
              onPress={() => setHidden((h) => !h)}
              accessible
              accessibilityRole="button"
              accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
            >
              <Ionicons
                name={hidden ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color={getTokenValue('$textMuted', 'color')}
              />
            </YStack>
          )}
        </XStack>
        {error && <FieldError message={error} />}
      </YStack>
    );
  }
);

const UInput = forwardRef<any, UInputProps>(
  ({ variant = 'tertiary', disabled, borderColor, error, ...props }, ref) => {
    const {
      pressBackgroundColor,
      hoverBackgroundColor,
      borderColor: variantBorderColor,
      ...variantStyle
    } = useMemo(() => getVariantStyle(variant), [variant]);

     const errorColor = getErrorColor(variant);

    // After the hooks above, so the hook order never changes between renders.
    if (variant === 'glass') {
      return <GlassInput ref={ref} error={error} disabled={disabled} {...props} />;
    }
    return (
      <>
        <YStack gap={2} marginBottom={0}>
          <TamaguiInput
            ref={ref}
            unstyled
            textAlignVertical={props.textAlignVertical} 
            pressStyle={{
              backgroundColor: pressBackgroundColor,
              borderColor: borderColor || variantBorderColor,
            }}
            hoverStyle={{
              backgroundColor: hoverBackgroundColor,
              borderColor: borderColor || variantBorderColor,
            }}
            borderColor={borderColor || variantBorderColor}
            {...variantStyle}
            {...props}
            disabled={disabled}
            opacity={disabled ? 0.5 : 1}
          />

          {error ? (
            <UText variant="text-xs" color={errorColor} ml={6} mt={5}>
              {error}
            </UText>
          ) : null}

        </YStack>
      </>
    );
  }
);

export default memo(UInput);
