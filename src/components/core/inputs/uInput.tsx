import { forwardRef, useMemo } from 'react';
import { GetProps, GetThemeValueForKey, Input as TamaguiInput } from 'tamagui';

import { UInputVariant } from '@/src/components/core/types/input/inputVariants';

interface UInputProps extends Omit<GetProps<typeof TamaguiInput>, 'variant'> {
  variant?: UInputVariant;
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
    minHeight: 20,
    flex: 1,
    py: 10,
    px: 8,
    fontFamily: '$dmsans',
    fontSize: 16,
    letterSpacing: 0,
    color: '$primary7',
    borderRadius: 999,
    boxSizing: 'border-box',
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
  ({ variant = 'tertiary', disabled, borderColor, ...props }, ref) => {
    const {
      pressBackgroundColor,
      hoverBackgroundColor,
      borderColor: variantBorderColor,
      ...variantStyle
    } = useMemo(() => getVariantStyle(variant), [variant]);
    return (
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
    );
  }
);

export default UInput;
