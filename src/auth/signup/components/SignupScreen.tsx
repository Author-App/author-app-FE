/**
 * Signup Screen Component
 *
 * Pure UI component - all logic handled by useSignupForm hook.
 */

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
import { useSignupForm } from '@/src/auth/signup/hooks/useSignupForm';

const authScreenBg = require('@/assets/images/authScreenBg.jpg');
const mainLogo = require('@/assets/images/mainLogo.png');

const styles = StyleSheet.create({
  background: { flex: 1 },
});

export const SignupScreen = memo(() => {
  const { top, bottom } = useSafeAreaInsets();

  const {
    fullName,
    email,
    password,
    fullNameError,
    emailError,
    passwordError,
    isLoading,
    handleFullNameChange,
    handleEmailChange,
    handlePasswordChange,
    handleSubmit,
    focusEmail,
    focusPassword,
    navigateToLogin,
    emailRef,
    passwordRef,
  } = useSignupForm();

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
              Create Account
            </UText>
          </UAnimatedView>
          <UAnimatedView animation="fadeInUp" delay={200}>
            <UText variant="text-sm" color="$white">
              Sign up to get started
            </UText>
          </UAnimatedView>

          <UKeyboardAvoidingView gap={16} mt={25}>
            <UAnimatedView animation="fadeInUp" delay={300}>
              <UInput
                variant="primary"
                placeholder="Enter your full name"
                value={fullName}
                onChangeText={handleFullNameChange}
                error={fullNameError}
                autoComplete="name"
                autoCapitalize="words"
                textContentType="name"
                returnKeyType="next"
                onSubmitEditing={focusEmail}
                blurOnSubmit={false}
              />
            </UAnimatedView>
            <UAnimatedView animation="fadeInUp" delay={400}>
              <UInput
                ref={emailRef}
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
            <UAnimatedView animation="fadeInUp" delay={500}>
              <UInput
                ref={passwordRef}
                variant="primary"
                placeholder="Enter your password"
                value={password}
                onChangeText={handlePasswordChange}
                error={passwordError}
                secureTextEntry
                autoComplete="password"
                autoCapitalize="none"
                textContentType="password"
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
              />
            </UAnimatedView>
          </UKeyboardAvoidingView>
        </YStack>

        <UAnimatedView animation="fadeInUp" delay={600}>
          <YStack gap={16}>
            <NeonButton onPress={handleSubmit} loading={isLoading}>
              Sign Up
            </NeonButton>

            <XStack jc="center" mt={16}>
              <UText variant="text-sm" color="$white">
                Already have an account?{' '}
              </UText>
              <UText variant="text-sm" color="$white" onPress={navigateToLogin}>
                Sign In
              </UText>
            </XStack>
          </YStack>
        </UAnimatedView>
      </YStack>
    </ImageBackground>
  );
});

SignupScreen.displayName = 'SignupScreen';
