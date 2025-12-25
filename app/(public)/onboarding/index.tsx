import assets from '@/assets/images';
import { NeonButton } from '@/src/components/core/buttons/neonButton';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import { useRouter } from 'expo-router';
import React, { useCallback, memo } from 'react';
import { Image, ImageBackground, StyleSheet } from 'react-native';
import { YStack } from 'tamagui';

const styles = StyleSheet.create({
  background: { flex: 1 },
  logoContainer: { flex: 0.45, width: '100%', alignItems: 'center' },
  logo: { width: 200, height: '100%' },
});

const OnboardingScreen = memo(() => {
  const router = useRouter();

  const navigateToLogin = useCallback(() => {
    router.push('/(public)/login');
  }, [router]);

  const navigateToSignup = useCallback(() => {
    router.push('/(public)/signup');
  }, [router]);

  return (
    <ImageBackground
      source={assets.images.authBackgroundImage2}
      resizeMode="cover"
      style={styles.background}
    >
      <YStack f={1} jc="center" ai="center" px={10}>
        <UAnimatedView animation="fadeInScale" duration={600} style={styles.logoContainer}>
          <Image
            source={assets.images.mainLogo}
            style={styles.logo}
            resizeMode="contain"
          />
        </UAnimatedView>

        <UAnimatedView animation="fadeInUp" delay={300}>
          <NeonButton onPress={navigateToLogin} width={280}>
            Log In
          </NeonButton>
        </UAnimatedView>

        <UAnimatedView animation="fadeInUp" delay={450}>
          <NeonButton onPress={navigateToSignup} mt={15} width={280}>
            Sign Up
          </NeonButton>
        </UAnimatedView>
      </YStack>
    </ImageBackground>
  );
});

OnboardingScreen.displayName = 'OnboardingScreen';

export default OnboardingScreen;
