import React, { useRef } from 'react';
import { TextInput } from 'react-native';

import UFormScreen from '@/src/components/core/layout/uFormScreen';
import UInput from '@/src/components/core/inputs/uInput';
import UText from '@/src/components/core/text/uText';
import { NeonButton } from '@/src/components/core/buttons/neonButton';
import { PASSWORD_REQUIREMENTS } from '@/src/utils/passwordValidation';

import { useChangePassword } from '@/src/changePassword/hooks/useChangePassword';

export function ChangePasswordScreen() {
  const {
    oldPassword,
    newPassword,
    confirmPassword,
    setOldPassword,
    setNewPassword,
    setConfirmPassword,
    handleSubmit,
    isSubmitting,
    errors,
    showErrors,
  } = useChangePassword();
  const newPasswordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);
  const newPasswordError = showErrors ? errors.newPassword : undefined;

  return (
    <UFormScreen
      title="Change Password"
      footer={<NeonButton onPress={handleSubmit} loading={isSubmitting} title="Update Password" />}
    >
      <UInput
        variant="glass"
        label="Current password"
        placeholder="Enter current password"
        value={oldPassword}
        onChangeText={setOldPassword}
        error={showErrors ? errors.oldPassword : undefined}
        secureTextEntry
        autoComplete="current-password"
        autoCapitalize="none"
        textContentType="password"
        returnKeyType="next"
        onSubmitEditing={() => newPasswordRef.current?.focus()}
      />

      <UInput
        ref={newPasswordRef}
        variant="glass"
        label="New password"
        placeholder="Enter new password"
        value={newPassword}
        onChangeText={setNewPassword}
        error={newPasswordError}
        secureTextEntry
        autoComplete="new-password"
        autoCapitalize="none"
        textContentType="newPassword"
        returnKeyType="next"
        onSubmitEditing={() => confirmPasswordRef.current?.focus()}
      />

      {!newPasswordError && (
        <UText variant="body-s" color="$textMuted">
          {PASSWORD_REQUIREMENTS.join(' · ')}
        </UText>
      )}

      <UInput
        ref={confirmPasswordRef}
        variant="glass"
        label="Confirm new password"
        placeholder="Enter new password again"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        error={showErrors ? errors.confirmPassword : undefined}
        secureTextEntry
        autoComplete="new-password"
        autoCapitalize="none"
        textContentType="newPassword"
        returnKeyType="done"
        onSubmitEditing={handleSubmit}
      />
    </UFormScreen>
  );
}
