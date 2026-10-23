import { forwardRef, memo, useMemo } from 'react';
import { TamaguiTextElement, Text, TextProps } from 'tamagui';

import { TextVariant } from '@/src/components/core/types/text/textVariant';

export type FontFamily = {
  fontFamily?:
    | '$cormorantgaramond'
    | '$adamina'
    | '$dmsans'
    | '$dmmono'
    | '$playfair'
    | '$orbitron'
    | '$jura'
    | '$inter';
};
export interface UTextProps
  // fontSize and letterSpacing may override the variant for one-off artboard sizes
  extends Omit<TextProps, 'fontFamily'>,
  FontFamily {
  variant?: TextVariant;
}
interface StylesType
  extends Omit<TextProps, 'children' | 'variant' | 'ref' | 'fontFamily'>,
  FontFamily { }

const getVariantStyle = (variant: TextVariant): StylesType => {
  const baseStyles: StylesType = {
    fontFamily: '$adamina',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
    // fontWeight:'700'
  };

  switch (variant) {
    case 'label-2xs':
      return {
        ...baseStyles,
        fontFamily: '$dmsans',
        fontSize: 10,
        lineHeight: 12,
      };
    case 'label-xs':
      return {
        ...baseStyles,
        fontFamily: '$dmsans',
        fontSize: 12,
        lineHeight: 16,
      };
    case 'label-sm':
      return {
        ...baseStyles,
        fontFamily: '$dmsans',
        fontSize: 14,
        lineHeight: 20,
      };
    case 'label-md':
      return {
        ...baseStyles,
        fontFamily: '$dmsans',
        fontSize: 16,
      };
    case 'text-2xs':
      return {
        ...baseStyles,
        fontSize: 10,
        lineHeight: 12,
      };
    case 'text-xs':
      return {
        ...baseStyles,
        fontSize: 12,
        lineHeight: 16,
        letterSpacing: 0.4,
      };
    case 'text-sm':
      return {
        ...baseStyles,
        fontSize: 14,
        lineHeight: 20,
      };
    case 'text-md':
      return {
        ...baseStyles,
      };
    case 'heading-h2':
      return {
        ...baseStyles,
        fontSize: 18,
        letterSpacing: -0.18,
      };
    case 'heading-h1':
      return {
        ...baseStyles,
        fontSize: 24,
        lineHeight: 32,
        letterSpacing: -0.24,
      };

    case 'heading-h2-bold':
      return {
        ...baseStyles,
        fontSize: 19,
        fontWeight: '700',
        letterSpacing: -0.18,
      };
    case 'heading-h1-bold':
      return {
        ...baseStyles,
        fontSize:30 ,
        fontWeight: '700',
        lineHeight: 45,
        letterSpacing: -0.24,
      };
    case 'playfair-sm':
      return {
        ...baseStyles,
        fontFamily: '$playfair',
        fontSize: 16,
        lineHeight: 24,
      };
    case 'playfair-md':
      return {
        ...baseStyles,
        fontFamily: '$playfair',
        fontSize: 20,
        lineHeight: 28,
      };
    case 'playfair-lg':
      return {
        ...baseStyles,
        fontFamily: '$playfair',
        fontSize: 24,
        lineHeight: 32,
      };
    case 'playfair-xl':
      return {
        ...baseStyles,
        fontFamily: '$playfair',
        fontSize: 28,
        lineHeight: 36,
      };
    case 'playfair-2xl':
      return {
        ...baseStyles,
        fontFamily: '$playfair',
        fontSize: 32,
        lineHeight: 40,
      };

    // --- Redesign type scale. Design letter spacing is in em, converted here to px (size * em).
    case 'display-xl':
      return { fontFamily: '$orbitron', fontWeight: '900', fontSize: 26, lineHeight: 32, letterSpacing: 1.04, textTransform: 'uppercase' };
    // wordmark-lg is wordmark at 26/14 size, same 0.12em spacing, so scaling one lands exactly on the other
    case 'wordmark-lg':
      return { fontFamily: '$orbitron', fontWeight: '900', fontSize: 26, lineHeight: 32, letterSpacing: 3.12, textTransform: 'uppercase' };
    case 'wordmark':
      return { fontFamily: '$orbitron', fontWeight: '900', fontSize: 14, lineHeight: 18, letterSpacing: 1.68, textTransform: 'uppercase' };
    case 'display-l':
      return { fontFamily: '$orbitron', fontWeight: '900', fontSize: 22, lineHeight: 28, letterSpacing: 0.66, textTransform: 'uppercase' };
    case 'display-m':
      return { fontFamily: '$orbitron', fontWeight: '700', fontSize: 16, lineHeight: 22, letterSpacing: 0.64, textTransform: 'uppercase' };
    case 'display-s':
      return { fontFamily: '$orbitron', fontWeight: '700', fontSize: 13, lineHeight: 18, letterSpacing: 0.26, textTransform: 'uppercase' };
    case 'label-button':
      return { fontFamily: '$orbitron', fontWeight: '700', fontSize: 14, lineHeight: 18, letterSpacing: 1.12, textTransform: 'uppercase' };
    case 'meta':
      return { fontFamily: '$jura', fontWeight: '700', fontSize: 11, lineHeight: 14, letterSpacing: 1.54, textTransform: 'uppercase' };
    case 'meta-s':
      return { fontFamily: '$jura', fontWeight: '700', fontSize: 10, lineHeight: 12, letterSpacing: 1.4, textTransform: 'uppercase' };
    case 'meta-pill':
      return { fontFamily: '$jura', fontWeight: '700', fontSize: 12, lineHeight: 16, letterSpacing: 1.68, textTransform: 'uppercase' };
    case 'body':
      return { fontFamily: '$inter', fontWeight: '400', fontSize: 15, lineHeight: 24, letterSpacing: 0 };
    case 'link':
      return { fontFamily: '$inter', fontWeight: '600', fontSize: 14, lineHeight: 20, letterSpacing: 0 };
    case 'body-s':
      return { fontFamily: '$inter', fontWeight: '400', fontSize: 13, lineHeight: 18, letterSpacing: 0 };
    default:
      return baseStyles;
  }
};

const UText = forwardRef<TamaguiTextElement, UTextProps>((props, ref) => {
  const {
    children,
    variant = 'text-md',
    fontFamily: fontFamilyProp,
    ...restProps
  } = props;
  const variantStyle = useMemo(() => getVariantStyle(variant), [variant]);
  const { fontFamily, ...restVariantStyles } = variantStyle;

  return (
    <Text
      ref={ref}
      {...restVariantStyles}
      fontFamily={fontFamilyProp || (fontFamily as any)}
      {...restProps}
    >
      {children}
    </Text>
  );
});

export default memo(UText);
