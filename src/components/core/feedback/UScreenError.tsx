import React, { memo } from 'react';
import { YStack, YStackProps, getTokenValue } from 'tamagui';
import { Feather } from '@expo/vector-icons';

import UText from '@/src/components/core/text/uText';
import { UButton } from '@/src/components/core/buttons/uButton';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';

type FeatherIconName = keyof typeof Feather.glyphMap;

export interface UScreenErrorProps extends YStackProps {
  title?: string;
  message?: string | null;
  onRetry?: () => void;
  retryLabel?: string;
  icon?: FeatherIconName;
  showRetry?: boolean;
}

const UScreenError: React.FC<UScreenErrorProps> = ({
  title = 'Oops! Something went wrong',
  message = "We couldn't load your content. Please check your connection and try again.",
  onRetry,
  retryLabel = 'Try Again',
  icon = 'wifi-off',
  showRetry = true,
  ...props
}) => {
  const crimson = getTokenValue('$brandCrimson', 'color');

  return (
    <YStack flex={1} jc="center" ai="center" px={24} gap={24} {...props}>
      {/* Icon */}
      <UAnimatedView animation="fadeInUp" duration={400} position="relative">
        <YStack
          w={80}
          h={80}
          br={40}
          bg="$brandCrimson"
          opacity={0.1}
          jc="center"
          ai="center"
        />
        <YStack
          position="absolute"
          top={0}
          left={0}
          right={0}
          jc="center"
          ai="center"
          w={80}
          h={80}
        >
          <Feather name={icon} size={32} color={crimson} />
        </YStack>
      </UAnimatedView>

      {/* Text Content */}
      <UAnimatedView animation="fadeInUp" duration={400} delay={200}>
        <YStack ai="center" gap={8}>
          <UText variant="playfair-lg" color="$white" textAlign="center">
            {title}
          </UText>
          <UText
            variant="text-sm"
            color="$brandTeal"
            textAlign="center"
            opacity={0.9}
          >
            {message}
          </UText>
        </YStack>
      </UAnimatedView>

      {/* Retry Button */}
      {showRetry && onRetry && (
        <UAnimatedView animation="fadeInUp" duration={400} delay={300}>
          <UButton
            onPress={onRetry}
            bg="$brandCrimson"
            color="$white"
            px={32}
            br={12}
            pressStyle={{ opacity: 0.9, scale: 0.98 }}
          >
            {retryLabel}
          </UButton>
        </UAnimatedView>
      )}
    </YStack>
  );
};

export default memo(UScreenError);
