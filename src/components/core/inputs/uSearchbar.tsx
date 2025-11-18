import { useEffect, useMemo, useRef } from 'react';
import { TextInput } from 'react-native';
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { GetProps, GetThemeValueForKey, isWeb, XStack, YStack } from 'tamagui';

import IconMagnifyingGlass from '@/assets/icons/iconMagnifyingGlass';
import IconX from '@/assets/icons/iconX';
import UAnimatedYStack from '@/src/components/core/animated/uAnimatedYStack';
import UIconButton from '@/src/components/core/buttons/uIconButtonVariants';
import UInput from '@/src/components/core/inputs/uInput';
import { UInputVariant } from '@/src/components/core/types/input/inputVariants';

interface USearchbarProps
  extends Omit<GetProps<typeof UInput>, 'onChangeText' | 'value' | 'onPress'> {
  search: string;
  onSearchChange: (search: string) => void;
  onClear?: () => void;
}

interface StylesType extends GetProps<typeof XStack> {
  hoverBackgroundColor?: GetThemeValueForKey<'backgroundColor'>;
  pressBackgroundColor?: GetThemeValueForKey<'backgroundColor'>;
}

const getVariantStyle = (variant: UInputVariant = 'primary'): StylesType => {
  const baseStyles: StylesType = {
    backgroundColor: '#FFFFFF', // clean white
    hoverBackgroundColor: '#F9F5ED', // soft warm hover tone
    pressBackgroundColor: '#EFE3CA', // slightly deeper on press
    borderColor: '#E5D7C1', // subtle beige border
    borderWidth: 1,
    py: 10,
    px: 10,
    ...(isWeb && { height: 'auto', flex: 1 }),
    borderRadius: 20, // softer edges
    boxSizing: 'border-box',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,


    // backgroundColor: '$primaryAlpha1',
    // hoverBackgroundColor: '$primaryAlpha2',
    // pressBackgroundColor: '$primaryAlpha3',
    // borderColor: '$transparent',
    // borderWidth: 0,
    // py: 10,
    // px: 8,
    // ...(isWeb && { height: 'auto', flex: 1 }),
    // borderRadius: 999,
    // boxSizing: 'border-box',
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
    case 'quaternary':
      return {

        ...baseStyles,
        backgroundColor: '#E0D3BE', // slightly darker beige than screen bg (#F3E9D6)
        borderColor: '#CBB89A',
        borderWidth: 1,
        borderRadius: 20,
        shadowColor: '#BFAE8F',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
        py: 10,
        px: 12,

        // ...baseStyles,
        // backgroundColor: '#D9C3A3', // soft caramel brown
        // borderColor: '#C8AC87',
        // borderWidth: 1,
        // borderRadius: 22,
        // shadowColor: '#B59B75',
        // shadowOffset: { width: 0, height: 4 },
        // shadowOpacity: 0.25,
        // shadowRadius: 8,
        // elevation: 4,
        // py: 10,
        // px: 12,

        // ...baseStyles,
        // backgroundColor: 'rgba(255, 255, 255, 0.85)', // translucent glass feel
        // hoverBackgroundColor: 'rgba(255, 255, 255, 0.95)',
        // pressBackgroundColor: 'rgba(250, 250, 250, 0.9)',
        // borderColor: 'rgba(255, 255, 255, 0.6)',
        // borderWidth: 1,
        // borderRadius: 22,
        // shadowColor: '#D1C3A7',
        // shadowOffset: { width: 0, height: 4 },
        // shadowOpacity: 0.25,
        // shadowRadius: 8,
        // elevation: 5,
        // py: 10,
        // px: 12,


        // ...baseStyles,
        // backgroundColor: '#FFFFFF',
        // hoverBackgroundColor: '#F8F4EB',
        // pressBackgroundColor: '#EFE3CA',
        // borderColor: '#E5D7C1',


        // ...baseStyles,
        // backgroundColor: '$white',
        // hoverBackgroundColor: '$primaryAlpha1',
        // pressBackgroundColor: '$primaryAlpha2',
        // borderColor: '$white',
      };
    default:
      return baseStyles;
  }
};

const USearchbar = ({
  search,
  onSearchChange,
  onClear = () => { },
  variant = 'primary',
  backgroundColor,
  bg,
  borderColor,
  disabled,
  flex = 1,
  ...props
}: USearchbarProps) => {
  const inputRef = useRef<TextInput>(null);
  const hasText = useMemo(() => search.length > 0, [search]);

  const xIconOpacity = useSharedValue(0);
  const xIconTranslateY = useSharedValue(10);

  const xIconAnimatedStyle = useAnimatedStyle(() => ({
    opacity: xIconOpacity.value,
    transform: [{ translateY: xIconTranslateY.value }],
  }));

  const handleClear = () => {
    onSearchChange('');
    onClear();
    inputRef.current?.focus();
  };

  const handlePress = () => {
    inputRef.current?.focus();
  };

  const {
    hoverBackgroundColor,
    pressBackgroundColor,
    borderColor: variantBorderColor,
    backgroundColor: variantBackgroundColor,
    ...restVariantStyle
  } = useMemo(() => getVariantStyle(variant), [variant]);

  useEffect(() => {
    if (hasText) {
      xIconOpacity.value = withTiming(1, { duration: 200 });
      xIconTranslateY.value = withTiming(0, { duration: 200 });
    } else {
      xIconOpacity.value = withTiming(0, { duration: 200 });
      xIconTranslateY.value = withTiming(10, { duration: 200 });
    }
  }, [hasText, xIconOpacity, xIconTranslateY]);

  return (
    <XStack
      ai="center"
      position="relative"
      flex={flex}
      pressStyle={{
        backgroundColor: pressBackgroundColor,
        borderColor: borderColor || variantBorderColor,
      }}
      hoverStyle={{
        backgroundColor: hoverBackgroundColor,
        borderColor: borderColor || variantBorderColor,
      }}
      borderColor={borderColor || variantBorderColor}
      onPress={handlePress}
      disabled={disabled}
      opacity={disabled ? 0.5 : 1}
      {...restVariantStyle}
      backgroundColor={backgroundColor || bg || variantBackgroundColor}
    >
      <UIconButton
        icon={IconMagnifyingGlass}
        variant="quaternary-sm"
        iconProps={{ dimen: 20, color: '$primaryAlpha7' }}
      />
      <UInput
        ref={inputRef}
        value={search}
        autoCapitalize="none"
        onChangeText={onSearchChange}
        py={0}
        pressStyle={{ backgroundColor: '$transparent' }}
        hoverStyle={{ backgroundColor: '$transparent' }}
        focusStyle={{ backgroundColor: '$transparent' }}
        disabled={disabled}
        variant='quaternary'
        {...props}
      />

      <YStack w={16} h={16} ai="center" jc="center" position="relative">
        <UAnimatedYStack
          position="absolute"
          style={xIconAnimatedStyle}
          pointerEvents={hasText ? 'auto' : 'none'}
        >
          <UIconButton
            icon={IconX}
            variant="quaternary-sm"
            onPress={handleClear}
            disabled={disabled}
            dimen={16}
          />
        </UAnimatedYStack>
      </YStack>
    </XStack>
  );
};

export default USearchbar;
