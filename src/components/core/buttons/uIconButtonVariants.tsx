import { forwardRef, useMemo } from 'react';
import { Button as TamaguiButton, Token } from 'tamagui';

import IconPlus from '@/assets/icons/iconPlus';
import UIcon from '@/src/components/core/icons/uIcon';
import ButtonVariantStylesType from '@/src/components/core/types/button/buttonStylesType';
import { ButtonVariant } from '@/src/components/core/types/button/buttonVariant';
import { IconButtonType } from '@/src/components/core/types/button/iconButtonType';

interface UIconButtonProps extends IconButtonType {}

interface StylesType extends ButtonVariantStylesType {
  iconSize?: number;
  iconColor?: Token;
}

const getVariantStyle = (variant: ButtonVariant = 'primary-md'): StylesType => {
  const baseStyles: StylesType = {
    backgroundColor: '$primary7',
    width: 36,
    height: 36,
    borderRadius: 9999,
    justifyContent: 'center',
    alignItems: 'center',
    pressBackgroundColor: '$primary9',
    hoverBackgroundColor: '$primary8',
    iconSize: 24,
    padding: 6,
  };

  switch (variant) {
    case 'primary-sm':
      return {
        ...baseStyles,
        width: 28,
        height: 28,
        iconSize: 20,
        padding: 4,
      };
    case 'primary-md':
      return {
        ...baseStyles,
      };
    case 'secondary-xs':
      return {
        ...baseStyles,
        backgroundColor: '$secondary5',
        pressBackgroundColor: '$secondary7',
        hoverBackgroundColor: '$secondary6',
        width: 20,
        height: 20,
        iconSize: 14,
        padding: 2,
      };
    case 'secondary-sm':
      return {
        ...baseStyles,
        backgroundColor: '$secondary5',
        pressBackgroundColor: '$secondary7',
        hoverBackgroundColor: '$secondary6',
        width: 28,
        height: 28,
        padding: 4,
        iconSize: 20,
      };
    case 'secondary-md':
      return {
        ...baseStyles,
        backgroundColor: '$secondary5',
        pressBackgroundColor: '$secondary7',
        hoverBackgroundColor: '$secondary6',
      };
    case 'tertiary-sm':
      return {
        ...baseStyles,
        backgroundColor: '$neutral0',
        pressBackgroundColor: '$neutral2',
        hoverBackgroundColor: '$neutral1',
        borderColor: '$primary7',
        pressBorderColor: '$primary7',
        hoverBorderColor: '$primary7',
        iconColor: '$primary7',
        borderWidth: 1,
        width: 28,
        height: 28,
        padding: 4,
        iconSize: 20,
      };
    case 'tertiary-md':
      return {
        ...baseStyles,
        backgroundColor: '$neutral0',
        pressBackgroundColor: '$neutral2',
        hoverBackgroundColor: '$neutral1',
        borderColor: '$primary7',
        pressBorderColor: '$primary7',
        hoverBorderColor: '$primary7',
        iconColor: '$primary7',
        borderWidth: 1,
      };
    case 'quaternary-sm':
      return {
        ...baseStyles,
        backgroundColor: '$transparent',
        pressBackgroundColor: '$primaryAlpha2',
        hoverBackgroundColor: '$primaryAlpha1',
        iconColor: '$primary7',
        width: 28,
        height: 28,
        padding: 4,
        iconSize: 20,
      };
    case 'quaternary-md':
      return {
        ...baseStyles,
        backgroundColor: '$transparent',
        pressBackgroundColor: '$primaryAlpha2',
        hoverBackgroundColor: '$primaryAlpha1',
        iconColor: '$primary7',
      };
    default:
      return baseStyles;
  }
};

const UIconButton = forwardRef<any, UIconButtonProps>((props, ref) => {
  const {
    variant = 'primary-md',
    icon = IconPlus,
    dimen,
    color,
    disabled,
    iconProps = {},
    ...restProps
  } = props;

  const variantStyle = useMemo(() => getVariantStyle(variant), [variant]);
  const {
    pressBackgroundColor,
    pressBorderColor,
    hoverBackgroundColor,
    hoverBorderColor,
    iconSize,
    iconColor,
    ...restVariantStyles
  } = variantStyle;

  return (
    <TamaguiButton
      ref={ref}
      {...restVariantStyles}
      pressStyle={{
        backgroundColor: pressBackgroundColor,
        borderColor: pressBorderColor,
      }}
      hoverStyle={{
        backgroundColor: hoverBackgroundColor,
        borderColor: hoverBorderColor,
      }}
      unstyled
      disabled={disabled}
      opacity={disabled ? 0.5 : 1}
      {...restProps}
    >
      <UIcon
        icon={icon}
        color={iconProps.color || iconColor}
        dimen={iconProps.dimen || iconSize}
      />
    </TamaguiButton>
  );
});

export default UIconButton;
