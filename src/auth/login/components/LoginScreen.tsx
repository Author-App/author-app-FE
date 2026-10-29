import React, { memo } from 'react';
import { XStack } from 'tamagui';

import AuthLayout from '@/src/auth/components/AuthLayout';
import AuthLink from '@/src/auth/components/AuthLink';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import { NeonButton } from '@/src/components/core/buttons/neonButton';
import UInput from '@/src/components/core/inputs/uInput';
import { useLoginForm } from '@/src/auth/login/hooks/useLoginForm';

export const LoginScreen = memo(() => {
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
    <AuthLayout
      title="Sign In"
      footer={<NeonButton scan onPress={handleSubmit} loading={isLoading} title="Sign In" />}
    >
      <UAnimatedView animation="fadeInUp" delay={300}>
        <UInput
          testID="login-email"
          variant="glass"
          label="Email"
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
          testID="login-password"
          ref={passwordRef}
          variant="glass"
          label="Password"
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
        <XStack jc="space-between" ai="center">
          <AuthLink onPress={navigateToForgotPassword}>Forgot password?</AuthLink>
          <AuthLink onPress={navigateToSignup}>Sign up</AuthLink>
        </XStack>
      </UAnimatedView>
    </AuthLayout>
  );
});

LoginScreen.displayName = 'LoginScreen';
