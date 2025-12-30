import { memo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ColorTokens, XStack, YStack, YStackProps } from 'tamagui';

import USpacer from '@/src/components/core/layout/uSpacer';
import UText, { UTextProps } from '@/src/components/core/text/uText';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';

interface UHeaderProps extends YStackProps {
  title?: string;
  subtitle?: string;
  titleElement?: React.ReactElement;
  leftControl?: React.ReactElement;
  rightControl?: React.ReactElement;
  safeAreaDisabled?: boolean;
  textProps?: Partial<UTextProps>;
  headerColor?: ColorTokens | 'transparent';
  /** Use new premium design with accent bar */
  variant?: 'default' | 'premium';
  /** Animation delay in ms */
  animationDelay?: number;
}

const UHeader = ({
  title,
  subtitle,
  titleElement,
  leftControl,
  rightControl,
  safeAreaDisabled,
  textProps,
  headerColor = 'transparent',
  variant = 'default',
  animationDelay = 0,
  ...props
}: UHeaderProps) => {
  const { top } = useSafeAreaInsets();

  // Premium variant - new design with accent bar
  if (variant === 'premium') {
    return (
      <YStack
        pt={safeAreaDisabled ? 16 : top + 16}
        pb={20}
        px={20}
        bg={headerColor}
        {...props}
      >
        <UAnimatedView animation="fadeInUp" duration={400} delay={animationDelay}>
          <YStack gap={4}>
            <XStack ai="center" jc="space-between">
              <XStack ai="center" gap={8} flex={1}>
                <YStack w={4} h={28} bg="$brandCrimson" br={2} />
                <UText variant="playfair-xl" color="$white" {...textProps}>
                  {title}
                </UText>
              </XStack>
              {rightControl && (
                <XStack>{rightControl}</XStack>
              )}
            </XStack>
            {subtitle && (
              <XStack pl={12}>
                <UText variant="text-sm" color="$neutral1" opacity={0.8}>
                  {subtitle}
                </UText>
              </XStack>
            )}
          </YStack>
        </UAnimatedView>
      </YStack>
    );
  }

  // Default variant - centered design with light colors
  if (title) {
    if (titleElement) {
      throw new Error('title and titleElement cannot be used together');
    }

    titleElement = (
      <UText variant="heading-h2" color="$white" {...textProps} numberOfLines={1}>
        {title}
      </UText>
    );
  }

  return (
    <YStack w="100%" {...props} backgroundColor={headerColor}>
      {!safeAreaDisabled && <USpacer height={top} />}
      <UAnimatedView animation="fadeIn" duration={300} delay={animationDelay}>
        <XStack py={12} px={4} gap={8} jc="space-between" ai="center">
          {/* Left Section */}
          <XStack flex={0.15} jc="flex-start" ai="center">
            {leftControl}
          </XStack>

          {/* Center Title */}
          <XStack flex={0.7} jc="center" ai="center">
            {titleElement}
          </XStack>

          {/* Right Section */}
          <XStack flex={0.15} jc="flex-end" ai="center">
            {rightControl}
          </XStack>
        </XStack>
      </UAnimatedView>
    </YStack>
  );
};

export default memo(UHeader);
