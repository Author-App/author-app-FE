import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { Easing, FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { XStack, YStack, getTokenValue } from 'tamagui';

import UText from '@/src/components/core/text/uText';
import { FORM_WIDTH } from '@/src/components/core/layout/layout';

/** Optional action button, passed as Toast.show({ props: { action } }) */
export interface ToastAction {
  label: string;
  onPress: () => void;
}

type ToastType = 'success' | 'error' | 'info';

interface ToastOptions {
  type?: ToastType;
  text1?: string;
  text2?: string;
  /** ms before it hides itself */
  visibilityTime?: number;
  props?: { action?: ToastAction };
}

interface ShownToast extends ToastOptions {
  id: number;
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

const DEFAULT_VISIBILITY_MS = 4000;

let setShown: ((toast: ShownToast | null) => void) | null = null;
let nextId = 0;

/**
 * Same call shape as react-native-toast-message, which this replaces: its Android slide ran on
 * React Native Animated's JS driver (setNativeProps), the pattern behind the crash in BUG_LOG 5.6.
 * A newer toast replaces the current one. Calls made before ToastHost mounts are dropped.
 */
export const Toast = {
  show: (options: ToastOptions) => setShown?.({ ...options, id: ++nextId }),
  hide: () => setShown?.(null),
};

/** Mount once, near the root, inside the safe area and Tamagui providers. */
export function ToastHost() {
  const [toast, setToast] = useState<ShownToast | null>(null);
  const { top } = useSafeAreaInsets();

  useEffect(() => {
    setShown = setToast;
    return () => {
      setShown = null;
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), toast.visibilityTime ?? DEFAULT_VISIBILITY_MS);
    return () => clearTimeout(timer);
  }, [toast]);

  if (!toast) return null;

  const colors = TONES[toast.type ?? 'success'];
  const action = toast.props?.action;

  // Keyed by id: a new toast exits the old one and fades itself in.
  // A short timed fade, not a spring from off screen: the spring overshot and read as a lag
  return (
    <Animated.View
      key={toast.id}
      entering={FadeInUp.duration(220).easing(Easing.out(Easing.cubic))}
      exiting={FadeOutUp.duration(160)}
      style={[styles.host, { top: top + 8 }]}
      pointerEvents="box-none"
    >
      <XStack
        w="100%"
        maw={FORM_WIDTH}
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
        onPress={() => setToast(null)}
        accessibilityRole="alert"
        accessibilityLiveRegion="polite"
      >
        <Ionicons name={colors.icon} size={20} color={getTokenValue(colors.iconColor, 'color')} />
        <YStack flex={1} gap={2}>
          {!!toast.text1 && (
            <UText variant="body" fontSize={14} lineHeight={20} fontWeight="600" color="$textPrimary" numberOfLines={1}>
              {toast.text1}
            </UText>
          )}
          {!!toast.text2 && (
            <UText variant="body-s" color={colors.text} numberOfLines={2}>
              {toast.text2}
            </UText>
          )}
        </YStack>
        {action && (
          <YStack
            h={44}
            px={14}
            jc="center"
            onPress={() => {
              setToast(null);
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
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  host: { position: 'absolute', left: 16, right: 16, zIndex: 9999, alignItems: 'center' },
});
