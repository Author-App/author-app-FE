import { forwardRef, useMemo } from 'react';
import {
  GetProps,
  GetThemeValueForKey,
  Button as TamaguiButton,
} from 'tamagui';

import UTextButton from '@/src/components/core/buttons/uTextButton';
import UText from '@/src/components/core/text/uText';
import ButtonVariantStylesType from '@/src/components/core/types/button/buttonStylesType';
import { TextVariant } from '@/src/components/core/types/text/textVariant';

export type ButtonTabItemVariant = 'style-1' | 'style-2';

interface UButtonTabItemProps
  extends Omit<GetProps<typeof UTextButton>, 'variant' | 'children'> {
  item: string;
  isSelected: boolean;
  variant?: ButtonTabItemVariant;
  useInternalBorder?: boolean;
}
interface StylesType extends ButtonVariantStylesType {
  activeBackgroundColor: GetThemeValueForKey<'backgroundColor'>;
  textVariant?: TextVariant;
  lineHeight?: number;
  textActiveColor?: GetThemeValueForKey<'color'>;
}

const getVariantStyle = (
  variant: ButtonTabItemVariant = 'style-1',
  useInternalBorder: boolean = true,
  isSelected: boolean = false
): StylesType => {
  const baseStyles: StylesType = {
    backgroundColor: '$transparent',
    activeBackgroundColor: '$transparent',
    borderColor: '$transparent',
    hoverBackgroundColor: '$primaryAlpha2',
    hoverBorderColor: '$transparent',
    pressBackgroundColor: '$primaryAlpha3',
    pressBorderColor: '$transparent',
    px: 16,
    py: 4,
    color: '$primary7',
    height: 'auto',
  };

  switch (variant) {
    case 'style-1':
      return {
        ...baseStyles,
        activeBackgroundColor: '$primary7',
        backgroundColor: '$primaryAlpha1',
        borderColor: '$primaryAlpha0',
        minHeight: 28,
        textVariant: 'text-sm',
        lineHeight: 19,
        textActiveColor: '$neutral1',
        borderRadius: 999,
      };
    case 'style-2':
      return {
        ...baseStyles,
        hoverBackgroundColor: '$primaryAlpha1',
        pressBackgroundColor: '$primaryAlpha2',
        textActiveColor: '$primary7',
        borderRadius: 0,
        textVariant: 'text-md',
        py: 8,
        color: '$primaryAlpha7',
        px: 0,
        borderBottomColor: useInternalBorder
          ? isSelected
            ? '$primary7'
            : '$transparent'
          : '$transparent',
        borderBottomWidth: useInternalBorder ? (isSelected ? 1.5 : 0) : 0,
      };
    default:
      return baseStyles;
  }
};

const UButtonTabItem = forwardRef<
  React.ElementRef<typeof TamaguiButton>,
  UButtonTabItemProps
>((props, ref) => {
  const {
    item,
    isSelected,
    variant,
    disabled,
    useInternalBorder,
    ...restProps
  } = props;
  const {
    backgroundColor,
    activeBackgroundColor,
    pressBackgroundColor,
    pressBorderColor,
    hoverBackgroundColor,
    hoverBorderColor,
    textVariant,
    lineHeight,
    textActiveColor,
    color: textColor,
    ...restVariantStyles
  } = useMemo(
    () => getVariantStyle(variant, useInternalBorder, isSelected),
    [variant, useInternalBorder, isSelected]
  );

  return (
    <TamaguiButton
      ref={ref}
      backgroundColor={isSelected ? activeBackgroundColor : backgroundColor}
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
      {...restProps}
    >
      <UText
        opacity={disabled ? 0.4 : 1}
        color={isSelected ? textActiveColor : textColor}
        variant={textVariant}
        lineHeight={lineHeight}
      >
        {item}
      </UText>
    </TamaguiButton>
  );
});

export default UButtonTabItem;
