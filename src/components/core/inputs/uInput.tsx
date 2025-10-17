import { forwardRef, useMemo } from 'react';
import { GetProps, GetThemeValueForKey, Input as TamaguiInput, Text, YStack } from 'tamagui';

import { UInputVariant } from '@/src/components/core/types/input/inputVariants';
import UText from '../text/uText';

interface UInputProps extends Omit<GetProps<typeof TamaguiInput>, 'variant'> {
  variant?: UInputVariant;
  error?: string;
}

interface StylesType extends Omit<GetProps<typeof TamaguiInput>, 'ref'> {
  pressBackgroundColor?: GetThemeValueForKey<'backgroundColor'>;
  hoverBackgroundColor?: GetThemeValueForKey<'backgroundColor'>;
}

const getVariantStyle = (variant: UInputVariant = 'primary'): StylesType => {
  const baseStyles: StylesType = {
    backgroundColor: '$primaryAlpha1',
    hoverBackgroundColor: '$primaryAlpha2',
    pressBackgroundColor: '$primaryAlpha3',
    placeholderTextColor: '$primaryAlpha7',
    borderColor: '$transparent',
    borderWidth: 0,
    minHeight: 40,
    // flex: 1,
    // py: 10,
    py: 14,
    px: 16,
    // fontFamily: '$dmsans',
    fontFamily: '$adamina',
    // fontSize: 16,
    fontSize:14,
    letterSpacing: 0,
    color: '$primary7',
    borderRadius: 999,
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
      };
    case 'tertiary':
      return {
        ...baseStyles,
        backgroundColor: '$transparent',
        hoverBackgroundColor: '$primaryAlpha1',
        pressBackgroundColor: '$primaryAlpha2',
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
    return (
      <>
        <YStack gap={2} marginBottom={0}>
          <TamaguiInput
            ref={ref}
            unstyled
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
            <UText variant="text-xs" color="$red10" ml={16} mt={5}>
              {error}
            </UText>
          ) : null}

        </YStack>
      </>
    );
  }
);

export default UInput;
