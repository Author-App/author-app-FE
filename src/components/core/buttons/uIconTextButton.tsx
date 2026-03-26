import { forwardRef, useMemo } from 'react';
import { Button as TamaguiButton, TextProps, Token } from 'tamagui';

import { IconProps } from '@/assets/icons/types/iconProps';
import UIcon from '@/src/components/core/icons/uIcon';
import UText from '@/src/components/core/text/uText';
import { BaseButtonType } from '@/src/components/core/types/button/baseButtonType';
import ButtonVariantStylesType from '@/src/components/core/types/button/buttonStylesType';
import { ButtonVariant } from '@/src/components/core/types/button/buttonVariant';
import { TextVariant } from '@/src/components/core/types/text/textVariant';

interface UIconTextButtonProps extends Omit<BaseButtonType, 'icon'> {
  textColor?: TextProps['color'];
  emoji?: string;
  icon?: React.ComponentType<IconProps>;
  iconPosition?: 'left' | 'right';
}

interface StylesType extends ButtonVariantStylesType {
  textVariant: TextVariant;
  iconSize: number;
}

const getVariantStyle = (variant: ButtonVariant = 'primary-md'): StylesType => {
  const baseStyles: StylesType = {
    backgroundColor: '$primary7',
    hoverBackgroundColor: '$primary8',
    pressBackgroundColor: '$primary9',
    px: 16,
    py: 8,
    height: 'auto',
    borderRadius: 999,
    color: '$neutral1',
    textVariant: 'text-sm',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    iconSize: 18,
  };

  switch (variant) {
    case 'primary-xs':
      return {
        ...baseStyles,
        py: 4,
        px: 8,
        textVariant: 'text-2xs',
        iconSize: 12,
      };
    case 'primary-sm':
      return {
        ...baseStyles,
        py: 4,
        px: 12,
        textVariant: 'text-xs',
        iconSize: 16,
      };
    case 'primary-md':
      return {
        ...baseStyles,
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
        iconSize: 12,
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
        iconSize: 16,
      };
    case 'secondary-md':
      return {
        ...baseStyles,
        backgroundColor: '$secondary5',
        hoverBackgroundColor: '$secondary6',
        pressBackgroundColor: '$secondary7',
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
        iconSize: 12,
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
        iconSize: 16,
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
        iconSize: 12,
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
        iconSize: 16,
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

const UIconTextButton = forwardRef<any, UIconTextButtonProps>((props, ref) => {
  const {
    variant = 'primary-md',
    disabled,
    emoji,
    icon,
    iconPosition = 'left',
    textColor,
    children,
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
    iconSize,
    ...restVariantStyles
  } = variantStyle;

  const renderIcon = () => {
    if (!icon) return null;
    return <UIcon icon={icon} color={color as Token} dimen={iconSize} />;
  };

  const renderEmoji = () => {
    if (!emoji) return null;
    return <UText variant={textVariant}>{emoji}</UText>;
  };

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
      {iconPosition === 'left' && (
        <>
          {renderEmoji()}
          {renderIcon()}
        </>
      )}
      <UText
        variant={textVariant}
        color={textColor || color}
        textTransform="capitalize"
      >
        {children}
      </UText>
      {iconPosition === 'right' && (
        <>
          {renderEmoji()}
          {renderIcon()}
        </>
      )}
    </TamaguiButton>
  );
});

export default UIconTextButton;
