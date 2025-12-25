import { NeonButton } from '@/src/components/core/buttons/neonButton';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import { useRouter } from 'expo-router';
import React, { useCallback, memo, useState } from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { YStack, View } from 'tamagui';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
  interpolate,
} from 'react-native-reanimated';
import ULocalImage from '@/src/components/core/image/uLocalImage';

const authScreenBg = require('@/assets/images/authScreenBg.png');
const mainLogo = require('@/assets/images/mainLogo.png');

const LOGO_WIDTH = 240;
const LOGO_HEIGHT = 336;

// Final logo position on auth screens (left is fixed, top is relative to safe area)
const AUTH_LOGO_LEFT = 24;
const AUTH_LOGO_WIDTH = 130;
const AUTH_LOGO_HEIGHT = 70;

const styles = StyleSheet.create({
  background: { flex: 1 },
});

const OnboardingScreen = memo(() => {
  const router = useRouter();
  const { top: safeTop } = useSafeAreaInsets();
  const [initialPosition, setInitialPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  // Animation progress (0 = initial centered, 1 = at auth position)
  const exitProgress = useSharedValue(0);
  const isAnimating = useSharedValue(false);

  // Animated style for logo movement
  const animatedLogoStyle = useAnimatedStyle(() => {
    const top = interpolate(exitProgress.value, [0, 1], [initialPosition.top, safeTop + 8]);
    const left = interpolate(exitProgress.value, [0, 1], [initialPosition.left, AUTH_LOGO_LEFT]);
    const width = interpolate(exitProgress.value, [0, 1], [LOGO_WIDTH, AUTH_LOGO_WIDTH]);
    const height = interpolate(exitProgress.value, [0, 1], [LOGO_HEIGHT, AUTH_LOGO_HEIGHT]);

    return {
      position: 'absolute',
      top,
      left,
      width,
      height,
      zIndex: 10,
    };
  });

  const navigateToScreen = useCallback((screen: 'login' | 'signup') => {
    if (screen === 'login') return router.push('/(public)/login');
    else if (screen === 'signup') return router.push('/(public)/signup');

  }, [router]);

  const animateAndNavigate = useCallback((screen: 'login' | 'signup') => {
    if (isAnimating.value) return;
    isAnimating.value = true;

    exitProgress.value = withTiming(1, {
      duration: 400,
      easing: Easing.out(Easing.cubic),
    }, () => {
      runOnJS(navigateToScreen)(screen);
    });
  }, [navigateToScreen]);

  const handleLoginPress = useCallback(() => {
    animateAndNavigate('login');
  }, [animateAndNavigate]);

  const handleSignupPress = useCallback(() => {
    animateAndNavigate('signup');
  }, [animateAndNavigate]);

  return (
    <ImageBackground
      source={authScreenBg}
      resizeMode="cover"
      style={styles.background}
    >
      {/* Absolutely positioned logo - animates to top-left */}
      <UAnimatedView animation="fadeInScale" duration={600}>
        <Animated.View style={animatedLogoStyle}>
          <ULocalImage
            source={mainLogo}
            width="100%"
            height="100%"
          />
        </Animated.View>
      </UAnimatedView>

      <YStack flex={1} jc="center" ai="center" px={10}>
        
        {/* Transparent placeholder to maintain layout */}
        <View height={LOGO_HEIGHT} width={LOGO_WIDTH} onLayout={(event) => {
          const { y, x } = event.nativeEvent.layout;
          setInitialPosition({ top: y, left: x });

        }} />

        <UAnimatedView animation="fadeInUp" delay={300}>
          <NeonButton onPress={handleLoginPress} width={280}>
            Log In
          </NeonButton>
        </UAnimatedView>

        <UAnimatedView animation="fadeInUp" delay={450}>
          <NeonButton onPress={handleSignupPress} mt={15} width={280}>
            Sign Up
          </NeonButton>
        </UAnimatedView>
      </YStack>
    </ImageBackground>
  );
});

OnboardingScreen.displayName = 'OnboardingScreen';

export default OnboardingScreen;