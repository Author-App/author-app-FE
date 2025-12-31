import React from 'react';
import { YStack } from 'tamagui';

import UInput from '@/src/components/core/inputs/uInput';
import { NeonButton } from '@/src/components/core/buttons/neonButton';

interface ChangePasswordFormProps {
  oldPassword: string;
  newPassword: string;
  onOldPasswordChange: (value: string) => void;
  onNewPasswordChange: (value: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  errors?: {
    oldPassword?: string;
    newPassword?: string;
  };
  showErrors: boolean;
}

export function ChangePasswordForm({
  oldPassword,
  newPassword,
  onOldPasswordChange,
  onNewPasswordChange,
  onSubmit,
  isSubmitting,
  errors,
  showErrors,
}: ChangePasswordFormProps) {
  return (
    <YStack gap={16}>
      <UInput
        variant="primary"
        placeholder="Enter current password"
        value={oldPassword}
        onChangeText={onOldPasswordChange}
        error={showErrors ? errors?.oldPassword : undefined}
        secureTextEntry
        autoComplete="current-password"
        autoCapitalize="none"
        textContentType="password"
      />

      <UInput
        variant="primary"
        placeholder="Enter new password"
        value={newPassword}
        onChangeText={onNewPasswordChange}
        error={showErrors ? errors?.newPassword : undefined}
        secureTextEntry
        autoComplete="new-password"
        autoCapitalize="none"
        textContentType="newPassword"
      />

      <YStack mt={8}>
        <NeonButton onPress={onSubmit} loading={isSubmitting}>
          Update Password
        </NeonButton>
      </YStack>
    </YStack>
  );
}
