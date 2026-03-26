/**
 * Reset Password Screen Component
 *
 * Pure UI component - all logic handled by useResetPasswordForm hook.
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
import { useResetPasswordForm } from '@/src/auth/reset-password/hooks/useResetPasswordForm';

const authScreenBg = require('@/assets/images/authScreenBg.jpg');
const mainLogo = require('@/assets/images/mainLogo.png');

const styles = StyleSheet.create({
  background: { flex: 1 },
});

export const ResetPasswordScreen = memo(() => {
  const { top, bottom } = useSafeAreaInsets();

  const {
    password,
    passwordError,
    isLoading,
    handlePasswordChange,
    handleSubmit,
    navigateToLogin,
  } = useResetPasswordForm();

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
              Reset Password
            </UText>
          </UAnimatedView>
          <UAnimatedView animation="fadeInUp" delay={200}>
            <UText variant="text-sm" color="$white">
              Set a new password for your account
            </UText>
          </UAnimatedView>

          <UKeyboardAvoidingView gap={16} mt={25}>
            <UAnimatedView animation="fadeInUp" delay={300}>
              <UInput
                variant="primary"
                placeholder="Enter your new password"
                value={password}
                onChangeText={handlePasswordChange}
                error={passwordError}
                secureTextEntry
                autoComplete="new-password"
                autoCapitalize="none"
                textContentType="newPassword"
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
              />
            </UAnimatedView>
          </UKeyboardAvoidingView>
        </YStack>

        <UAnimatedView animation="fadeInUp" delay={400}>
          <YStack gap={16}>
            <NeonButton onPress={handleSubmit} loading={isLoading} title='Submit' />
            <XStack jc="center" mt={16}>
              <UText
                variant="text-md"
                color="$white"
                textDecorationLine="underline"
                onPress={navigateToLogin}
              >
                Back to Login
              </UText>
            </XStack>
          </YStack>
        </UAnimatedView>
      </YStack>
    </ImageBackground>
  );
});

ResetPasswordScreen.displayName = 'ResetPasswordScreen';
