import React, { memo, useEffect } from 'react';
import { ActivityIndicator, useWindowDimensions } from 'react-native';
import {
  cancelAnimation,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { YStack, getTokenValue } from 'tamagui';

import UGlitchWordmark, { burst } from '@/src/components/core/text/uGlitchWordmark';

// splashLogo.png is a 1024px square with the wordmark at 94px, shown with resizeMode "contain".
// Scaling the same way puts this wordmark exactly where the native splash left it.
const SPLASH_SIZE = 1024;
const SPLASH_FONT_SIZE = 94;

/** Boot screen after the native splash hides, while the session is restored. */
const AppLoader = () => {
  const { width, height } = useWindowDimensions();
  const fontSize = (SPLASH_FONT_SIZE * Math.min(width, height)) / SPLASH_SIZE;
  const glitch = useSharedValue(0);
  const reduceMotion = useReducedMotion();

  // Much busier than onboarding's (bursts about every second, not every 4s): it signals work in progress
  useEffect(() => {
    if (reduceMotion) return;
    glitch.value = withDelay(
      300,
      withRepeat(
        withSequence(burst(), withDelay(450, burst(0.5)), withDelay(650, withTiming(0, { duration: 0 }))),
        -1
      )
    );
    return () => cancelAnimation(glitch);
  }, [glitch, reduceMotion]);

  return (
    <YStack flex={1} bg="$bgPage" ai="center" jc="center" accessible accessibilityLabel="Loading">
      <YStack>
        <UGlitchWordmark glitch={glitch} size={fontSize} lineHeight={fontSize * 1.15} textAlign="center">
          {'STANLEY\nPADEN'}
        </UGlitchWordmark>
      </YStack>
      <YStack pos="absolute" bottom={height * 0.15}>
        <ActivityIndicator color={getTokenValue('$accentCyan', 'color')} />
      </YStack>
    </YStack>
  );
};

export default memo(AppLoader);
