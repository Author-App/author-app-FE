import { forwardRef, useMemo } from 'react';
import { TamaguiTextElement, Text, TextProps } from 'tamagui';

import { TextVariant } from '@/src/components/core/types/text/textVariant';

export type FontFamily = {
  fontFamily?: '$cormorantgaramond' | '$adamina' | '$sfpro' | '$dmsans' | '$dmmono' | '$cinzel';
};
export interface UTextProps
  extends Omit<
    TextProps,
    'fontFamily' | 'fontSize' | 'letterSpacing'
  >,
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
    default:
      return baseStyles;
  }
};

// const getVariantStyle = (variant: TextVariant): StylesType => {
//   const baseStyles: StylesType = {
//     fontFamily: '$cormorantgaramond',
//     // fontSize: 16,
//     fontSize: 20,
//     // lineHeight: 24,
//     lineHeight: 28,
//     letterSpacing: 0,
//   };

//   switch (variant) {
//     case 'label-2xs':
//       return {
//         ...baseStyles,
//         fontFamily: '$cormorantgaramond',
//         // fontSize: 10,
//         fontSize: 14,
//         // lineHeight: 12,
//         lineHeight: 18,
//       };
//     case 'label-xs':
//       return {
//         ...baseStyles,
//         fontFamily: '$cormorantgaramond',
//         // fontSize: 12,
//         fontSize: 16,
//         // lineHeight: 16,
//         lineHeight: 21,
//       };
//     case 'label-sm':
//       return {
//         ...baseStyles,
//         fontFamily: '$cormorantgaramond',
//         // fontSize: 14,
//         fontSize: 18,
//         // lineHeight: 20,
//         lineHeight: 24,
//       };
//     case 'label-md':
//       return {
//         ...baseStyles,
//         fontFamily: '$cormorantgaramond',
//         // fontSize: 16,
//         fontSize: 20,
//         lineHeight: 26,

//       };
//     case 'text-2xs':
//       return {
//         ...baseStyles,
//         // fontSize: 10,
//         fontSize: 14,
//         // lineHeight: 12,
//         lineHeight: 19,
//       };
//     case 'text-xs':
//       return {
//         ...baseStyles,
//         // fontSize: 12,
//         fontSize: 16,
//         // lineHeight: 16,
//         lineHeight: 22,
//       };
//     case 'text-sm':
//       return {
//         ...baseStyles,
//         // fontSize: 14,
//         fontSize: 18,
//         // lineHeight: 20,
//         lineHeight: 25,
//       };
//     case 'text-md':
//       return {
//         ...baseStyles,
//         fontSize: 20,
//         lineHeight: 28,
//       };
//     case 'heading-h2':
//       return {
//         ...baseStyles,
//         // fontSize: 18,
//         fontSize: 24,
//         letterSpacing: -0.18,
//         lineHeight: 32,
//       };
//     case 'heading-h1':
//       return {
//         ...baseStyles,
//         // fontSize: 24,
//         fontSize: 30,
//         // lineHeight: 32,
//         letterSpacing: -0.24,
//         lineHeight: 40,
//       };

//     case 'heading-h2-bold':
//       return {
//         ...baseStyles,
//         fontSize: 17,
//         fontWeight: '700',
//         letterSpacing: -0.18,
//       };
//     case 'heading-h1-bold':
//       return {
//         ...baseStyles,
//         fontSize: 30,
//         fontWeight: '700',
//         lineHeight: 45,
//         letterSpacing: -0.24,
//       };
//     default:
//       return baseStyles;
//   }
// };

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

export default UText;
