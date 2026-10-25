import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, { SharedValue, useAnimatedStyle, withSequence, withTiming } from 'react-native-reanimated';

import UText from '@/src/components/core/text/uText';
import UGradientText from '@/src/components/core/text/uGradientText';

/** One glitch: the value swings -1..1 and settles at 0. */
export const burst = (scale = 1) =>
  withSequence(
    withTiming(1 * scale, { duration: 60 }),
    withTiming(-1 * scale, { duration: 60 }),
    withTiming(0.6 * scale, { duration: 50 }),
    withTiming(-0.4 * scale, { duration: 50 }),
    withTiming(0, { duration: 80 })
  );

interface UGlitchWordmarkProps {
  /** -1..1, 0 at rest. Drives the RGB split and the jitter. */
  glitch: SharedValue<number>;
  children: string;
  /** Font size; the split scales with it so it reads the same at any size */
  size?: number;
  lineHeight?: number;
  textAlign?: 'left' | 'center';
}

/** Cyan and magenta copies sit behind the gradient wordmark and split apart during a burst. */
export default function UGlitchWordmark({ glitch, children, size = 26, lineHeight, textAlign }: UGlitchWordmarkProps) {
  const split = size * 0.15;
  const textProps = {
    variant: 'wordmark-lg' as const,
    fontSize: size,
    lineHeight: lineHeight ?? size * 1.23,
    letterSpacing: size * 0.12,
    textAlign,
  };

  const cyanStyle = useAnimatedStyle(() => ({
    opacity: Math.abs(glitch.value) * 0.8,
    transform: [{ translateX: glitch.value * -split }],
  }));
  const magentaStyle = useAnimatedStyle(() => ({
    opacity: Math.abs(glitch.value) * 0.8,
    transform: [{ translateX: glitch.value * split }],
  }));
  const baseStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: glitch.value * split * 0.4 }],
  }));

  return (
    <>
      {/* Decoration only: hidden from screen readers so the name is read once */}
      <Animated.View
        style={[StyleSheet.absoluteFill, cyanStyle]}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <UText {...textProps} color="$glowCyan">{children}</UText>
      </Animated.View>
      <Animated.View
        style={[StyleSheet.absoluteFill, magentaStyle]}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <UText {...textProps} color="$magentaGlow">{children}</UText>
      </Animated.View>
      <Animated.View style={baseStyle}>
        <UGradientText {...textProps} accessibilityRole="header">
          {children}
        </UGradientText>
      </Animated.View>
    </>
  );
}
