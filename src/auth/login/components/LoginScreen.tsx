import React, { memo } from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { XStack, YStack } from 'tamagui';

import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import { NeonButton } from '@/src/components/core/buttons/neonButton';
import ULocalImage from '@/src/components/core/image/uLocalImage';
import UInput from '@/src/components/core/inputs/uInput';
import UKeyboardAvoidingView from '@/src/components/core/layout/uKeyboardAvoidingView';
import UText from '@/src/components/core/text/uText';
import { useLoginForm } from '@/src/auth/login/hooks/useLoginForm';

const authScreenBg = require('@/assets/images/authScreenBg.jpg');
const mainLogo = require('@/assets/images/mainLogo.png');

const styles = StyleSheet.create({
  background: { flex: 1 },
});

export const LoginScreen = memo(() => {
  const { top, bottom } = useSafeAreaInsets();

  const {
    email,
    password,
    emailError,
    passwordError,
    isLoading,
    handleEmailChange,
    handlePasswordChange,
    handleSubmit,
    focusPassword,
    navigateToForgotPassword,
    navigateToSignup,
    passwordRef,
  } = useLoginForm();

  return (
    <ImageBackground
      source={authScreenBg}
      resizeMode="cover"
      style={styles.background}
    >
      <UAnimatedView animation="fadeIn" duration={400}>
        <ULocalImage source={mainLogo} width={130} height={70} mt={top + 8} />
      </UAnimatedView>
      <YStack flex={1} px={24} pb={bottom + 8} jc="space-between">
        <YStack gap={10} flex={1}>
          <UAnimatedView animation="fadeInUp" delay={100}>
            <UText variant="heading-h1" color="$white">
              Sign In to your Account
            </UText>
          </UAnimatedView>
          <UAnimatedView animation="fadeInUp" delay={200}>
            <UText variant="text-sm" color="$white">
              Let's Sign in to your account
            </UText>
          </UAnimatedView>

          <UKeyboardAvoidingView gap={16} mt={25}>
            <UAnimatedView animation="fadeInUp" delay={300}>
              <UInput
                variant="primary"
                placeholder="Enter your email"
                value={email}
                onChangeText={handleEmailChange}
                error={emailError}
                keyboardType="email-address"
                autoComplete="email"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="emailAddress"
                returnKeyType="next"
                onSubmitEditing={focusPassword}
                blurOnSubmit={false}
              />
            </UAnimatedView>
            <UAnimatedView animation="fadeInUp" delay={400}>
              <UInput
                ref={passwordRef}
                variant="primary"
                placeholder="Enter your password"
                value={password}
                onChangeText={handlePasswordChange}
                error={passwordError}
                secureTextEntry
                autoComplete="current-password"
                autoCapitalize="none"
                textContentType="password"
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
              />
            </UAnimatedView>
            <UAnimatedView animation="fadeIn" delay={500}>
              <XStack jc="flex-end">
                <UText
                  variant="text-sm"
                  color="$white"
                  fontWeight={600}
                  onPress={navigateToForgotPassword}
                >
                  Forgot Password?
                </UText>
              </XStack>
            </UAnimatedView>
          </UKeyboardAvoidingView>
        </YStack>

        <UAnimatedView animation="fadeInUp" delay={600}>
          <YStack gap={16}>
            <NeonButton onPress={handleSubmit} loading={isLoading}>
              Sign In
            </NeonButton>

            <XStack jc="center" mt={16}>
              <UText variant="text-sm" color="$white">
                Don't have an account?{' '}
              </UText>
              <UText variant="text-sm" color="$white" onPress={navigateToSignup}>
                Sign Up
              </UText>
            </XStack>
          </YStack>
        </UAnimatedView>
      </YStack>
    </ImageBackground>
  );
});

LoginScreen.displayName = 'LoginScreen';
