import React, { memo } from 'react';
import { XStack, YStack, YStackProps, getTokenValue } from 'tamagui';
import { Feather, Ionicons } from '@expo/vector-icons';

import UText from '@/src/components/core/text/uText';
import { NeonButton } from '@/src/components/core/buttons/neonButton';
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
  retryLabel = 'Retry',
  icon = 'wifi-off',
  showRetry = true,
  ...props
}) => (
  <YStack flex={1} jc="center" px={16} {...props}>
    <UAnimatedView animation="fadeInUp" duration={400}>
      <YStack
        minHeight={300}
        p={24}
        gap={14}
        ai="center"
        jc="center"
        br={24}
        bg="$glass"
        borderWidth={1}
        borderColor="$glassBorder"
        accessibilityRole="alert"
      >
        <YStack
          w={56}
          h={56}
          br={28}
          ai="center"
          jc="center"
          bg="rgba(135,54,247,0.14)"
          borderWidth={1}
          borderColor="rgba(135,54,247,0.4)"
          boxShadow="0 0 24px rgba(135,54,247,0.35)"
        >
          <Feather name={icon} size={26} color={getTokenValue('$accentPurple', 'color')} />
        </YStack>

        <UText variant="display-s" fontSize={15} lineHeight={20} color="$textPrimary" textAlign="center">
          {title}
        </UText>
        <UText variant="body" fontSize={14} lineHeight={20} color="$textSecondary" textAlign="center" maxWidth={260}>
          {message}
        </UText>

        {showRetry && onRetry && (
          <NeonButton tone="secondary" h={44} px={22} onPress={onRetry}>
            <XStack gap={8} ai="center">
              <Ionicons name="refresh" size={18} color={getTokenValue('$accentCyan', 'color')} />
              <UText variant="label-button" fontSize={12} lineHeight={16} letterSpacing={0.96} color="$accentCyan">
                {retryLabel}
              </UText>
            </XStack>
          </NeonButton>
        )}
      </YStack>
    </UAnimatedView>
  </YStack>
);

export default memo(UScreenError);
