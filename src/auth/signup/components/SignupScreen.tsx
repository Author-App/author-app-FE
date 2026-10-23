/**
 * Signup Screen Component
 *
 * Pure UI component - all logic handled by useSignupForm hook.
 */

import React, { memo } from 'react';
import { XStack } from 'tamagui';

import AuthLayout from '@/src/auth/components/AuthLayout';
import AuthLink from '@/src/auth/components/AuthLink';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import { NeonButton } from '@/src/components/core/buttons/neonButton';
import UInput from '@/src/components/core/inputs/uInput';
import { useSignupForm } from '@/src/auth/signup/hooks/useSignupForm';

export const SignupScreen = memo(() => {
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
    <AuthLayout
      title="Create Account"
      subtitle="Sign up to get started"
      footer={<NeonButton scan onPress={handleSubmit} loading={isLoading} title="Sign Up" />}
    >
      <UAnimatedView animation="fadeInUp" delay={300}>
        <UInput
          variant="glass"
          label="Full name"
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
      <UAnimatedView animation="fadeInUp" delay={500}>
        <UInput
          ref={passwordRef}
          variant="glass"
          label="Password"
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
      <UAnimatedView animation="fadeIn" delay={600}>
        <XStack jc="flex-end">
          <AuthLink onPress={navigateToLogin}>Already have an account? Sign in</AuthLink>
        </XStack>
      </UAnimatedView>
    </AuthLayout>
  );
});

SignupScreen.displayName = 'SignupScreen';
