import { NeonButton } from '@/src/components/core/buttons/neonButton';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, memo, useRef } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { YStack, getTokenValue, useMedia } from 'tamagui';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  withRepeat,
  cancelAnimation,
  useReducedMotion,
  SharedValue,
  Easing,
  runOnJS,
  interpolate,
} from 'react-native-reanimated';
import AuthBackground from '@/src/auth/components/AuthBackground';
import { COLUMN_WIDTH } from '@/src/auth/components/AuthLayout';
import UGlitchWordmark, { burst } from '@/src/components/core/text/uGlitchWordmark';
import { WIDE_DISPLAY_SCALE } from '@/src/components/core/text/uText';

const LOGIN_WORDMARK_SIZE = 14;
// "STANLEY PADEN" is 11.55em wide with 0.12em spacing, measured from Orbitron-Black.ttf
const WORDMARK_WIDTH_EM = 11.55;
const WORDMARK_SIZE = 26;
const WIDE_WORDMARK_SIZE = 48;
const GUTTER = 24;

// glitch: -1..1 drives the RGB split and the jitter, 0 at rest. Uneven gaps so it is not mechanical
const loopGlitch = (glitch: SharedValue<number>) => {
  glitch.value = withDelay(
    600,
    withRepeat(
      withSequence(burst(), withDelay(900, burst(0.5)), withDelay(3200, withTiming(0, { duration: 0 }))),
      -1
    )
  );
};

const WORDMARK = 'Stanley Paden';

const OnboardingScreen = memo(() => {
  const router = useRouter();
  const { top, bottom } = useSafeAreaInsets();
  const { width: screenWidth, fontScale } = useWindowDimensions();
  const { gtXs: isWide } = useMedia();
  const wordmarkSize = isWide ? WIDE_WORDMARK_SIZE : WORDMARK_SIZE;
  const exitScale = (LOGIN_WORDMARK_SIZE * (isWide ? WIDE_DISPLAY_SCALE : 1)) / wordmarkSize;

  // Scaled down to fit the gutter at large Dynamic Type; +8 absorbs kerning and rounding
  const wordmarkWidth = Math.ceil(wordmarkSize * fontScale * WORDMARK_WIDTH_EM) + 8;
  const fitScale = Math.min(1, (screenWidth - GUTTER * 2) / wordmarkWidth);
  // Left edge of Login's wordmark: the gutter, plus the margin of its centered column
  const loginWordmarkX = GUTTER + Math.max(0, (screenWidth - GUTTER * 2 - COLUMN_WIDTH) / 2);
  const wordmarkRef = useRef<View>(null);
  const accentColors = [getTokenValue('$glowPurple', 'color'), getTokenValue('$glowCyan', 'color')] as const;

  // Animation progress (0 = in place, 1 = at Login's wordmark position)
  const exitProgress = useSharedValue(0);
  const exitOffsetX = useSharedValue(0);
  const exitOffsetY = useSharedValue(0);
  const isAnimating = useSharedValue(false);
  const glitch = useSharedValue(0);
  const reduceMotion = useReducedMotion();

  // Reset on every focus, and stop the loop on blur: Login is pushed on top of this screen
  useFocusEffect(
    useCallback(() => {
      exitProgress.value = 0;
      isAnimating.value = false;
      if (!reduceMotion) loopGlitch(glitch);
      return () => cancelAnimation(glitch);
    }, [exitProgress, isAnimating, glitch, reduceMotion])
  );

  const animatedWordmarkStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: exitProgress.value * exitOffsetX.value },
      { translateY: exitProgress.value * exitOffsetY.value },
      { scale: interpolate(exitProgress.value, [0, 1], [fitScale, exitScale]) },
    ],
  }));

  const navigateToScreen = useCallback((screen: 'login' | 'signup') => {
    router.push(screen === 'login' ? '/(public)/login' : '/(public)/signup');
  }, [router]);

  const animateAndNavigate = useCallback((screen: 'login' | 'signup') => {
    if (isAnimating.value) return;
    isAnimating.value = true;
    if (!reduceMotion) glitch.value = burst();

    wordmarkRef.current?.measureInWindow((x, y) => {
      // Login draws its wordmark at the top inset + 16
      exitOffsetX.value = loginWordmarkX - x;
      exitOffsetY.value = top + 16 - y;
      exitProgress.value = withTiming(1, {
        duration: 400,
        easing: Easing.out(Easing.cubic),
      }, () => {
        runOnJS(navigateToScreen)(screen);
      });
    });
  }, [navigateToScreen, top, loginWordmarkX, glitch, reduceMotion]);

  const handleLoginPress = useCallback(() => {
    animateAndNavigate('login');
  }, [animateAndNavigate]);

  const handleSignupPress = useCallback(() => {
    animateAndNavigate('signup');
  }, [animateAndNavigate]);

  return (
    <YStack flex={1} bg="$bgPage">
      <AuthBackground />

      <YStack flex={1} px={GUTTER} pt={top + 16} pb={bottom + 16}>
        <YStack flex={1} jc="center" gap={20} pb={40}>
          <UAnimatedView animation="fadeInScale" duration={600}>
            {/* Fixed width so the text can never wrap; the scale keeps it inside the gutter */}
            <Animated.View
              ref={wordmarkRef}
              style={[styles.wordmark, isWide && styles.centered, { width: wordmarkWidth }, animatedWordmarkStyle]}
            >
              <UGlitchWordmark glitch={glitch} size={wordmarkSize}>
                {WORDMARK}
              </UGlitchWordmark>
            </Animated.View>
          </UAnimatedView>
          <LinearGradient
            colors={accentColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.accent, isWide && styles.centered]}
          />
        </YStack>

        <YStack gap={12} w="100%" maw={COLUMN_WIDTH} als="center">
          <UAnimatedView animation="fadeInUp" delay={300}>
            <NeonButton scan testID="onboarding-login" onPress={handleLoginPress} title="Log In" />
          </UAnimatedView>

          <UAnimatedView animation="fadeInUp" delay={450}>
            <NeonButton tone="secondary" onPress={handleSignupPress} title="Sign Up" />
          </UAnimatedView>
        </YStack>
      </YStack>
    </YStack>
  );
});

const styles = StyleSheet.create({
  // Scale from the top-left corner, so the wordmark shrinks toward Login's position
  wordmark: { alignSelf: 'flex-start', transformOrigin: 'left top' },
  centered: { alignSelf: 'center' },
  accent: { width: 56, height: 2, borderRadius: 1, boxShadow: '0 0 10px rgba(0,240,255,0.6)' },
});

OnboardingScreen.displayName = 'OnboardingScreen';

export default OnboardingScreen;
