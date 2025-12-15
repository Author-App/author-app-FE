import { forwardRef, memo, useMemo } from 'react';
import { GetProps, GetThemeValueForKey, Input as TamaguiInput, Text, YStack } from 'tamagui';

import { UInputVariant } from '@/src/components/core/types/input/inputVariants';
import UText from '../text/uText';

interface UInputProps extends Omit<GetProps<typeof TamaguiInput>, 'variant'> {
  variant?: UInputVariant;
  error?: string;
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
    case 'secondary':
      return '$negative5'; 
    case 'tertiary':
      return '$orange8';
    case 'quaternary':
      return '$red9';
    default:
      return '$white';
  }
};

const getVariantStyle = (variant: UInputVariant = 'primary'): StylesType => {
  const baseStyles: StylesType = {
    backgroundColor: '$primary',
    hoverBackgroundColor: '$primaryAlpha2',
    pressBackgroundColor: '$primaryAlpha3',
    placeholderTextColor: '$white',
    borderColor: '$secondary',
    borderWidth: 2,
    minHeight: 40,
    // flex: 1,
    py: 12,
    px: 16,
    fontFamily: '$cormorantgaramond',
    fontSize: 16,
    letterSpacing: 0,
    color: '$white',
    // borderRadius: 999,
    borderRadius: 10,
    boxSizing: 'border-box',
    marginBottom: 0
  };

  switch (variant) {
    case 'primary':
      return {
        ...baseStyles,
      };
    case 'secondary':
      return {
        ...baseStyles,
        backgroundColor: '$transparent',
        borderColor: '$primary7',
        borderWidth: 1,
        hoverBackgroundColor: '$primaryAlpha1',
        pressBackgroundColor: '$primaryAlpha2',
        placeholderTextColor: '#676767ff',
        color: '$black'
      };
    case 'tertiary':
      return {
        ...baseStyles,
        backgroundColor: '$transparent',
        hoverBackgroundColor: '$primaryAlpha1',
        pressBackgroundColor: '$primaryAlpha2',
      };
    case 'quaternary':
      return {
        ...baseStyles,
        backgroundColor: '$transparent',
        hoverBackgroundColor: '$primaryAlpha1',
        pressBackgroundColor: '$primaryAlpha2',
        borderColor: '$transparent',
        color: '$black',
        placeholderTextColor: '$black'
      };
    default:
      return baseStyles;
  }
};

const UInput = forwardRef<any, UInputProps>(
  ({ variant = 'tertiary', disabled, borderColor, error, ...props }, ref) => {
    const {
      pressBackgroundColor,
      hoverBackgroundColor,
      borderColor: variantBorderColor,
      ...variantStyle
    } = useMemo(() => getVariantStyle(variant), [variant]);

     const errorColor = getErrorColor(variant);
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
