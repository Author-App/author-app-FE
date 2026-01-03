import { forwardRef, memo, useMemo } from 'react';
import { Button as TamaguiButton, TextProps } from 'tamagui';

import UText from '@/src/components/core/text/uText';
import { BaseButtonType } from '@/src/components/core/types/button/baseButtonType';
import ButtonVariantStylesType from '@/src/components/core/types/button/buttonStylesType';
import { ButtonVariant } from '@/src/components/core/types/button/buttonVariant';
import { TextVariant } from '@/src/components/core/types/text/textVariant';
import { ActivityIndicator } from 'react-native';

interface UTextButtonProps extends BaseButtonType {
  textColor?: TextProps['color'];
  textDecorationLine?: TextProps['textDecorationLine'];
  loading?: boolean;
  indicatorColor?: string;
}
interface StylesType extends ButtonVariantStylesType {
  textVariant: TextVariant;
}

const getVariantStyle = (variant: ButtonVariant = 'primary-md'): StylesType => {
  const baseStyles: StylesType = {
    backgroundColor: '#385d83ff',
    hoverBackgroundColor: '$primary8',
    pressBackgroundColor: '$primary9',
    px: 16,
    height:40,
    borderRadius: 5,
    color: '$neutral1',
    textVariant: 'text-sm',
    alignItems: 'center',
    justifyContent: 'center',
  };

  switch (variant) {
    case 'primary-xs':
      return {
        ...baseStyles,
        py: 4,
        px: 8,
        textVariant: 'text-2xs',
      };
    case 'primary-sm':
      return {
        ...baseStyles,
        py: 4,
        px: 12,
        textVariant: 'text-xs',
      };
    case 'primary-md':
      return {
        ...baseStyles,
        py: 4,
        px: 12,
        textVariant: 'text-sm',

      };
    case 'secondary-xs':
      return {
        ...baseStyles,
        backgroundColor: '$secondary5',
        hoverBackgroundColor: '$secondary6',
        pressBackgroundColor: '$secondary7',
        py: 4,
        px: 8,
        textVariant: 'text-2xs',
      };
    case 'secondary-sm':
      return {
        ...baseStyles,
        backgroundColor: '$secondary5',
        hoverBackgroundColor: '$secondary6',
        pressBackgroundColor: '$secondary7',
        py: 4,
        px: 12,
        textVariant: 'text-xs',
      };
    case 'secondary-md':
      return {
        ...baseStyles,
        backgroundColor: '$secondary',
        borderColor: '$secondary',
        borderWidth: 2,
        hoverBackgroundColor: '$secondaryHover',
        pressBackgroundColor: '$secondaryHover',
        py: 4,
        px: 12,
        textVariant: 'text-sm',
      };
   
    case 'tertiary-xs':
      return {
        ...baseStyles,
        backgroundColor: '$neutral0',
        hoverBackgroundColor: '$neutral1',
        pressBackgroundColor: '$neutral2',
        borderColor: '$primary7',
        pressBorderColor: '$primary7',
        hoverBorderColor: '$primary7',
        borderWidth: 1,
        py: 4,
        px: 8,
        textVariant: 'text-2xs',
        color: '$primary7',
      };
    case 'tertiary-sm':
      return {
        ...baseStyles,
        backgroundColor: '$neutral0',
        hoverBackgroundColor: '$neutral1',
        pressBackgroundColor: '$neutral2',
        borderColor: '$primary7',
        pressBorderColor: '$primary7',
        hoverBorderColor: '$primary7',
        borderWidth: 1,
        py: 4,
        px: 12,
        textVariant: 'text-xs',
        color: '$primary7',
      };
    case 'tertiary-md':
      return {
        ...baseStyles,
        backgroundColor: '$neutral0',
        hoverBackgroundColor: '$neutral1',
        pressBackgroundColor: '$neutral2',
        borderColor: '$primary7',
        pressBorderColor: '$primary7',
        hoverBorderColor: '$primary7',
        borderWidth: 1,
        color: '$primary7',
      };
    case 'quaternary-xs':
      return {
        ...baseStyles,
        backgroundColor: '$transparent',
        hoverBackgroundColor: '$primaryAlpha1',
        pressBackgroundColor: '$primaryAlpha2',
        py: 4,
        px: 8,
        textVariant: 'text-2xs',
        color: '$primary7',
      };
    case 'quaternary-sm':
      return {
        ...baseStyles,
        backgroundColor: '$transparent',
        hoverBackgroundColor: '$primaryAlpha1',
        pressBackgroundColor: '$primaryAlpha2',
        textVariant: 'text-xs',
        color: '$primary7',
        py: 4,
        px: 12,
      };
    case 'quaternary-md':
      return {
        ...baseStyles,
        backgroundColor: '$transparent',
        hoverBackgroundColor: '$primaryAlpha1',
        pressBackgroundColor: '$primaryAlpha2',
        color: '$primary7',
      };
    default:
      return baseStyles;
  }
};

const UTextButton = forwardRef<any, UTextButtonProps>((props, ref) => {
  const {
    variant = 'primary-md',
    disabled,
    children,
    textColor,
    textDecorationLine,
    indicatorColor,
    loading,
    ...restProps
  } = props;
  const variantStyle = useMemo(() => getVariantStyle(variant), [variant]);
  const {
    pressBackgroundColor,
    pressBorderColor,
    hoverBackgroundColor,
    hoverBorderColor,
    textVariant,
    color,
    ...restVariantStyles
  } = variantStyle;

  return (
    <TamaguiButton
      ref={ref}
      unstyled
      {...restVariantStyles}
      pressStyle={{
        backgroundColor: pressBackgroundColor,
        borderColor: pressBorderColor,
      }}
      hoverStyle={{
        backgroundColor: hoverBackgroundColor,
        borderColor: hoverBorderColor,
      }}
      disabled={disabled}
      opacity={disabled ? 0.4 : 1}
      {...restProps}
    >
      {loading ?
        <ActivityIndicator size="small" color={indicatorColor || '$neutral0'} /> :
        <UText
          variant={textVariant}
          color={textColor || color}
          textDecorationLine={textDecorationLine}
        >
          {children}
        </UText>

      }
    </TamaguiButton>
  );
});
export default memo(UTextButton);
