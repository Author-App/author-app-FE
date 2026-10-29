/**
 * Forgot Password Screen Component
 *
 * Pure UI component - all logic handled by useForgotPasswordForm hook.
 */

import React, { memo } from 'react';

import AuthLayout from '@/src/auth/components/AuthLayout';
import AuthLink from '@/src/auth/components/AuthLink';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import { NeonButton } from '@/src/components/core/buttons/neonButton';
import UInput from '@/src/components/core/inputs/uInput';
import { useForgotPasswordForm } from '@/src/auth/forgot-password/hooks/useForgotPasswordForm';

export const ForgotPasswordScreen = memo(() => {
  const {
    email,
    emailError,
    isLoading,
    handleEmailChange,
    handleSubmit,
    navigateToLogin,
  } = useForgotPasswordForm();

  return (
    <AuthLayout
      title="Forgot Password"
      subtitle="Enter an email address to receive a verification code"
      footer={<NeonButton scan onPress={handleSubmit} loading={isLoading} title="Send Code" />}
    >
      <UAnimatedView animation="fadeInUp" delay={300}>
        <UInput
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
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
        />
      </UAnimatedView>
      <UAnimatedView animation="fadeIn" delay={400}>
        <AuthLink onPress={navigateToLogin}>Back to login</AuthLink>
      </UAnimatedView>
    </AuthLayout>
  );
});

ForgotPasswordScreen.displayName = 'ForgotPasswordScreen';
