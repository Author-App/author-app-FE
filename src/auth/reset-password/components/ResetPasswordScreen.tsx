/**
 * Reset Password Screen Component
 *
 * Pure UI component - all logic handled by useResetPasswordForm hook.
 */

import React, { memo } from 'react';

import AuthLayout from '@/src/auth/components/AuthLayout';
import AuthLink from '@/src/auth/components/AuthLink';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import { NeonButton } from '@/src/components/core/buttons/neonButton';
import UInput from '@/src/components/core/inputs/uInput';
import { useResetPasswordForm } from '@/src/auth/reset-password/hooks/useResetPasswordForm';

export const ResetPasswordScreen = memo(() => {
  const {
    password,
    passwordError,
    isLoading,
    handlePasswordChange,
    handleSubmit,
    navigateToLogin,
  } = useResetPasswordForm();

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Set a new password for your account"
      footer={<NeonButton scan onPress={handleSubmit} loading={isLoading} title="Submit" />}
    >
      <UAnimatedView animation="fadeInUp" delay={300}>
        <UInput
          variant="glass"
          label="New password"
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
      <UAnimatedView animation="fadeIn" delay={400}>
        <AuthLink onPress={navigateToLogin}>Back to login</AuthLink>
      </UAnimatedView>
    </AuthLayout>
  );
});

ResetPasswordScreen.displayName = 'ResetPasswordScreen';
