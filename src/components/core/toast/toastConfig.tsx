import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast, { ToastConfig, ToastConfigParams } from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import { XStack, YStack, getTokenValue } from 'tamagui';

import UText from '@/src/components/core/text/uText';

/** Optional action button, passed as Toast.show({ props: { action } }) */
export interface ToastAction {
  label: string;
  onPress: () => void;
}

// Design system toasts: cyan glass for success, red glass for errors, purple glass for info
const TONES = {
  success: {
    bg: 'rgba(10,25,45,0.9)',
    border: 'rgba(0,240,255,0.35)',
    glow: '0 0 24px rgba(0,240,255,0.15)',
    icon: 'checkmark-circle-outline',
    iconColor: '$accentCyan',
    text: '$textSecondary',
  },
  error: {
    bg: 'rgba(45,10,10,0.85)',
    border: 'rgba(255,60,60,0.35)',
    glow: '0 0 24px rgba(255,60,60,0.18)',
    icon: 'alert-circle-outline',
    iconColor: '$danger',
    text: '$errorToastText',
  },
  info: {
    bg: 'rgba(18,14,42,0.9)',
    border: '$glassGlowBorder',
    glow: '0 0 24px rgba(135,54,247,0.2)',
    icon: 'information-circle-outline',
    iconColor: '$accentPurple',
    text: '$textSecondary',
  },
} as const;

type Tone = keyof typeof TONES;

const UToast = ({ tone, text1, text2, props }: ToastConfigParams<{ action?: ToastAction }> & { tone: Tone }) => {
  const { top } = useSafeAreaInsets();
  const colors = TONES[tone];
  const action = props?.action;

  return (
    <XStack
      mt={top}
      mx={16}
      minHeight={56}
      py={10}
      pl={14}
      pr={action ? 8 : 14}
      gap={12}
      ai="center"
      br={16}
      borderWidth={1}
      bg={colors.bg}
      borderColor={colors.border}
      boxShadow={colors.glow}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <Ionicons name={colors.icon} size={20} color={getTokenValue(colors.iconColor, 'color')} />
      <YStack flex={1} gap={2}>
        {!!text1 && (
          <UText variant="body" fontSize={14} lineHeight={20} fontWeight="600" color="$textPrimary" numberOfLines={1}>
            {text1}
          </UText>
        )}
        {!!text2 && (
          <UText variant="body-s" color={colors.text} numberOfLines={2}>
            {text2}
          </UText>
        )}
      </YStack>
      {action && (
        <YStack
          h={44}
          px={14}
          jc="center"
          onPress={() => {
            Toast.hide();
            action.onPress();
          }}
          accessible
          accessibilityRole="button"
          accessibilityLabel={action.label}
        >
          <UText variant="label-button" fontSize={11} lineHeight={14} letterSpacing={0.88} color="$textPrimary">
            {action.label}
          </UText>
        </YStack>
      )}
    </XStack>
  );
};

export const toastConfig: ToastConfig = {
  success: (params) => <UToast tone="success" {...params} />,
  error: (params) => <UToast tone="error" {...params} />,
  info: (params) => <UToast tone="info" {...params} />,
};

export default toastConfig;
