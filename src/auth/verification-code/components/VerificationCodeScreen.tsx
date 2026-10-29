/**
 * Verification Code Screen Component
 *
 * Pure UI component - all logic handled by useVerificationCodeForm hook.
 */

import React, { memo } from 'react';
import OTPTextView from 'react-native-otp-textinput';
import { getTokenValue, YStack } from 'tamagui';

import AuthLayout from '@/src/auth/components/AuthLayout';
import AuthLink from '@/src/auth/components/AuthLink';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import { NeonButton } from '@/src/components/core/buttons/neonButton';
import { FieldError } from '@/src/components/core/inputs/uInput';
import { useVerificationCodeForm } from '@/src/auth/verification-code/hooks/useVerificationCodeForm';

export const VerificationCodeScreen = memo(() => {
  const {
    codeError,
    isLoading,
    handleOTPChange,
    handleSubmit,
    navigateToLogin,
  } = useVerificationCodeForm();

  // The OTP library takes plain colors, not Tamagui tokens
  const otpBoxStyle = {
    height: 50,
    borderWidth: 1,
    borderBottomWidth: 1,
    borderRadius: 14,
    backgroundColor: getTokenValue('$glass', 'color'),
    color: getTokenValue('$textPrimary', 'color'),
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
  };

  return (
    <AuthLayout
      title="Verification Code"
      subtitle="Enter verification code sent to your email address."
      footer={<NeonButton scan onPress={handleSubmit} loading={isLoading} title="Verify" />}
    >
      <UAnimatedView animation="fadeInUp" delay={300}>
        <YStack gap={6}>
          <OTPTextView
            inputCount={6}
            keyboardType="number-pad"
            handleTextChange={handleOTPChange}
            tintColor={getTokenValue('$accentCyan', 'color')}
            offTintColor={getTokenValue(codeError ? '$inputErrorBorder' : '$inputBorder', 'color')}
            textInputStyle={otpBoxStyle}
          />
          {codeError && <FieldError message={codeError} />}
        </YStack>
      </UAnimatedView>
      <UAnimatedView animation="fadeIn" delay={400}>
        <AuthLink onPress={navigateToLogin}>Back to login</AuthLink>
      </UAnimatedView>
    </AuthLayout>
  );
});

VerificationCodeScreen.displayName = 'VerificationCodeScreen';
